// Aplicación principal "Iniciativa Envuelve tu Casa" v2.0
// Integra correcciones completas de auditoría técnica, seguridad RLS y elegibilidad estricta
(function () {
  const STORAGE_ANSWERS_KEY = "envuelve_answers_v2";
  const STORAGE_STEP_KEY = "envuelve_step_v2";
  const STORAGE_RESULT_KEY = "envuelve_result_v2";
  const STORAGE_LOCAL_DB_KEY = "envuelve_local_diagnosticos_v1";

  const CEV_LEVELS = [
    { letter: "A+", range: "> 85 pts", color: "#0B6E4F" },
    { letter: "A", range: "70 a 85 pts", color: "#1E8449" },
    { letter: "B", range: "55 a 70 pts", color: "#52BE80" },
    { letter: "C", range: "40 a 55 pts", color: "#A3D977" },
    { letter: "D", range: "20 a 40 pts", color: "#F4D03F" },
    { letter: "E", range: "-10 a 20 pts", color: "#EB984E" },
    { letter: "F", range: "-35 a -10 pts", color: "#DC7633" },
    { letter: "G", range: "< -35 pts", color: "#C0392B" }
  ];

  let supabaseClient = null;
  let supabaseUrlFixedNote = false;
  let lastSaveStatus = null; // "supabase" | "local_only" | "supabase_error"
  let statsChart = null;
  let currentStep = 0; // 0..4
  let answers = {};
  let lastDiagnosis = null;
  let openHelps = {};
  let assistantOpen = false;
  let assistantMessages = [];

  // 1) En Diagnóstico (/resultado): soluciones personalizadas basadas en respuestas
  let activeDiagnosisSolTab = "bajo_costo"; // bajo_costo | alto_impacto
  let filterArrendatarioOnly = false;

  // 2) En Tips y Subsidios (/tips-y-subsidios): solo tips útiles y subsidios vigentes 2026
  let activeTipsSubTab = "tips"; // tips | subsidios
  let tipSeasonFilter = "todas"; // todas | invierno | verano

  // --- Inicialización segura de Supabase (P0-A: sanitiza /rest/v1/ automáticamente) ---
  function initSupabase() {
    try {
      const cfg = window.SUPABASE_CONFIG || {};
      if (cfg.url && cfg.anonKey && window.supabase && window.supabase.createClient) {
        let cleanUrl = String(cfg.url).trim();
        if (/\/rest\/v1\/?$/i.test(cleanUrl)) {
          cleanUrl = cleanUrl.replace(/\/rest\/v1\/?$/i, "");
          supabaseUrlFixedNote = true;
          console.warn(
            "[Envuelve tu Casa] Se detectó '/rest/v1/' al final de SUPABASE_CONFIG.url y se limpió automáticamente a la URL raíz:",
            cleanUrl
          );
        }
        cleanUrl = cleanUrl.replace(/\/+$/, "");
        supabaseClient = window.supabase.createClient(cleanUrl, String(cfg.anonKey).trim());
      }
    } catch (err) {
      console.error("Error inicializando Supabase:", err);
      supabaseClient = null;
    }
  }

  function isFileProtocol() {
    return window.location.protocol === "file:";
  }

  function normalizeRoutePath(raw) {
    let p = String(raw || "/").trim().toLowerCase();
    // Quitar tildes comunes (ej. /estadísticas -> /estadisticas)
    p = p.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!p.startsWith("/")) p = "/" + p;
    if (p.length > 1) p = p.replace(/\/+$/, "");
    return p;
  }

  function getCurrentRoute() {
    // Soportar ?vista=estadisticas o hash (#estadisticas / #/estadisticas) incluso sin vercel.json
    const params = new URLSearchParams(window.location.search || "");
    const vistaParam = params.get("vista");
    if (vistaParam) {
      return normalizeRoutePath(vistaParam);
    }
    const rawHash = (window.location.hash || "").replace(/^#/, "");
    if (rawHash) {
      return normalizeRoutePath(rawHash);
    }
    if (isFileProtocol()) {
      return "/";
    }
    return normalizeRoutePath(window.location.pathname || "/");
  }

  function navigateTo(path) {
    if (isFileProtocol()) {
      window.location.hash = "#" + path;
    } else {
      window.history.pushState({}, "", path);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderRoute();
  }

  // --- Helpers de formato y catálogo ---
  function formatCLP(num) {
    if (typeof num !== "number" || isNaN(num)) return "";
    return "$" + num.toLocaleString("es-CL");
  }

  function getTagMap() {
    const map = {};
    const tags = (window.SOLUTIONS_CATALOG && window.SOLUTIONS_CATALOG.tags) || [];
    tags.forEach((t) => {
      map[t.tag] = t;
    });
    return map;
  }

  function getQuestionMap() {
    const map = {};
    const blocks = (window.QUESTIONS_DATA && window.QUESTIONS_DATA.blocks) || [];
    blocks.forEach((b) => {
      (b.questions || []).forEach((q) => {
        map[q.id] = q;
      });
    });
    return map;
  }

  function formatOrientacionesLabel(orientaciones) {
    const names = { norte: "Norte", oriente: "Oriente", poniente: "Poniente", sur: "Sur" };
    return (orientaciones || []).map((o) => names[o] || o).join(" + ");
  }

  function getFacadePlacementNote(sol, input) {
    const oris = Array.isArray(input.orientaciones) ? input.orientaciones : [];
    if (oris.length <= 1) return "";
    const hasNorte = oris.includes("norte");
    const hasPoniente = oris.includes("poniente");
    const hasSur = oris.includes("sur");

    if (sol.fachada_objetivo === "poniente" && hasPoniente) {
      return hasNorte
        ? "Instalar solo en ventanas al Poniente (evitar en fachada Norte para no bloquear el sol de invierno)."
        : "Instalar específicamente en tus ventanas orientadas al Poniente (sol de tarde).";
    }
    if (sol.fachada_objetivo === "norte_o_poniente") {
      if (hasNorte && hasPoniente) {
        return "En fachada Norte usa alero horizontal o toldo retráctil; en Poniente prioriza persiana exterior o toldo vertical para el sol bajo de tarde.";
      }
      if (hasNorte) {
        return "Instalar en fachada Norte (bloquea el sol alto en verano y deja pasar el sol bajo en invierno).";
      }
      if (hasPoniente) {
        return "Priorizar en fachada Poniente para frenar el sol directo de tarde.";
      }
    }
    if (sol.fachada_objetivo === "sur_o_fria" && hasSur) {
      return "Priorizar en las piezas orientadas al Sur (las más frías de tu vivienda).";
    }
    return "";
  }

  // --- Motor estricto de elegibilidad (evita contradicciones y redundancias) ---
  function isSolutionEligible(sol, input, result) {
    const debilidades = result.debilidades || [];

    // 1. Verificar tipo de vivienda
    if (sol.aplica_a && input.tipoVivienda && !sol.aplica_a.includes(input.tipoVivienda)) {
      return false;
    }

    // 2. Reglas de exclusión estricta según características ya existentes
    if (sol.excluir_si) {
      const fields = Object.keys(sol.excluir_si);
      for (let i = 0; i < fields.length; i++) {
        const f = fields[i];
        const forbidden = sol.excluir_si[f];
        if (Array.isArray(forbidden) && forbidden.includes(input[f])) {
          return false;
        }
      }
    }

    // 2b. Reglas de orientación múltiple (exige tener al menos una fachada compatible)
    if (sol.requiere_orientacion_alguna && Array.isArray(sol.requiere_orientacion_alguna)) {
      const userOris = Array.isArray(input.orientaciones)
        ? input.orientaciones
        : (typeof input.orientacionPrincipal === "string" ? input.orientacionPrincipal.split(",") : []);
      const hasMatchingOri = sol.requiere_orientacion_alguna.some((o) => userOris.includes(o));
      if (!hasMatchingOri) {
        return false;
      }
    }

    // 3. Restricción por letra (P1-6 / Claude #1: AC Inverter solo E, F o G)
    if (sol.solo_letras && Array.isArray(sol.solo_letras)) {
      if (!sol.solo_letras.includes(result.letraEstimada)) {
        return false;
      }
    }

    // 4. Reglas de requisito mínimo
    if (sol.requiere_alguno) {
      const reqFields = Object.keys(sol.requiere_alguno);
      let anyMatch = false;
      for (let i = 0; i < reqFields.length; i++) {
        const f = reqFields[i];
        const allowed = sol.requiere_alguno[f];
        if (Array.isArray(allowed) && allowed.includes(input[f])) {
          anyMatch = true;
          break;
        }
      }
      if (!anyMatch) return false;
    }

    // 5. Climatización activa (ej. AC Inverter): ya pasó solo_letras y excluir_si
    if (sol.es_climatizacion_activa) {
      return true;
    }

    // 6. Debe corresponder al menos a una debilidad detectada
    return (sol.tags || []).some((t) => debilidades.includes(t));
  }

  // --- P1-5: Prioridad basada en gravedad real del problema en ESTA vivienda ---
  function getElementSeverityInfo(sol, result) {
    const comp = result.desgloseComponentes || {};
    const weights = result.pesosComponentes || {};
    const elem = sol.elemento;

    if (elem === "techo" && comp.techo !== null && comp.techo !== undefined) {
      return { score: comp.techo, weight: weights.techo || 0.34, label: `Techo (${comp.techo}/100)` };
    }
    if (elem === "piso" && comp.piso !== null && comp.piso !== undefined) {
      return { score: comp.piso, weight: weights.piso || 0.12, label: `Piso (${comp.piso}/100)` };
    }
    if (elem === "muros" && comp.muros !== undefined) {
      return { score: comp.muros, weight: weights.muros || 0.25, label: `Muros (${comp.muros}/100)` };
    }
    if (elem === "ventanas" && comp.ventanas !== undefined) {
      return { score: comp.ventanas, weight: weights.ventanas || 0.28, label: `Ventanas (${comp.ventanas}/100)` };
    }
    if (elem === "puertas" && comp.puertas !== undefined) {
      return { score: comp.puertas, weight: weights.puertas || 0.10, label: `Puerta (${comp.puertas}/100)` };
    }
    if (elem === "entorno_solar") {
      const summerGap = 100 - (result.puntajeVerano ?? 50);
      return { score: result.puntajeVerano ?? 50, weight: 0.28, label: `Protección verano (${result.puntajeVerano}/100)` };
    }
    return { score: 50, weight: 0.15, label: "Confort general" };
  }

  function computeSeverityPriority(sol, result, input) {
    const info = getElementSeverityInfo(sol, result);
    const deficit = Math.max(5, 100 - info.score);
    // Gravedad del componente * impacto térmico de la medida
    let score = deficit * info.weight * (sol.impacto_termico_1_10 || 5);
    // Si es solo revisión preventiva (sin chiflón confirmado), bajar prioridad respecto a problemas confirmados
    const isOnlyPreventive =
      !input.sienteChiflon &&
      (sol.tags || []).includes("riesgo_infiltracion_ventanas") &&
      !(sol.tags || []).some((t) => t !== "riesgo_infiltracion_ventanas" && (result.debilidades || []).includes(t));
    if (isOnlyPreventive) {
      score *= 0.35;
    }
    return { score, reason: info.label, isOnlyPreventive };
  }

  // --- P1-4: Constructor de Paquete Inicial acotado a máx. $30.000 CLP ---
  function buildStarterBudgetBundle(sortedEconomicSolutions, maxBudgetCLP) {
    const chosen = [];
    const usedGroups = new Set();
    let total = 0;

    for (let i = 0; i < sortedEconomicSolutions.length; i++) {
      const item = sortedEconomicSolutions[i];
      const sol = item.sol;
      if (item.meta.isOnlyPreventive) continue; // No gastar presupuesto ajustado en algo no confirmado
      if (sol.grupo_alternativa && usedGroups.has(sol.grupo_alternativa)) continue;
      const unitCost = (sol.costo && sol.costo.tipico_clp) || 0;
      if (unitCost <= 0) continue;
      if (total + unitCost <= maxBudgetCLP) {
        chosen.push(item);
        total += unitCost;
        if (sol.grupo_alternativa) usedGroups.add(sol.grupo_alternativa);
      }
      if (chosen.length >= 4) break;
    }

    return { chosen, total };
  }

  // --- Persistencia Local ---
  function loadState() {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY);
      if (savedAnswers) answers = JSON.parse(savedAnswers);
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY);
      if (savedStep !== null) currentStep = Math.max(0, Math.min(4, parseInt(savedStep, 10) || 0));
      const savedResult = localStorage.getItem(STORAGE_RESULT_KEY);
      if (savedResult) {
        lastDiagnosis = JSON.parse(savedResult);
        filterArrendatarioOnly = lastDiagnosis.tenencia === "arrendatario";
        activeDiagnosisSolTab =
          lastDiagnosis.presupuesto === "alto" && lastDiagnosis.tenencia !== "arrendatario"
            ? "alto_impacto"
            : "bajo_costo";
      }
    } catch (e) {
      console.warn("No se pudo leer localStorage:", e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_ANSWERS_KEY, JSON.stringify(answers));
      localStorage.setItem(STORAGE_STEP_KEY, String(currentStep));
      if (lastDiagnosis) {
        localStorage.setItem(STORAGE_RESULT_KEY, JSON.stringify(lastDiagnosis));
      }
    } catch (e) {
      console.warn("No se pudo guardar en localStorage:", e);
    }
  }

  function resetSurvey() {
    answers = {};
    currentStep = 0;
    lastDiagnosis = null;
    openHelps = {};
    localStorage.removeItem(STORAGE_ANSWERS_KEY);
    localStorage.removeItem(STORAGE_STEP_KEY);
    localStorage.removeItem(STORAGE_RESULT_KEY);
    navigateTo("/encuesta");
  }

  // --- Guardado en Base de Datos (Supabase + respaldo local) ---
  async function saveDiagnosisRecord(payload) {
    try {
      const existing = JSON.parse(localStorage.getItem(STORAGE_LOCAL_DB_KEY) || "[]");
      existing.unshift({ ...payload, created_at: new Date().toISOString() });
      localStorage.setItem(STORAGE_LOCAL_DB_KEY, JSON.stringify(existing.slice(0, 200)));
    } catch (e) {
      console.warn("Error respaldo local:", e);
    }

    if (!supabaseClient) {
      lastSaveStatus = "local_only";
      return;
    }

    try {
      const { error } = await supabaseClient.from("diagnosticos").insert([payload]);
      if (error) {
        console.error("Error guardando en Supabase:", error);
        lastSaveStatus = "supabase_error";
      } else {
        lastSaveStatus = "supabase";
      }
    } catch (err) {
      console.error("Excepción al guardar en Supabase:", err);
      lastSaveStatus = "supabase_error";
    }
  }

  // --- P0-B: Consulta de estadísticas agregadas (RPC segura sin exponer filas privadas) ---
  function aggregateRowsLocally(rows) {
    const letterCounts = { "A+": 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, G: 0 };
    const debilidadCounts = {};
    const comunaCounts = {};
    let sumInv = 0;
    let sumVer = 0;

    rows.forEach((r) => {
      if (letterCounts[r.letra_estimada] !== undefined) letterCounts[r.letra_estimada] += 1;
      sumInv += Number(r.puntaje_invierno || 0);
      sumVer += Number(r.puntaje_verano || 0);
      if (r.comuna) comunaCounts[r.comuna] = (comunaCounts[r.comuna] || 0) + 1;
      (r.debilidades || []).forEach((d) => {
        debilidadCounts[d] = (debilidadCounts[d] || 0) + 1;
      });
    });

    const total = rows.length;
    return {
      total,
      avg_invierno: total ? Math.round(sumInv / total) : 0,
      avg_verano: total ? Math.round(sumVer / total) : 0,
      por_letra: letterCounts,
      top_debilidades: Object.entries(debilidadCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count })),
      top_comunas: Object.entries(comunaCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([comuna, count]) => ({ comuna, count }))
    };
  }

  async function fetchAggregatedStats() {
    let rpcErrorMsg = null;
    if (supabaseClient) {
      // 1. Intentar primero función RPC agregada segura (P0-B: no expone filas individuales)
      try {
        const { data, error } = await supabaseClient.rpc("get_estadisticas_agregadas");
        if (!error && data && typeof data === "object") {
          return { source: "supabase_rpc", stats: data, rpcErrorMsg: null };
        }
        if (error) {
          rpcErrorMsg = error.message || JSON.stringify(error);
          console.warn("RPC get_estadisticas_agregadas falló:", rpcErrorMsg);
        }
      } catch (e) {
        rpcErrorMsg = e && e.message ? e.message : String(e);
        console.warn("Excepción en RPC get_estadisticas_agregadas:", rpcErrorMsg);
      }

      // 2. Fallback temporal solo si la política SELECT aún existe
      try {
        const { data, error } = await supabaseClient
          .from("diagnosticos")
          .select("comuna, letra_estimada, puntaje_invierno, puntaje_verano, debilidades")
          .order("created_at", { ascending: false })
          .limit(1000);
        if (!error && Array.isArray(data)) {
          // Si devolvió 0 filas y hubo error RPC, probablemente RLS bloqueó SELECT porque falta crear la RPC
          if (data.length === 0 && rpcErrorMsg) {
            return { source: "supabase_rpc_missing", stats: aggregateRowsLocally([]), rpcErrorMsg };
          }
          return { source: "supabase_legacy", stats: aggregateRowsLocally(data), rpcErrorMsg };
        }
        console.error("Error consultando Supabase:", error);
      } catch (err) {
        console.error("Excepción consultando Supabase:", err);
      }
    }

    const localRows = JSON.parse(localStorage.getItem(STORAGE_LOCAL_DB_KEY) || "[]");
    return { source: "local", stats: aggregateRowsLocally(localRows), rpcErrorMsg };
  }

  // --- Helpers Visuales ---
  function scoreColor(score) {
    if (score >= 70) return { bar: "#1E7E5A", bg: "bg-emerald-50", text: "text-emerald-800", label: "Bueno" };
    if (score >= 45) return { bar: "#D96B27", bg: "bg-amber-50", text: "text-amber-800", label: "Mejorable" };
    return { bar: "#C0392B", bg: "bg-red-50", text: "text-red-800", label: "Crítico" };
  }

  function updateNavHighlight(route) {
    const normalizedRoute = route === "/soluciones" ? (lastDiagnosis ? "/resultado" : "/tips-y-subsidios") : route;
    document.querySelectorAll("[data-nav-link]").forEach((el) => {
      const target = el.getAttribute("data-nav-link");
      const isActive = normalizedRoute === target;
      el.classList.toggle("text-[#D96B27]", isActive);
      el.classList.toggle("font-semibold", isActive);
      el.classList.toggle("text-slate-600", !isActive);
    });
  }

  // =========================================================================
  // VISTA 1: INICIO (/)
  // =========================================================================
  function renderHome() {
    const hasProgress = Object.keys(answers).length > 0;
    return `
      <section class="max-w-5xl mx-auto px-4 pt-8 pb-12 sm:pt-14 sm:pb-16">
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-12">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-[#0F3D5E] text-xs sm:text-sm font-semibold mb-5">
            <span class="w-2 h-2 rounded-full bg-[#1E7E5A]"></span>
            Iniciativa Envuelve tu Casa · Servicio gratuito para Santiago (Zona Térmica D)
          </div>

          <h1 class="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F3D5E] leading-tight tracking-tight max-w-3xl">
            Revisa en minutos si tu casa está bien protegida del frío y del calor
          </h1>

          <p class="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Evaluación gratuita para <strong>casas y departamentos de Santiago</strong>. Descubre por dónde entra el frío o el calor, recibe soluciones claras según tu presupuesto, tips sin costo y los subsidios estatales vigentes en 2026.
          </p>

          <div class="mt-7 flex flex-col sm:flex-row gap-3">
            <button onclick="window.EnvuelveApp.startOrContinue()" class="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-semibold text-base sm:text-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer">
              <span>${hasProgress ? "Continuar mi evaluación" : "Evaluar mi vivienda ahora"}</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
            ${lastDiagnosis ? `
              <button onclick="window.EnvuelveApp.navigateTo('/resultado')" class="w-full sm:w-auto px-6 py-4 rounded-xl border-2 border-[#0F3D5E] text-[#0F3D5E] hover:bg-slate-50 font-semibold text-base transition cursor-pointer">
                Ver mi diagnóstico y soluciones (${lastDiagnosis.result.letraEstimada})
              </button>
            ` : ""}
          </div>

          <div class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
            <span class="flex items-center gap-1.5">✓ Sin registro ni RUT</span>
            <span class="flex items-center gap-1.5">✓ No necesitas medir ni usar herramientas</span>
            <span class="flex items-center gap-1.5">✓ Para propietarios y arrendatarios</span>
          </div>
        </div>

        <!-- Cómo funciona -->
        <div class="mt-10">
          <h2 class="font-heading text-2xl font-bold text-[#0F3D5E] text-center sm:text-left">¿Cómo funciona?</h2>
          <div class="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <div class="w-10 h-10 rounded-xl bg-[#0F3D5E]/10 text-[#0F3D5E] font-heading font-bold flex items-center justify-center text-lg mb-4">1</div>
              <h3 class="font-heading font-bold text-lg text-[#0F3D5E]">Responde preguntas simples</h3>
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Sobre tus muros, techo, piso, ventanas, humedad y sol en menos de 5 minutos, con métodos simples para responderlas y un asistente guiado.</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <div class="w-10 h-10 rounded-xl bg-[#D96B27]/15 text-[#D96B27] font-heading font-bold flex items-center justify-center text-lg mb-4">2</div>
              <h3 class="font-heading font-bold text-lg text-[#0F3D5E]">Obtén tu índice y soluciones</h3>
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Calculamos un índice orientativo (escala A+ a G) y te entregamos soluciones filtradas según tu vivienda y presupuesto real.</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <div class="w-10 h-10 rounded-xl bg-[#1E7E5A]/15 text-[#1E7E5A] font-heading font-bold flex items-center justify-center text-lg mb-4">3</div>
              <h3 class="font-heading font-bold text-lg text-[#0F3D5E]">Revisa tips y subsidios 2026</h3>
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Explora consejos sencillos a costo $0 y los subsidios habitacionales del MINVU disponibles para mejorar tu hogar.</p>
            </div>
          </div>
        </div>

        <!-- Accesos rápidos: Tips, Subsidios y Documentos -->
        <div class="mt-10 bg-[#0F3D5E] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p class="text-xs uppercase tracking-wider text-sky-200 font-semibold">Innovación tecnológica con sentido social</p>
            <h3 class="font-heading text-xl font-bold mt-1">Respaldo técnico y política pública</h3>
            <p class="mt-2 text-sm text-sky-100 max-w-2xl leading-relaxed">
              La <strong>Iniciativa Envuelve tu Casa</strong> está alineada con la <strong>Estrategia Nacional de Calor y Frío</strong> del Ministerio de Energía e inspirada en parámetros del <strong>Manual Técnico CEV del MINVU</strong>. Consulta los documentos oficiales, tips útiles y subsidios 2026.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button onclick="window.EnvuelveApp.openTipsSubTab('subsidios')" class="px-5 py-3 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-semibold text-sm transition cursor-pointer">
              Ver tips y subsidios 2026
            </button>
            <button onclick="window.EnvuelveApp.navigateTo('/documentos')" class="px-5 py-3 rounded-xl bg-white text-[#0F3D5E] hover:bg-sky-50 font-semibold text-sm transition cursor-pointer">
              📄 Ver Manual y Estrategia Nacional
            </button>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // VISTA 2: ENCUESTA (/encuesta)
  // =========================================================================
  function isTechoAdiabaticoSelected() {
    return (
      answers.tipoVivienda === "depto_intermedio" ||
      answers.tipoVivienda === "depto_primer_piso"
    );
  }

  function isPisoAdiabaticoSelected() {
    return (
      answers.tipoVivienda === "depto_intermedio" ||
      answers.tipoVivienda === "depto_ultimo_piso"
    );
  }

  function renderSurvey() {
    const blocks = window.QUESTIONS_DATA.blocks;
    const block = blocks[currentStep];
    const progressPct = Math.round(((currentStep + 1) / blocks.length) * 100);
    const esTechoAdiab = isTechoAdiabaticoSelected();
    const esPisoAdiab = isPisoAdiabaticoSelected();

    const questionsHtml = block.questions
      .map((q) => {
        if (q.hideWhenTechoAdiabatic && esTechoAdiab) {
          return `
            <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div class="flex items-start gap-3">
                <span class="text-xl">🏢</span>
                <div>
                  <p class="font-semibold text-base">Pregunta 5 (Techo) omitida automáticamente</p>
                  <p class="text-sm text-emerald-800 mt-1">
                    Como tienes otro departamento habitado arriba, tu cielo no está expuesto directamente al exterior (en el Manual CEV esto se simplifica como <em>elemento adiabático</em>). El cálculo redistribuye el peso hacia los elementos expuestos de tu vivienda.
                  </p>
                </div>
              </div>
            </div>
          `;
        }

        if (q.hideWhenPisoAdiabatic && esPisoAdiab) {
          return `
            <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div class="flex items-start gap-3">
                <span class="text-xl">🏢</span>
                <div>
                  <p class="font-semibold text-base">Pregunta 6 (Piso) omitida automáticamente</p>
                  <p class="text-sm text-emerald-800 mt-1">
                    Como tienes otro departamento habitado debajo, tu piso no está expuesto directamente al suelo ni al exterior (simplificación adiabática del Manual CEV).
                  </p>
                </div>
              </div>
            </div>
          `;
        }

        const isHelpOpen = !!openHelps[q.id];
        const currentVal = answers[q.id] || "";

        let inputHtml = "";
        if (q.type === "select") {
          const opts = window.QUESTIONS_DATA.comunasRM
            .map((c) => `<option value="${c}" ${currentVal === c ? "selected" : ""}>${c}</option>`)
            .join("");
          inputHtml = `
            <select
              onchange="window.EnvuelveApp.setAnswer('${q.id}', this.value)"
              class="mt-3 w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3.5 text-base text-slate-800 focus:border-[#0F3D5E] focus:outline-none"
            >
              <option value="">${q.placeholder}</option>
              ${opts}
            </select>
          `;
        } else if (q.type === "checkbox") {
          const selectedArr = Array.isArray(currentVal)
            ? currentVal
            : (currentVal ? [String(currentVal)] : []);
          inputHtml = `
            ${q.multiHint ? `<p class="mt-1.5 text-xs text-slate-500">${q.multiHint}</p>` : ""}
            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${q.options
                .map((opt) => {
                  const selected = selectedArr.includes(String(opt.value));
                  return `
                    <button
                      type="button"
                      onclick="window.EnvuelveApp.toggleMultiAnswer('${q.id}', '${opt.value}', ${opt.exclusive ? "true" : "false"})"
                      class="text-left px-4 py-3.5 rounded-xl border-2 transition text-base font-medium flex items-center justify-between gap-3 cursor-pointer ${
                        selected
                          ? "border-[#0F3D5E] bg-[#0F3D5E]/5 text-[#0F3D5E] shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }"
                    >
                      <span>${opt.label}</span>
                      <span class="w-5 h-5 shrink-0 rounded-md border-2 flex items-center justify-center text-xs font-bold ${
                        selected ? "border-[#0F3D5E] bg-[#0F3D5E] text-white" : "border-slate-300 bg-white"
                      }">
                        ${selected ? "✓" : ""}
                      </span>
                    </button>
                  `;
                })
                .join("")}
            </div>
          `;
        } else {
          inputHtml = `
            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${q.options
                .map((opt) => {
                  const selected = String(currentVal) === String(opt.value);
                  return `
                    <button
                      type="button"
                      onclick="window.EnvuelveApp.setAnswer('${q.id}', '${opt.value}')"
                      class="text-left px-4 py-3.5 rounded-xl border-2 transition text-base font-medium flex items-center justify-between gap-3 cursor-pointer ${
                        selected
                          ? "border-[#0F3D5E] bg-[#0F3D5E]/5 text-[#0F3D5E] shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }"
                    >
                      <span>${opt.label}</span>
                      <span class="w-5 h-5 shrink-0 rounded-full border-2 flex items-center justify-center ${
                        selected ? "border-[#0F3D5E] bg-[#0F3D5E]" : "border-slate-300"
                      }">
                        ${selected ? '<span class="w-2 h-2 rounded-full bg-white"></span>' : ""}
                      </span>
                    </button>
                  `;
                })
                .join("")}
            </div>
          `;
        }

        return `
          <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm">
            <div class="flex items-start justify-between gap-3">
              <div>
                <span class="text-xs font-bold uppercase tracking-wider text-[#D96B27]">Pregunta ${q.number} de 18</span>
                <h3 class="font-heading text-lg sm:text-xl font-bold text-[#0F3D5E] mt-0.5">${q.label}</h3>
              </div>
              <button
                type="button"
                onclick="window.EnvuelveApp.toggleHelp('${q.id}')"
                aria-label="¿Cómo respondo esto?"
                title="¿Cómo respondo esto?"
                class="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                  isHelpOpen
                    ? "bg-[#0F3D5E] text-white"
                    : "bg-slate-100 text-[#0F3D5E] hover:bg-slate-200"
                }"
              >
                <span class="w-5 h-5 rounded-full bg-white/20 border border-current flex items-center justify-center font-bold">?</span>
                <span class="hidden sm:inline">¿Cómo respondo?</span>
              </button>
            </div>

            ${
              isHelpOpen
                ? `
              <div class="mt-3 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sm text-slate-700 leading-relaxed">
                <p class="font-semibold text-[#0F3D5E] mb-1">💡 Truco rápido para responder:</p>
                <p>${q.help}</p>
              </div>
            `
                : ""
            }

            ${inputHtml}
          </div>
        `;
      })
      .join("");

    return `
      <section class="max-w-3xl mx-auto px-4 pt-6 pb-28">
        <!-- Barra de progreso -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 mb-5 shadow-sm">
          <div class="flex items-center justify-between text-sm mb-2">
            <span class="font-heading font-bold text-[#0F3D5E]">Paso ${currentStep + 1} de ${blocks.length}: ${block.title}</span>
            <span class="font-semibold text-[#D96B27]">${progressPct}%</span>
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-[#1E7E5A] rounded-full transition-all duration-300" style="width: ${progressPct}%"></div>
          </div>
          <p class="text-xs sm:text-sm text-slate-500 mt-2">${block.subtitle}</p>
        </div>

        <div id="survey-error-banner" class="hidden mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-medium"></div>

        <div class="space-y-4">
          ${questionsHtml}
        </div>

        <!-- Botones navegación inferiores -->
        <div class="mt-7 flex items-center justify-between gap-3">
          <button
            type="button"
            onclick="window.EnvuelveApp.prevStep()"
            class="px-5 py-3.5 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold text-base hover:bg-slate-100 transition cursor-pointer ${currentStep === 0 ? "opacity-50" : ""}"
          >
            ← Atrás
          </button>

          ${
            currentStep < blocks.length - 1
              ? `
            <button
              type="button"
              onclick="window.EnvuelveApp.nextStep()"
              class="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-[#0F3D5E] hover:bg-[#0a2c45] text-white font-semibold text-base shadow-sm transition cursor-pointer"
            >
              Siguiente paso →
            </button>
          `
              : `
            <button
              type="button"
              onclick="window.EnvuelveApp.submitSurvey()"
              class="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-bold text-base shadow-md transition cursor-pointer"
            >
              Ver mi diagnóstico y soluciones ✓
            </button>
          `
          }
        </div>
      </section>
    `;
  }

  function validateCurrentStep() {
    const block = window.QUESTIONS_DATA.blocks[currentStep];
    const esTechoAdiab = isTechoAdiabaticoSelected();
    const esPisoAdiab = isPisoAdiabaticoSelected();
    const missing = [];

    block.questions.forEach((q) => {
      if (q.hideWhenTechoAdiabatic && esTechoAdiab) return;
      if (q.hideWhenPisoAdiabatic && esPisoAdiab) return;
      const val = answers[q.id];
      if (
        val === undefined ||
        val === "" ||
        (Array.isArray(val) && val.length === 0)
      ) {
        missing.push(q.number);
      }
    });

    const banner = document.getElementById("survey-error-banner");
    if (missing.length > 0) {
      if (banner) {
        banner.textContent = `Por favor responde ${missing.length === 1 ? "la pregunta" : "las preguntas"} N° ${missing.join(", ")} antes de continuar. Si no sabes el dato, puedes elegir "No sé".`;
        banner.classList.remove("hidden");
        banner.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return false;
    }
    if (banner) banner.classList.add("hidden");
    return true;
  }

  async function submitSurvey() {
    if (!validateCurrentStep()) return;

    const { input, estimatedFieldsCount, estimatedFields } =
      window.ThermalEngine.normalizeSurveyAnswers(answers);
    const result = window.ThermalEngine.calculateThermalDiagnosis(input, estimatedFieldsCount);

    lastDiagnosis = {
      timestamp: new Date().toISOString(),
      rawAnswers: { ...answers },
      normalizedInput: input,
      estimatedFieldsCount,
      estimatedFields,
      tenencia: input.tenencia,
      presupuesto: input.presupuesto,
      result
    };

    filterArrendatarioOnly = lastDiagnosis.tenencia === "arrendatario";
    if (lastDiagnosis.presupuesto === "alto" && lastDiagnosis.tenencia !== "arrendatario") {
      activeDiagnosisSolTab = "alto_impacto";
    } else {
      activeDiagnosisSolTab = "bajo_costo";
    }

    saveState();

    const dbPayload = {
      comuna: input.comuna,
      tipo_vivienda: input.tipoVivienda,
      antiguedad: input.antiguedad,
      respuestas_json: {
        ...answers,
        estimatedFieldsCount,
        estimatedFields
      },
      letra_estimada: result.letraEstimada,
      ahorro_estimado_pct: result.ahorroEstimadoPct,
      puntaje_invierno: result.puntajeInvierno,
      puntaje_verano: result.puntajeVerano,
      debilidades: result.debilidades
    };
    saveDiagnosisRecord(dbPayload);

    navigateTo("/resultado");
  }

  // =========================================================================
  // MOTOR DE RENDER DE SOLUCIONES PERSONALIZADAS (DENTRO DE /resultado)
  // =========================================================================
  function getArrendatarioBadge(estado) {
    if (estado === "si") {
      return `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">✓ Apto arrendatarios</span>`;
    }
    if (estado === "con_permiso") {
      return `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">Con permiso del dueño</span>`;
    }
    return `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Solo propietarios</span>`;
  }

  function getSubsidioBadge(ds27) {
    if (ds27 === "si") {
      return `<span class="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 text-[#0F3D5E]">Postulable DS 27</span>`;
    }
    if (ds27 === "consultar_ep") {
      return `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-50 text-sky-800">DS 27: consultar EP</span>`;
    }
    return "";
  }

  function renderSolutionCard(item, rankIndex, options) {
    const sol = item.sol;
    const meta = item.meta;
    const opts = options || {};
    const isTopPriority = !opts.hideRank && !meta.isOnlyPreventive && rankIndex < 3;
    const isClimatizacion = sol.es_climatizacion_activa === true;

    return `
      <article class="bg-white rounded-2xl border ${
        isTopPriority
          ? "border-[#D96B27]/50 ring-1 ring-[#D96B27]/20"
          : isClimatizacion
          ? "border-indigo-200 bg-indigo-50/20"
          : "border-slate-200"
      } p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-3">
            ${
              isTopPriority
                ? `<span class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D96B27] text-white">★ Prioridad #${rankIndex + 1}</span>`
                : ""
            }
            ${
              meta.isOnlyPreventive
                ? `<span class="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900">🔍 Revisión preventiva</span>`
                : ""
            }
            ${
              isClimatizacion
                ? `<span class="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900">⚡ Climatización activa opcional</span>`
                : `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#0F3D5E]">Ataca: ${meta.reason}</span>`
            }
            ${getArrendatarioBadge(sol.apto_arrendatario)}
            ${getSubsidioBadge(sol.subsidio_ds27)}
          </div>

          <h3 class="font-heading text-lg font-bold text-[#0F3D5E]">${sol.nombre}</h3>

          ${
            sol.etiqueta_alternativa
              ? `<p class="mt-1.5 text-xs font-semibold text-indigo-800 bg-indigo-50 border border-indigo-200 rounded-lg px-2.5 py-1 inline-block">🔀 ${sol.etiqueta_alternativa}</p>`
              : ""
          }
          ${
            opts.facadeNote
              ? `<p class="mt-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">📍 ${opts.facadeNote}</p>`
              : ""
          }

          <!-- P2-3: Precio unitario y total referencial claramente separados -->
          <div class="mt-2.5 p-2.5 rounded-xl bg-slate-100 text-xs text-slate-800 space-y-0.5">
            <p class="font-semibold">💰 Unitario: ${sol.costo.precio_unitario_texto || ""}</p>
            <p class="text-slate-600">📐 Referencia hogar: ${sol.costo.total_referencial_texto || sol.costo.caso_tipico || ""}</p>
          </div>

          <p class="mt-3 text-sm text-slate-700 leading-relaxed">
            <strong class="text-[#0F3D5E]">Qué resuelve:</strong> ${sol.problema_que_ataca}
          </p>

          ${
            meta.isOnlyPreventive
              ? `
            <div class="mt-3 p-3 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-950 leading-relaxed">
              <strong>Inspección previa:</strong> Indicaste no sentir chiflones, pero tus ventanas correderas o antiguas suelen desgastar sus felpas. Verifica con la mano mojada en un día de viento antes de comprar.
            </div>
          `
              : ""
          }

          ${
            sol.precaucion
              ? `
            <div class="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>⚠️ Precaución:</strong> ${sol.precaucion}
            </div>
          `
              : ""
          }
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700 bg-slate-50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl space-y-1.5">
          <p><strong class="text-[#0F3D5E]">💡 Tip práctico:</strong> ${sol.tip_practico}</p>
          ${sol.donde_comprar ? `<p class="text-xs text-slate-500"><strong>Dónde encontrarlo:</strong> ${sol.donde_comprar}</p>` : ""}
        </div>
      </article>
    `;
  }

  function renderVerificationStepZero() {
    const estFields = lastDiagnosis.estimatedFields || [];
    if (lastDiagnosis.result.nivelCerteza !== "baja" || estFields.length === 0) return "";

    const qMap = getQuestionMap();
    const itemsHtml = estFields
      .map((fieldId) => {
        const q = qMap[fieldId];
        if (!q) return "";
        return `
          <div class="p-3.5 rounded-xl bg-white border border-amber-200">
            <p class="font-semibold text-sm text-[#0F3D5E]">• ${q.label}</p>
            <p class="text-xs text-slate-600 mt-1">${q.help}</p>
          </div>
        `;
      })
      .join("");

    return `
      <div class="mb-6 p-5 sm:p-6 rounded-2xl bg-amber-50 border-2 border-amber-300">
        <div class="flex items-start gap-3">
          <span class="text-2xl">🔎</span>
          <div class="flex-1">
            <h3 class="font-heading font-bold text-lg text-amber-950">Paso 0 recomendado: Verifica estos datos antes de invertir</h3>
            <p class="text-sm text-amber-900 mt-1 leading-relaxed">
              Respondiste <strong>"No sé" en ${estFields.length} preguntas clave</strong>. Antes de gastar en obras mayores, comprueba estos puntos en casa (te tomará 5 minutos) y vuelve a correr el diagnóstico para obtener recomendaciones precisas:
            </p>
            <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${itemsHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderPersonalizedSolutionsSection() {
    const catalog = window.SOLUTIONS_CATALOG;
    const result = lastDiagnosis.result;
    const input = lastDiagnosis.normalizedInput;
    const presupuesto = lastDiagnosis.presupuesto || "bajo";

    // Filtrado estricto (NUNCA recomienda lo que ya existe ni cae en fallback sin filtro)
    const allEligible = catalog.soluciones
      .filter((s) => isSolutionEligible(s, input, result))
      .map((sol) => ({
        sol,
        meta: computeSeverityPriority(sol, result, input)
      }));

    // Separar pasivas económicas, pasivas alto impacto, y climatización activa opcional (A12)
    let eligibleBajo = allEligible.filter((x) => x.sol.categoria === "bajo_costo");
    let eligibleAltoEnvolvente = allEligible.filter(
      (x) => x.sol.categoria === "alto_impacto" && !x.sol.es_climatizacion_activa
    );
    let eligibleClimaActiva = allEligible.filter((x) => x.sol.es_climatizacion_activa === true);

    if (filterArrendatarioOnly) {
      const keepArr = (x) =>
        x.sol.apto_arrendatario === "si" || x.sol.apto_arrendatario === "con_permiso";
      eligibleBajo = eligibleBajo.filter(keepArr);
      eligibleAltoEnvolvente = eligibleAltoEnvolvente.filter(keepArr);
      eligibleClimaActiva = eligibleClimaActiva.filter(keepArr);
    }

    const sortBySeverity = (arr) =>
      [...arr].sort((a, b) => {
        if (filterArrendatarioOnly && a.sol.apto_arrendatario !== b.sol.apto_arrendatario) {
          return a.sol.apto_arrendatario === "si" ? -1 : 1;
        }
        return b.meta.score - a.meta.score;
      });

    eligibleBajo = sortBySeverity(eligibleBajo);
    eligibleAltoEnvolvente = sortBySeverity(eligibleAltoEnvolvente);

    const totalAltoCount = eligibleAltoEnvolvente.length + eligibleClimaActiva.length;
    let bodyHtml = "";

    if (activeDiagnosisSolTab === "bajo_costo") {
      if (eligibleBajo.length === 0) {
        const hasStructural = eligibleAltoEnvolvente.length > 0;
        bodyHtml = `
          <div class="${hasStructural ? "bg-sky-50 border-sky-200 text-sky-950" : "bg-emerald-50 border-emerald-200 text-emerald-950"} rounded-2xl border p-7">
            <h3 class="font-heading font-bold text-lg ${hasStructural ? "text-[#0F3D5E]" : "text-[#1E7E5A]"}">${
              hasStructural
                ? "Tus brechas principales son estructurales (no requieren parches menores)"
                : "✓ Sin medidas económicas pendientes en tu envolvente"
            }</h3>
            <p class="text-sm mt-1.5 leading-relaxed">
              ${
                hasStructural
                  ? `Según tus respuestas, no tienes filtraciones confirmadas ni mejoras pequeñas pendientes: las brechas detectadas están en elementos mayores (como techo o muros). Revisa la pestaña <strong>Mayor Impacto</strong> o los <strong>Tips Útiles ($0)</strong>.`
                  : `Según tus respuestas, tu vivienda no presenta filtraciones confirmadas ni carencias básicas que requieran compras económicas redundantes. Mantén tu confort con los <strong>Tips Útiles ($0)</strong>.`
              }
            </p>
          </div>
        `;
      } else {
        // P1-4: Si eligió presupuesto <= $30.000, armar Paquete Inicial acotado a $30.000 CLP
        let bundleHtml = "";
        let remaining = eligibleBajo;

        if (presupuesto === "bajo") {
          const { chosen, total } = buildStarterBudgetBundle(eligibleBajo, 30000);
          if (chosen.length > 0) {
            const chosenIds = new Set(chosen.map((c) => c.sol.id));
            remaining = eligibleBajo.filter((x) => !chosenIds.has(x.sol.id));
            bundleHtml = `
              <div class="mb-7 p-5 sm:p-6 rounded-3xl bg-emerald-50/70 border-2 border-[#1E7E5A]/40">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span class="text-xs font-bold uppercase tracking-wider text-[#1E7E5A]">Ajustado a tu presupuesto (≤ $30.000)</span>
                    <h3 class="font-heading text-xl font-bold text-[#0F3D5E]">Paquete inicial sugerido (1 unidad prioritaria por medida)</h3>
                  </div>
                  <span class="px-3.5 py-1.5 rounded-xl bg-[#1E7E5A] text-white font-heading font-bold text-sm">
                    Subtotal estimado: ${formatCLP(total)} / $30.000
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-slate-700 mb-4">
                  Seleccionamos las medidas de mayor urgencia sin duplicar alternativas que cumplen la misma función, para que partas atacando tu habitación o entrada más crítica dentro de tu tope de $30.000.
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${chosen.map((item, idx) => renderSolutionCard(item, idx, { facadeNote: getFacadePlacementNote(item.sol, input) })).join("")}
                </div>
              </div>
            `;
          }
        }

        const remainingTitle =
          bundleHtml && remaining.length > 0
            ? `<h3 class="font-heading text-lg font-bold text-[#0F3D5E] mb-3">Otras alternativas económicas (precios por unidad — elige según necesidad)</h3>`
            : "";

        bodyHtml = `
          ${bundleHtml}
          ${remainingTitle}
          ${
            remaining.length > 0
              ? `<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${remaining
                    .map((item, idx) =>
                      renderSolutionCard(item, idx, { hideRank: Boolean(bundleHtml), facadeNote: getFacadePlacementNote(item.sol, input) })
                    )
                    .join("")}
                </div>`
              : ""
          }
        `;
      }
    } else {
      // Pestaña MAYOR IMPACTO (separando rango medio $30k-$300k si eligió presupuesto medio, y separando Climatización Activa A12)
      if (totalAltoCount === 0) {
        bodyHtml = `
          <div class="bg-emerald-50 rounded-2xl border border-emerald-200 p-7 text-emerald-950">
            <h3 class="font-heading font-bold text-lg text-[#1E7E5A]">✓ Envolvente sólida: no necesitas obras mayores</h3>
            <p class="text-sm text-emerald-900 mt-1.5 leading-relaxed">
              Según tus respuestas, tu vivienda ya cuenta con buena aislación en sus elementos principales. No recomendamos gastar en obras redundantes; mantén tu confort con los <strong>Tips Útiles ($0)</strong>.
            </p>
          </div>
        `;
      } else {
        let structuralHtml = "";

        if (presupuesto === "medio" && eligibleAltoEnvolvente.length > 0) {
          const inRange = eligibleAltoEnvolvente.filter((x) => (x.sol.costo.tipico_clp || 0) <= 300000);
          const aboveRange = eligibleAltoEnvolvente.filter((x) => (x.sol.costo.tipico_clp || 0) > 300000);

          if (inRange.length > 0) {
            structuralHtml += `
              <div class="mb-6">
                <h3 class="font-heading text-lg font-bold text-[#0F3D5E] mb-3">Dentro de tu presupuesto ($30.000 – $300.000)</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${inRange.map((item, idx) => renderSolutionCard(item, idx, { facadeNote: getFacadePlacementNote(item.sol, input) })).join("")}
                </div>
              </div>
            `;
          }
          if (aboveRange.length > 0) {
            structuralHtml += `
              <div class="mb-6">
                <h3 class="font-heading text-lg font-bold text-[#0F3D5E] mb-1">Proyectos mayores (> $300.000 — evaluables por etapas o Subsidio DS 27)</h3>
                <p class="text-xs text-slate-600 mb-3">Superan tu presupuesto actual, pero son las obras estructurales más efectivas si postulas a financiamiento estatal.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  ${aboveRange.map((item, idx) => renderSolutionCard(item, idx, { hideRank: inRange.length > 0, facadeNote: getFacadePlacementNote(item.sol, input) })).join("")}
                </div>
              </div>
            `;
          }
        } else if (eligibleAltoEnvolvente.length > 0) {
          structuralHtml = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              ${eligibleAltoEnvolvente.map((item, idx) => renderSolutionCard(item, idx, { facadeNote: getFacadePlacementNote(item.sol, input) })).join("")}
            </div>
          `;
        }

        const climaHtml =
          eligibleClimaActiva.length > 0
            ? `
          <div class="mt-6 pt-6 border-t border-slate-200">
            <span class="text-xs font-bold uppercase tracking-wider text-indigo-700">Complemento opcional (no reemplaza aislar la envolvente)</span>
            <h3 class="font-heading text-lg font-bold text-[#0F3D5E] mt-0.5 mb-3">Climatización activa de bajo consumo mensual</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${eligibleClimaActiva.map((item, idx) => renderSolutionCard(item, idx, { hideRank: true, facadeNote: getFacadePlacementNote(item.sol, input) })).join("")}
            </div>
          </div>
        `
            : "";

        bodyHtml = structuralHtml + climaHtml;
      }
    }

    return `
      <div id="soluciones-personalizadas" class="mt-10 pt-8 border-t-2 border-slate-200">
        ${renderVerificationStepZero()}

        <div class="mb-5">
          <span class="text-xs font-bold uppercase tracking-wider text-[#1E7E5A]">Banco personalizado según gravedad real y tus respuestas</span>
          <h2 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E] mt-1">
            Soluciones recomendadas para tu vivienda
          </h2>
          <p class="text-sm sm:text-base text-slate-600 mt-1">
            Ordenadas según la gravedad de tus puntos críticos (sin recomendarte lo que ya tienes instalado). Las opciones marcadas con <strong>🔀 Alternativa</strong> son excluyentes entre sí: no necesitas hacer todas a la vez.
          </p>
        </div>

        <!-- Selector pestañas (P2-2 / Claude #4: nombre exacto "por unidad") + Filtro Arrendatario -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-5 no-print">
          <div class="inline-flex flex-wrap bg-white p-1.5 rounded-2xl border border-slate-200 gap-1 w-full sm:w-auto">
            <button onclick="window.EnvuelveApp.setDiagnosisSolTab('bajo_costo')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeDiagnosisSolTab === "bajo_costo" ? "bg-[#1E7E5A] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Medidas económicas (hasta $30.000 / unidad) · ${eligibleBajo.length}</button>
            <button onclick="window.EnvuelveApp.setDiagnosisSolTab('alto_impacto')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeDiagnosisSolTab === "alto_impacto" ? "bg-[#0F3D5E] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Mayor Impacto · ${totalAltoCount}</button>
          </div>

          <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer">
            <input type="checkbox" ${filterArrendatarioOnly ? "checked" : ""} onchange="window.EnvuelveApp.toggleArrendatarioFilter()" class="w-4 h-4 accent-[#0F3D5E]" />
            <span>Solo aptas para arrendatarios</span>
          </label>
        </div>

        <div class="mb-4 p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
          <strong>Sobre los precios:</strong> ${catalog.meta.advertencia_precios}
        </div>

        ${bodyHtml}

        <!-- Puente hacia Tips y Subsidios -->
        <div class="mt-7 p-5 rounded-2xl bg-[#0F3D5E] text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
          <div>
            <p class="font-heading font-bold text-base">¿Buscas consejos a costo $0 o financiamiento estatal?</p>
            <p class="text-xs sm:text-sm text-sky-100 mt-0.5">Revisa los tips diarios sencillos y los subsidios del MINVU vigentes en 2026.</p>
          </div>
          <div class="flex flex-wrap gap-2 shrink-0">
            <button onclick="window.EnvuelveApp.openTipsSubTab('tips')" class="px-4 py-2.5 rounded-xl bg-white text-[#0F3D5E] font-semibold text-sm hover:bg-sky-50 transition cursor-pointer">
              Ver Tips ($0)
            </button>
            <button onclick="window.EnvuelveApp.openTipsSubTab('subsidios')" class="px-4 py-2.5 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-semibold text-sm transition cursor-pointer">
              Ver Subsidios 2026 →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // =========================================================================
  // VISTA 3: DIAGNÓSTICO + SOLUCIONES PERSONALIZADAS (/resultado)
  // =========================================================================
  function renderResult() {
    if (!lastDiagnosis) {
      return `
        <section class="max-w-2xl mx-auto px-4 py-16 text-center">
          <div class="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 class="font-heading text-2xl font-bold text-[#0F3D5E]">Aún no has completado tu evaluación</h2>
            <p class="mt-2 text-slate-600">Responde la encuesta en menos de 5 minutos para conocer el índice orientativo de aislación térmica de tu vivienda y recibir tus soluciones personalizadas.</p>
            <button onclick="window.EnvuelveApp.navigateTo('/encuesta')" class="mt-6 px-6 py-3.5 rounded-xl bg-[#D96B27] text-white font-semibold cursor-pointer">
              Ir a la encuesta
            </button>
          </div>
        </section>
      `;
    }

    const { result, normalizedInput, estimatedFieldsCount } = lastDiagnosis;
    const invStyle = scoreColor(result.puntajeInvierno);
    const verStyle = scoreColor(result.puntajeVerano);
    const tagMap = getTagMap();

    const cevBars = CEV_LEVELS.map((lvl, idx) => {
      const isCurrent = lvl.letter === result.letraEstimada;
      const widthPct = 44 + idx * 7;
      return `
        <div class="flex items-center gap-3">
          <div
            class="h-8 rounded-r-full flex items-center justify-between px-3 text-white font-heading font-bold text-sm transition-all ${
              isCurrent ? "ring-4 ring-[#0F3D5E]/25 scale-[1.02] shadow-md" : "opacity-65"
            }"
            style="width: ${widthPct}%; background-color: ${lvl.color};"
          >
            <span>${lvl.letter}</span>
            <span class="text-[11px] font-normal hidden sm:inline">${lvl.range}</span>
          </div>
          ${
            isCurrent
              ? `<span class="text-xs sm:text-sm font-bold text-[#0F3D5E] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">← Tu vivienda (${result.ahorroEstimadoPct >= 0 ? "+" : ""}${result.ahorroEstimadoPct} pts)</span>`
              : ""
          }
        </div>
      `;
    }).join("");

    const components = [
      { key: "techo", label: "Techo / Cubierta", score: result.desgloseComponentes.techo, adiabMsg: "Adiabático (vecino arriba)" },
      { key: "piso", label: "Piso / Suelo", score: result.desgloseComponentes.piso, adiabMsg: "Adiabático (vecino abajo)" },
      { key: "muros", label: "Muros exteriores", score: result.desgloseComponentes.muros },
      { key: "ventanas", label: "Ventanas (Vidrio + Marco)", score: result.desgloseComponentes.ventanas },
      { key: "puertas", label: "Puerta exterior", score: result.desgloseComponentes.puertas }
    ];

    const componentsHtml = components
      .map((c) => {
        if (c.score === null || c.score === undefined) {
          return `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
              <span class="font-semibold text-slate-700 text-sm sm:text-base">${c.label}</span>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">${c.adiabMsg || "Adiabático"}</span>
            </div>
          `;
        }
        const st = scoreColor(c.score);
        return `
          <div class="p-4 rounded-xl bg-white border border-slate-200">
            <div class="flex items-center justify-between text-sm sm:text-base mb-2">
              <span class="font-semibold text-slate-800">${c.label}</span>
              <span class="text-xs font-bold px-2.5 py-0.5 rounded-full ${st.bg} ${st.text}">${st.label} · ${c.score}/100</span>
            </div>
            <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div class="h-full rounded-full" style="width: ${c.score}%; background-color: ${st.bar};"></div>
            </div>
          </div>
        `;
      })
      .join("");

    const weaknessCardsHtml = (result.debilidades || [])
      .map((tag) => {
        const info = tagMap[tag];
        if (!info) return "";
        return `
          <div class="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
            <p class="font-semibold text-sm text-[#0F3D5E]">• ${info.etiqueta_usuario}</p>
            <p class="text-xs text-slate-600 mt-1">${info.explicacion}</p>
          </div>
        `;
      })
      .join("");

    const whatsappText = encodeURIComponent(
      `🏠 Pre-diagnóstico Térmico "Iniciativa Envuelve tu Casa" (${normalizedInput.comuna}):\n` +
      `• Nivel orientativo: ${result.letraEstimada}${result.rangoLetras ? ` (rango ${result.rangoLetras})` : ""} · Índice: ${result.ahorroEstimadoPct >= 0 ? "+" : ""}${result.ahorroEstimadoPct} pts\n` +
      `• Confort Invierno: ${result.puntajeInvierno}/100 | Protección Verano: ${result.puntajeVerano}/100\n` +
      `• U estimado ventanas: ${result.uVentanaEstimado} W/m²K`
    );

    return `
      <section class="max-w-5xl mx-auto px-4 pt-6 pb-16">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-5 no-print">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#1E7E5A]">Zona Térmica D · ${normalizedInput.comuna}${
              result.orientacionesEvaluadas && result.orientacionesEvaluadas.length
                ? ` · Fachadas: ${formatOrientacionesLabel(result.orientacionesEvaluadas)}`
                : ""
            }</span>
            <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E]">Tu Índice Orientativo de Desempeño Térmico</h1>
          </div>
          <button onclick="window.EnvuelveApp.resetSurvey()" class="text-sm text-slate-500 hover:text-[#0F3D5E] underline cursor-pointer">
            Evaluar otra vivienda
          </button>
        </div>

        ${
          result.esComunaPrecordillera
            ? `
          <div class="mb-4 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 text-sm flex items-start gap-2.5">
            <span>🏔️</span>
            <p><strong>Nota climática para ${normalizedInput.comuna} (Manual CEV Anexo F):</strong> El sector urbano de tu comuna corresponde a <strong>Zona Térmica D</strong>, pero si tu vivienda está en sector precordillerano sobre <strong>2.000 m de altitud</strong>, pertenece a <strong>Zona Térmica H</strong> (exigencia invernal más alta).</p>
          </div>
        `
            : ""
        }

        ${
          estimatedFieldsCount > 0
            ? `
          <div class="mb-5 p-4 rounded-xl ${
            result.nivelCerteza === "baja"
              ? "bg-red-50 border-2 border-red-200 text-red-900"
              : "bg-amber-50 border border-amber-200 text-amber-900"
          } text-sm flex items-start gap-2.5">
            <span>${result.nivelCerteza === "baja" ? "⚠️" : "ℹ️"}</span>
            <div>
              <p><strong>${
                result.nivelCerteza === "baja"
                  ? `Nivel de certeza BAJO — Datos insuficientes (${estimatedFieldsCount} respuestas "No sé"):`
                  : `Nota sobre datos estimados (${estimatedFieldsCount} ${estimatedFieldsCount === 1 ? "respuesta" : "respuestas"} "No sé"):`
              }</strong> En esas preguntas aplicamos <em>supuestos conservadores de referencia</em> (no son datos verificados de tu casa).</p>
              ${
                result.rangoLetras
                  ? `<p class="mt-1 font-semibold">Rango orientativo por incertidumbre: <strong>${result.rangoLetras}</strong>. Revisa el "Paso 0" abajo antes de invertir en obras mayores.</p>`
                  : ""
              }
            </div>
          </div>
        `
            : ""
        }

        <!-- Tarjeta principal: Índice orientativo -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div class="md:col-span-5 text-center md:text-left">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Nivel orientativo estimado</p>
              <div class="mt-2 flex flex-wrap items-baseline justify-center md:justify-start gap-3">
                <span class="font-heading text-6xl font-extrabold text-[#0F3D5E]">${result.letraEstimada}</span>
                <span class="text-sm font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  Índice: ${result.ahorroEstimadoPct >= 0 ? "+" : ""}${result.ahorroEstimadoPct} pts vs. referencia
                </span>
              </div>
              ${
                result.rangoLetras
                  ? `<p class="mt-1.5 text-xs font-semibold text-amber-800">Rango orientativo por datos faltantes: ${result.rangoLetras}</p>`
                  : ""
              }
              <p class="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">${result.resumenEjecutivo}</p>
            </div>
            <div class="md:col-span-7 space-y-2">
              <p class="text-xs font-semibold text-slate-500 mb-2">Escala referencial inspirada en CEV (A+ más eficiente · G menos eficiente)</p>
              ${cevBars}
              <!-- P1-9 / Claude #6: Explicación honesta sobre A+ -->
              <p class="text-[11px] text-slate-500 pt-2 leading-relaxed">
                <strong>Nota sobre A+ y A:</strong> Este pre-diagnóstico evalúa solo envolvente pasiva (sin paneles solares, colectores ni equipos activos). Por eso una casa óptima llega hasta <strong>B</strong> y un depto intermedio óptimo hasta <strong>A</strong>; alcanzar <strong>A+ (&gt;85 pts)</strong> en la CEV oficial requiere además energías renovables (ERNC) y climatización certificada.
              </p>
            </div>
          </div>

          <!-- Medidores Invierno / Verano -->
          <div class="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="flex items-center justify-between">
                <span class="font-heading font-bold text-[#0F3D5E]">❄️ Desempeño en Invierno</span>
                <span class="text-lg font-extrabold text-[#0F3D5E]">${result.puntajeInvierno}/100</span>
              </div>
              <div class="w-full h-3 bg-white rounded-full overflow-hidden mt-3 border border-slate-200">
                <div class="h-full rounded-full" style="width: ${result.puntajeInvierno}%; background-color: ${invStyle.bar};"></div>
              </div>
              <p class="text-xs text-slate-500 mt-2">Capacidad estimada de retener calor interior (pondera 65% del índice).</p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="flex items-center justify-between">
                <span class="font-heading font-bold text-[#0F3D5E]">☀️ Protección en Verano</span>
                <span class="text-lg font-extrabold text-[#0F3D5E]">${result.puntajeVerano}/100</span>
              </div>
              <div class="w-full h-3 bg-white rounded-full overflow-hidden mt-3 border border-slate-200">
                <div class="h-full rounded-full" style="width: ${result.puntajeVerano}%; background-color: ${verStyle.bar};"></div>
              </div>
              <p class="text-xs text-slate-500 mt-2">Resistencia estimada frente al calor y radiación solar (pondera 35% del índice).</p>
              ${
                result.tieneVentilacionCruzada
                  ? `<p class="text-xs font-semibold text-[#1E7E5A] mt-2">🌬️ Ventaja detectada: tienes fachadas opuestas, lo que permite refrescar rápido por ventilación cruzada nocturna en verano.</p>`
                  : ""
              }
            </div>
          </div>
        </div>

        <!-- Desglose por componente -->
        <div class="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 class="font-heading text-xl font-bold text-[#0F3D5E]">Puntos críticos de tu envolvente</h2>
            <span class="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-[#0F3D5E] border border-sky-200">
              U ventanas estimado: ${result.uVentanaEstimado} W/m²K
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            ${componentsHtml}
          </div>

          ${
            weaknessCardsHtml
              ? `
            <div class="mt-6 pt-5 border-t border-slate-100">
              <h3 class="font-heading text-base font-bold text-[#0F3D5E] mb-3">Hallazgos detectados en tu vivienda</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${weaknessCardsHtml}
              </div>
            </div>
          `
              : ""
          }
        </div>

        <!-- Aviso legal/metodológico (P1-10) -->
        <div class="mt-6 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>Transparencia metodológica:</strong> ${window.SOLUTIONS_CATALOG.meta.aviso_legal_ui} Este índice no mide superficie exacta en m², ocupación ni consumo real de cuentas; una etiqueta oficial CEV solo la emite un Evaluador Energético acreditado por el MINVU.
        </div>

        <!-- Acciones rápidas de reporte -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3 no-print">
          <button onclick="document.getElementById('soluciones-personalizadas').scrollIntoView({ behavior: 'smooth' })" class="flex-1 px-7 py-4 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-bold text-base shadow-md transition cursor-pointer">
            ↓ Ver mis soluciones personalizadas
          </button>
          <button onclick="window.print()" class="px-6 py-4 rounded-xl border-2 border-[#0F3D5E] text-[#0F3D5E] hover:bg-slate-50 font-semibold text-base transition cursor-pointer">
            🖨️ Guardar PDF / Imprimir
          </button>
          <a href="https://wa.me/?text=${whatsappText}" target="_blank" rel="noopener" class="px-6 py-4 rounded-xl bg-[#1E7E5A] hover:bg-[#176447] text-white font-semibold text-base text-center transition">
            Compartir WhatsApp
          </a>
        </div>

        <!-- SISTEMA DE SOLUCIONES PERSONALIZADAS BASADO EN LAS RESPUESTAS -->
        ${renderPersonalizedSolutionsSection()}
      </section>
    `;
  }

  // =========================================================================
  // VISTA 4: TIPS ÚTILES Y SUBSIDIOS VIGENTES 2026 (/tips-y-subsidios)
  // =========================================================================
  function renderTipsAndSubsidies() {
    const catalog = window.SOLUTIONS_CATALOG;
    const debilidades = lastDiagnosis ? lastDiagnosis.result.debilidades : null;
    const tipoVivienda = lastDiagnosis ? lastDiagnosis.normalizedInput.tipoVivienda : null;
    const tenencia = lastDiagnosis ? lastDiagnosis.tenencia : "dueno";

    let tabContentHtml = "";

    if (activeTipsSubTab === "tips") {
      let tips = [...catalog.tips_costo_cero];

      if (tipoVivienda) {
        tips = tips.filter((t) => !t.aplica_a || t.aplica_a.includes(tipoVivienda));
      }

      if (debilidades && debilidades.length > 0) {
        tips.sort((a, b) => {
          const matchA = a.tags.some((t) => debilidades.includes(t)) ? 1 : 0;
          const matchB = b.tags.some((t) => debilidades.includes(t)) ? 1 : 0;
          return matchB - matchA;
        });
      }

      const totalVisible = tips.length;
      if (tipSeasonFilter !== "todas") {
        tips = tips.filter((t) => t.temporada === tipSeasonFilter || t.temporada === "ambas");
      }

      tabContentHtml = `
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div>
            <h2 class="font-heading text-lg font-bold text-[#0F3D5E]">Tips útiles y sencillos a costo $0</h2>
            <p class="text-xs sm:text-sm text-slate-600">Hábitos cotidianos y prácticos para mejorar la temperatura de tu vivienda hoy mismo sin gastar dinero.</p>
          </div>
          <div class="inline-flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
            <button onclick="window.EnvuelveApp.setTipSeason('todas')" class="px-3 py-1.5 rounded-lg cursor-pointer ${tipSeasonFilter === "todas" ? "bg-[#0F3D5E] text-white" : "text-slate-600"}">Todos (${totalVisible})</button>
            <button onclick="window.EnvuelveApp.setTipSeason('invierno')" class="px-3 py-1.5 rounded-lg cursor-pointer ${tipSeasonFilter === "invierno" ? "bg-[#0F3D5E] text-white" : "text-slate-600"}">❄️ Invierno</button>
            <button onclick="window.EnvuelveApp.setTipSeason('verano')" class="px-3 py-1.5 rounded-lg cursor-pointer ${tipSeasonFilter === "verano" ? "bg-[#D96B27] text-white" : "text-slate-600"}">☀️ Verano</button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          ${tips
            .map((tip, idx) => {
              const isRelevant = debilidades && debilidades.length > 0 && tip.tags.some((t) => debilidades.includes(t));
              const seasonBadge =
                tip.temporada === "verano"
                  ? `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800">☀️ Verano</span>`
                  : tip.temporada === "invierno"
                  ? `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800">❄️ Invierno</span>`
                  : `<span class="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800">Todo el año</span>`;
              return `
                <div class="bg-white rounded-2xl border ${isRelevant ? "border-[#1E7E5A]/50" : "border-slate-200"} p-5 shadow-sm">
                  <div class="flex items-start gap-3">
                    <span class="w-7 h-7 shrink-0 rounded-full bg-[#1E7E5A] text-white text-xs font-bold flex items-center justify-center mt-0.5">${idx + 1}</span>
                    <div class="flex-1">
                      <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
                        ${seasonBadge}
                        <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">🕒 ${tip.momento_del_dia}</span>
                        ${isRelevant ? `<span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">Útil para tu diagnóstico</span>` : ""}
                      </div>
                      <h3 class="font-heading font-bold text-[#0F3D5E] text-base">${tip.titulo}</h3>
                      <p class="text-sm text-slate-600 mt-1.5 leading-relaxed">${tip.descripcion}</p>
                    </div>
                  </div>
                </div>
              `;
            })
            .join("")}
        </div>
      `;
    } else {
      const subData = catalog.subsidios;

      const checklistHtml = subData.checklist_preliminar_ui
        .map(
          (item, i) => `
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <p class="font-semibold text-sm text-[#0F3D5E]">${i + 1}. ${item.pregunta}</p>
            <p class="text-xs sm:text-sm text-slate-600 mt-1">${item.si_no}</p>
          </div>
        `
        )
        .join("");

      const fichasHtml = subData.fichas
        .map(
          (f) => `
          <article class="bg-white rounded-3xl border ${f.vigente_ahora ? "border-[#1E7E5A] ring-2 ring-[#1E7E5A]/15" : "border-slate-200"} p-6 sm:p-8 shadow-sm">
            <div class="flex flex-wrap items-center gap-2 mb-3">
              <span class="px-3 py-1 rounded-full text-xs font-bold ${
                f.vigente_ahora
                  ? "bg-[#1E7E5A] text-white"
                  : "bg-slate-200 text-slate-700"
              }">${f.vigencia_badge}</span>
              <span class="px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-[#0F3D5E]">${f.organismo}</span>
            </div>

            <h2 class="font-heading text-xl sm:text-2xl font-bold text-[#0F3D5E]">${f.nombre}</h2>
            <p class="text-sm font-semibold ${f.vigente_ahora ? "text-[#1E7E5A]" : "text-amber-800"} mt-2">${f.estado}</p>
            <p class="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">${f.resumen}</p>

            <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <h3 class="font-heading font-bold text-sm text-[#0F3D5E] mb-2">¿Qué obras financia?</h3>
                <ul class="space-y-1.5 text-xs sm:text-sm text-slate-700">
                  ${f.que_financia.map((item) => `<li class="flex items-start gap-2"><span class="text-[#1E7E5A] font-bold">✓</span><span>${item}</span></li>`).join("")}
                </ul>
              </div>

              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div>
                  <h3 class="font-heading font-bold text-sm text-[#0F3D5E] mb-1">Ahorro mínimo y montos</h3>
                  <p class="text-xs sm:text-sm text-slate-700">${f.ahorro_minimo_familia}</p>
                </div>
                <div>
                  <h3 class="font-heading font-bold text-sm text-[#0F3D5E] mb-1">Requisitos principales</h3>
                  <ul class="space-y-1 text-xs sm:text-sm text-slate-700">
                    ${f.requisitos_postulante.map((r) => `<li>• ${r}</li>`).join("")}
                    ${f.requisitos_vivienda.map((r) => `<li>• ${r}</li>`).join("")}
                  </ul>
                </div>
              </div>
            </div>

            <div class="mt-4 p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
              <h3 class="font-heading font-bold text-sm text-[#0F3D5E] mb-1.5">Cómo postular paso a paso</h3>
              <ul class="space-y-1 text-xs sm:text-sm text-slate-700">
                ${f.como_se_postula.map((step) => `<li>${step}</li>`).join("")}
              </ul>
            </div>

            <div class="mt-5 flex flex-wrap gap-2.5">
              ${f.links
                .map(
                  (lnk, idx) => `
                <a href="${lnk.url}" target="_blank" rel="noopener" class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  idx === 0
                    ? "bg-[#0F3D5E] hover:bg-[#0a2c45] text-white"
                    : "bg-slate-100 hover:bg-slate-200 text-[#0F3D5E]"
                }">
                  <span>${lnk.titulo}</span>
                  <span>↗</span>
                </a>
              `
                )
                .join("")}
            </div>
          </article>
        `
        )
        .join("");

      tabContentHtml = `
        <div class="space-y-6">
          <div class="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900">
            <strong>Verificado a noviembre 2026:</strong> ${subData.aviso}
          </div>

          ${
            tenencia === "arrendatario"
              ? `
            <div class="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sm text-[#0F3D5E]">
              <strong>Nota para arrendatarios:</strong> Los subsidios de mejoramiento del MINVU exigen ser propietario o asignatario. Puedes revisar tus medidas removibles en <strong>Diagnóstico</strong> o compartir tu reporte con el propietario.
            </div>
          `
              : ""
          }

          ${fichasHtml}

          <!-- Checklist preliminar -->
          <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 class="font-heading text-xl font-bold text-[#0F3D5E]">Checklist rápido antes de postular</h3>
            <p class="text-sm text-slate-600 mt-1 mb-4">Revisa estas 4 preguntas básicas para saber por dónde partir:</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              ${checklistHtml}
            </div>
          </div>
        </div>
      `;
    }

    return `
      <section class="max-w-5xl mx-auto px-4 pt-6 pb-16">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-[#1E7E5A]">Consejos a costo $0 y financiamiento estatal</span>
          <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E] mt-1">
            Tips Útiles y Subsidios Vigentes 2026
          </h1>
          <p class="text-sm sm:text-base text-slate-600 mt-1">
            Aquí reunimos consejos sencillos para aplicar hoy sin costo y los subsidios habitacionales del MINVU disponibles en 2026.
            ${
              lastDiagnosis
                ? `<button onclick="window.EnvuelveApp.navigateTo('/resultado')" class="text-[#D96B27] font-semibold underline cursor-pointer ml-1">Volver a mi diagnóstico y soluciones personalizadas</button>`
                : `<button onclick="window.EnvuelveApp.navigateTo('/encuesta')" class="text-[#D96B27] font-semibold underline cursor-pointer ml-1">Haz la encuesta para ver soluciones personalizadas</button>`
            }
          </p>
        </div>

        <div class="mb-6">
          <div class="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 gap-1 w-full sm:w-auto">
            <button onclick="window.EnvuelveApp.setTipsSubTab('tips')" class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTipsSubTab === "tips" ? "bg-[#1E7E5A] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Tips Útiles ($0)</button>
            <button onclick="window.EnvuelveApp.setTipsSubTab('subsidios')" class="flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeTipsSubTab === "subsidios" ? "bg-[#D96B27] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Subsidios MINVU 2026</button>
          </div>
        </div>

        ${tabContentHtml}
      </section>
    `;
  }

  // =========================================================================
  // VISTA 5: DOCUMENTOS OFICIALES (/documentos)
  // =========================================================================
  function renderDocuments() {
    const docs = window.SOLUTIONS_CATALOG.documentos_oficiales || [];

    const cardsHtml = docs
      .map(
        (doc) => `
        <article class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <span class="inline-block px-3 py-1 rounded-full bg-sky-50 text-[#0F3D5E] text-xs font-bold mb-3">
            ${doc.categoria}
          </span>
          <h2 class="font-heading text-xl sm:text-2xl font-bold text-[#0F3D5E]">${doc.titulo}</h2>
          <p class="text-xs sm:text-sm font-semibold text-[#1E7E5A] mt-1">${doc.entidad}</p>
          <p class="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">${doc.descripcion}</p>

          <div class="mt-5 flex flex-wrap gap-3">
            ${doc.links
              .map(
                (lnk) => `
              <a href="${lnk.url}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition ${
                lnk.primario
                  ? "bg-[#0F3D5E] hover:bg-[#0a2c45] text-white"
                  : "bg-slate-100 hover:bg-slate-200 text-[#0F3D5E]"
              }">
                <span>📄 ${lnk.titulo}</span>
                <span>↗</span>
              </a>
            `
              )
              .join("")}
          </div>
        </article>
      `
      )
      .join("");

    return `
      <section class="max-w-4xl mx-auto px-4 pt-6 pb-16">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-[#D96B27]">Transparencia y respaldo técnico</span>
          <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E] mt-1">Documentos Oficiales de Referencia</h1>
          <p class="text-sm sm:text-base text-slate-600 mt-2">
            Accede directamente al <strong>Manual Técnico CEV del MINVU</strong>, a la <strong>Estrategia Nacional de Calor y Frío</strong> del Ministerio de Energía y a la normativa oficial de subsidios 2026 que sustentan la Iniciativa Envuelve tu Casa.
          </p>
        </div>

        <div class="space-y-5">
          ${cardsHtml}
        </div>
      </section>
    `;
  }

  // =========================================================================
  // VISTA 6: ESTADÍSTICAS AGREGADAS (/estadisticas — P0-B y P2-5)
  // =========================================================================
  async function renderStats() {
    const main = document.getElementById("app-main");
    main.innerHTML = `<div class="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">Cargando estadísticas agregadas...</div>`;

    const { source, stats, rpcErrorMsg } = await fetchAggregatedStats();
    const total = Number(stats.total || 0);
    const avgInv = Number(stats.avg_invierno || 0);
    const avgVer = Number(stats.avg_verano || 0);
    const letterCounts = stats.por_letra || {};
    const topDebilidades = (stats.top_debilidades || []).slice(0, 5);
    const topComunas = (stats.top_comunas || []).slice(0, 8);
    const tagMap = getTagMap();

    let sourceBanner = "";
    if (source === "supabase_rpc") {
      sourceBanner = `
        <div class="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-medium">
          ✓ <strong>Datos globales en tiempo real (Supabase · Vista agregada segura):</strong> Solo se consultan conteos agregados sin exponer encuestas individuales.
        </div>
      `;
    } else if (source === "supabase_legacy") {
      sourceBanner = `
        <div class="mb-6 p-3.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs sm:text-sm">
          ✓ <strong>Datos globales en Supabase (últimos 1.000 registros):</strong> Recuerda ejecutar el SQL de la función <code>get_estadisticas_agregadas()</code> para restringir la lectura directa de filas por RLS.
        </div>
      `;
    } else if (source === "supabase_rpc_missing") {
      sourceBanner = `
        <div class="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-900 text-sm space-y-1">
          <p><strong>Falta activar la función agregada en Supabase:</strong> La lectura pública de filas está protegida por RLS, pero la función <code>get_estadisticas_agregadas()</code> devolvió un error.</p>
          <p class="text-xs font-mono bg-white/80 p-2 rounded border border-red-200">Detalle: ${rpcErrorMsg || "Función no encontrada"}</p>
          <p class="text-xs">Ejecuta el SQL corregido (con <code>CROSS JOIN LATERAL unnest</code>) en Supabase → SQL Editor y recarga esta página.</p>
        </div>
      `;
    } else {
      sourceBanner = `
        <div class="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
          <strong>Modo local activo (solo este navegador, máx. 200 registros):</strong> No hay conexión remota activa con Supabase. Verifica que <code>supabaseConfig.js</code> tenga la URL raíz <code>https://tu-proyecto.supabase.co</code> (sin <code>/rest/v1/</code>) y tu clave pública.
          ${rpcErrorMsg ? `<p class="text-xs mt-1 font-mono">Detalle técnico: ${rpcErrorMsg}</p>` : ""}
        </div>
      `;
    }

    main.innerHTML = `
      <section class="max-w-5xl mx-auto px-4 pt-6 pb-16">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#D96B27]">Panel de monitoreo · Muestra voluntaria agregada</span>
            <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E]">Estadísticas — Iniciativa Envuelve tu Casa</h1>
          </div>
          <button onclick="window.EnvuelveApp.exportStatsCSV()" class="px-4 py-2.5 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold hover:bg-[#0a2c45] cursor-pointer">
            ⬇ Exportar resumen CSV
          </button>
        </div>

        ${sourceBanner}

        ${
          supabaseUrlFixedNote
            ? `<div class="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">⚠️ Nota técnica: tu <code>supabaseConfig.js</code> contenía <code>/rest/v1/</code> al final de la URL y fue corregido automáticamente en ejecución. Conviene quitarlo también del archivo en GitHub.</div>`
            : ""
        }

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-200">
            <p class="text-xs font-bold uppercase text-slate-500">Registros consultados (muestra voluntaria)</p>
            <p class="font-heading text-4xl font-extrabold text-[#0F3D5E] mt-1">${total}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200">
            <p class="text-xs font-bold uppercase text-slate-500">Promedio Desempeño Invierno</p>
            <p class="font-heading text-4xl font-extrabold text-[#D96B27] mt-1">${avgInv}<span class="text-lg text-slate-400">/100</span></p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200">
            <p class="text-xs font-bold uppercase text-slate-500">Promedio Protección Verano</p>
            <p class="font-heading text-4xl font-extrabold text-[#1E7E5A] mt-1">${avgVer}<span class="text-lg text-slate-400">/100</span></p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200">
            <h2 class="font-heading font-bold text-lg text-[#0F3D5E] mb-4">Distribución de niveles orientativos</h2>
            <canvas id="cevChartCanvas" height="220"></canvas>
          </div>

          <div class="lg:col-span-5 space-y-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <h2 class="font-heading font-bold text-lg text-[#0F3D5E] mb-3">Debilidades más frecuentes</h2>
              ${
                topDebilidades.length
                  ? `<ol class="space-y-2.5 text-sm">
                      ${topDebilidades
                        .map(
                          (item, idx) => `
                        <li class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50">
                          <span class="font-medium text-slate-800">${idx + 1}. ${(tagMap[item.tag] && tagMap[item.tag].etiqueta_usuario) || item.tag}</span>
                          <span class="font-bold text-[#D96B27] shrink-0">${item.count} (${total ? Math.round((item.count / total) * 100) : 0}%)</span>
                        </li>
                      `
                        )
                        .join("")}
                    </ol>`
                  : `<p class="text-sm text-slate-500">Aún no hay registros suficientes.</p>`
              }
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <h2 class="font-heading font-bold text-lg text-[#0F3D5E] mb-3">Comunas con más registros</h2>
              ${
                topComunas.length
                  ? `<div class="flex flex-wrap gap-2">
                      ${topComunas
                        .map(
                          (item) =>
                            `<span class="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">${item.comuna}: ${item.count}</span>`
                        )
                        .join("")}
                    </div>`
                  : `<p class="text-sm text-slate-500">Aún no hay comunas registradas.</p>`
              }
            </div>
          </div>
        </div>

        <!-- P2-5: Aviso metodológico de muestra voluntaria -->
        <div class="mt-6 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>Nota sobre la muestra:</strong> Estas cifras corresponden exclusivamente a <em>registros voluntarios</em> ingresados en la plataforma (pueden incluir pruebas repetidas o sesgo de autoselección y no representan un censo estadístico de las viviendas de Santiago).
        </div>
      </section>
    `;

    window.__lastAggregatedStats = stats;

    const canvas = document.getElementById("cevChartCanvas");
    if (canvas && window.Chart) {
      if (statsChart) statsChart.destroy();
      statsChart = new window.Chart(canvas, {
        type: "bar",
        data: {
          labels: CEV_LEVELS.map((l) => l.letter),
          datasets: [
            {
              label: "Registros",
              data: CEV_LEVELS.map((l) => Number(letterCounts[l.letter] || 0)),
              backgroundColor: CEV_LEVELS.map((l) => l.color),
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, ticks: { precision: 0 } }
          }
        }
      });
    }
  }

  function exportStatsCSV() {
    const stats = window.__lastAggregatedStats;
    if (!stats || !stats.total) {
      alert("Todavía no hay registros agregados para exportar.");
      return;
    }
    const lines = ["categoria,clave,cantidad"];
    lines.push(`resumen,total_registros_voluntarios,${stats.total}`);
    lines.push(`resumen,promedio_invierno_100,${stats.avg_invierno}`);
    lines.push(`resumen,promedio_verano_100,${stats.avg_verano}`);
    CEV_LEVELS.forEach((l) => {
      lines.push(`nivel,${l.letter},${Number((stats.por_letra && stats.por_letra[l.letter]) || 0)}`);
    });
    (stats.top_debilidades || []).forEach((d) => {
      lines.push(`debilidad,${d.tag},${d.count}`);
    });
    (stats.top_comunas || []).forEach((c) => {
      const safe = String(c.comuna || "").split('"').join('""');
      lines.push(`comuna,"${safe}",${c.count}`);
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resumen_agregado_iniciativa_envuelve_tu_casa.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  // =========================================================================
  // ASISTENTE INTERACTIVO GUIADO (FLOTANTE EN ENCUESTA)
  // =========================================================================
  function renderAssistant() {
    const container = document.getElementById("assistant-root");
    if (!container) return;

    const route = getCurrentRoute();
    if (route !== "/encuesta") {
      container.innerHTML = "";
      return;
    }

    const block = window.QUESTIONS_DATA.blocks[currentStep];
    const faqGroup =
      window.QUESTIONS_DATA.assistantFAQ[block.assistantBlockKey] ||
      window.QUESTIONS_DATA.assistantFAQ.bloque_1;

    container.innerHTML = `
      <div class="fixed bottom-4 right-4 z-50 no-print flex flex-col items-end">
        ${
          assistantOpen
            ? `
          <div class="mb-3 w-[calc(100vw-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div class="bg-[#0F3D5E] text-white px-4 py-3 flex items-center justify-between">
              <div>
                <p class="font-heading font-bold text-sm">Asistente Iniciativa Envuelve tu Casa</p>
                <p class="text-[11px] text-sky-200">${faqGroup.titulo}</p>
              </div>
              <button onclick="window.EnvuelveApp.toggleAssistant()" class="text-white/80 hover:text-white text-lg font-bold px-2 cursor-pointer">✕</button>
            </div>

            <div class="p-4 max-h-64 overflow-y-auto space-y-3 bg-slate-50">
              <div class="bg-white border border-slate-200 rounded-xl p-3 text-xs sm:text-sm text-slate-700">
                Hola 👋 Toca cualquiera de las dudas frecuentes de este paso y te ayudo al instante:
              </div>
              ${assistantMessages
                .map(
                  (m) => `
                <div class="space-y-1.5">
                  <div class="ml-6 bg-[#0F3D5E] text-white rounded-xl rounded-br-none p-2.5 text-xs font-medium">${m.q}</div>
                  <div class="mr-4 bg-white border border-slate-200 text-slate-700 rounded-xl rounded-bl-none p-3 text-xs sm:text-sm leading-relaxed">${m.a}</div>
                </div>
              `
                )
                .join("")}
            </div>

            <div class="p-3 bg-white border-t border-slate-200 space-y-1.5">
              ${faqGroup.items
                .map(
                  (item, idx) => `
                <button
                  type="button"
                  onclick="window.EnvuelveApp.askAssistant('${block.assistantBlockKey}', ${idx})"
                  class="w-full text-left text-xs font-semibold px-3 py-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#0F3D5E] transition cursor-pointer"
                >
                  💬 ${item.q}
                </button>
              `
                )
                .join("")}
            </div>
          </div>
        `
            : ""
        }

        <button
          type="button"
          onclick="window.EnvuelveApp.toggleAssistant()"
          class="px-4 py-3 rounded-full bg-[#0F3D5E] hover:bg-[#0a2c45] text-white font-semibold text-sm shadow-lg flex items-center gap-2 transition cursor-pointer"
        >
          <span>💬</span>
          <span>${assistantOpen ? "Cerrar ayuda" : "¿Tienes dudas?"}</span>
        </button>
      </div>
    `;
  }

  // =========================================================================
  // ROUTER PRINCIPAL
  // =========================================================================
  function renderRoute() {
    const route = getCurrentRoute();
    const main = document.getElementById("app-main");
    if (!main) return;

    updateNavHighlight(route);

    if (route === "/encuesta") {
      main.innerHTML = renderSurvey();
    } else if (route === "/resultado") {
      main.innerHTML = renderResult();
    } else if (route === "/tips-y-subsidios") {
      main.innerHTML = renderTipsAndSubsidies();
    } else if (route === "/soluciones") {
      main.innerHTML = lastDiagnosis ? renderResult() : renderTipsAndSubsidies();
    } else if (route === "/documentos") {
      main.innerHTML = renderDocuments();
    } else if (route === "/estadisticas") {
      renderStats();
    } else {
      main.innerHTML = renderHome();
    }

    renderAssistant();
  }

  // API pública para manejadores onclick
  window.EnvuelveApp = {
    navigateTo,
    startOrContinue() {
      navigateTo("/encuesta");
    },
    openTipsSubTab(tab) {
      activeTipsSubTab = tab;
      navigateTo("/tips-y-subsidios");
    },
    toggleMultiAnswer(field, value, isExclusive) {
      let current = answers[field];
      if (!Array.isArray(current)) {
        current = current ? [String(current)] : [];
      } else {
        current = [...current];
      }

      if (isExclusive) {
        answers[field] = current.includes(value) ? [] : [value];
      } else {
        // Quitar cualquier opción exclusiva ("no_se") al elegir una orientación real
        current = current.filter((v) => v !== "no_se");
        if (current.includes(value)) {
          current = current.filter((v) => v !== value);
        } else {
          current.push(value);
        }
        answers[field] = current;
      }

      saveState();
      renderRoute();
    },
    setAnswer(field, value) {
      answers[field] = value;
      if (field === "tipoVivienda") {
        if (value === "depto_intermedio" || value === "depto_primer_piso") {
          answers.techo = "adiabatico";
        } else if (answers.techo === "adiabatico") {
          delete answers.techo;
        }
        if (value === "depto_intermedio" || value === "depto_ultimo_piso") {
          answers.piso = "adiabatico";
        } else if (answers.piso === "adiabatico") {
          delete answers.piso;
        }
      }
      saveState();
      renderRoute();
    },
    toggleHelp(qId) {
      openHelps[qId] = !openHelps[qId];
      renderRoute();
    },
    nextStep() {
      if (!validateCurrentStep()) return;
      currentStep = Math.min(window.QUESTIONS_DATA.blocks.length - 1, currentStep + 1);
      saveState();
      window.scrollTo({ top: 0, behavior: "smooth" });
      renderRoute();
    },
    prevStep() {
      if (currentStep === 0) {
        navigateTo("/");
        return;
      }
      currentStep = Math.max(0, currentStep - 1);
      saveState();
      window.scrollTo({ top: 0, behavior: "smooth" });
      renderRoute();
    },
    submitSurvey,
    resetSurvey,
    setDiagnosisSolTab(tab) {
      activeDiagnosisSolTab = tab;
      renderRoute();
    },
    setTipsSubTab(tab) {
      activeTipsSubTab = tab;
      renderRoute();
    },
    setTipSeason(season) {
      tipSeasonFilter = season;
      renderRoute();
    },
    toggleArrendatarioFilter() {
      filterArrendatarioOnly = !filterArrendatarioOnly;
      renderRoute();
    },
    toggleAssistant() {
      assistantOpen = !assistantOpen;
      renderAssistant();
    },
    askAssistant(blockKey, idx) {
      const item = window.QUESTIONS_DATA.assistantFAQ[blockKey].items[idx];
      if (!item) return;
      assistantMessages.push(item);
      if (assistantMessages.length > 4) assistantMessages = assistantMessages.slice(-4);
      renderAssistant();
    },
    exportStatsCSV
  };

  window.addEventListener("popstate", renderRoute);
  window.addEventListener("hashchange", renderRoute);
  function injectFooterStatsLink() {
    const footerBox = document.querySelector("footer > div");
    if (!footerBox || document.getElementById("footer-stats-btn")) return;
    const btn = document.createElement("button");
    btn.id = "footer-stats-btn";
    btn.type = "button";
    btn.textContent = "Estadísticas";
    btn.className = "text-xs text-slate-400 hover:text-[#0F3D5E] underline cursor-pointer";
    btn.onclick = () => navigateTo("/estadisticas");
    footerBox.appendChild(btn);
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSupabase();
    loadState();
    injectFooterStatsLink();
    renderRoute();
  });
})();
