// Aplicación principal "Iniciativa Envuelve tu Casa"
(function () {
  const STORAGE_ANSWERS_KEY = "envuelve_answers_v1";
  const STORAGE_STEP_KEY = "envuelve_step_v1";
  const STORAGE_RESULT_KEY = "envuelve_result_v1";
  const STORAGE_LOCAL_DB_KEY = "envuelve_local_diagnosticos_v1";

  const CEV_LEVELS = [
    { letter: "A+", range: "> 85% ahorro", color: "#0B6E4F" },
    { letter: "A", range: "70% a 85%", color: "#1E8449" },
    { letter: "B", range: "55% a 70%", color: "#52BE80" },
    { letter: "C", range: "40% a 55%", color: "#A3D977" },
    { letter: "D", range: "20% a 40%", color: "#F4D03F" },
    { letter: "E", range: "-10% a 20%", color: "#EB984E" },
    { letter: "F", range: "-35% a -10%", color: "#DC7633" },
    { letter: "G", range: "< -35%", color: "#C0392B" }
  ];

  let supabaseClient = null;
  let statsChart = null;
  let currentStep = 0; // 0..4
  let answers = {};
  let lastDiagnosis = null;
  let openHelps = {};
  let assistantOpen = false;
  let assistantMessages = [];
  let activeSolutionTab = "bajo_costo"; // bajo_costo | alto_impacto | tips | subsidios
  let filterArrendatarioOnly = false;
  let tipSeasonFilter = "todas"; // todas | invierno | verano

  // --- Inicialización Supabase ---
  function initSupabase() {
    try {
      const cfg = window.SUPABASE_CONFIG || {};
      if (cfg.url && cfg.anonKey && window.supabase && window.supabase.createClient) {
        supabaseClient = window.supabase.createClient(cfg.url, cfg.anonKey);
      }
    } catch (err) {
      console.error("Error inicializando Supabase:", err);
      supabaseClient = null;
    }
  }

  function isFileProtocol() {
    return window.location.protocol === "file:";
  }

  function getCurrentRoute() {
    if (isFileProtocol()) {
      const h = (window.location.hash || "#/").replace(/^#/, "");
      return h || "/";
    }
    return window.location.pathname || "/";
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

  function formatCostRange(costo) {
    if (!costo) return "";
    const range = `${formatCLP(costo.min_clp)} – ${formatCLP(costo.max_clp)}`;
    return costo.unidad ? `${range} ${costo.unidad}` : range;
  }

  function getTagMap() {
    const map = {};
    const tags = (window.SOLUTIONS_CATALOG && window.SOLUTIONS_CATALOG.tags) || [];
    tags.forEach((t) => {
      map[t.tag] = t;
    });
    return map;
  }

  // --- Persistencia Local ---
  function loadState() {
    try {
      const savedAnswers = localStorage.getItem(STORAGE_ANSWERS_KEY);
      if (savedAnswers) answers = JSON.parse(savedAnswers);
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY);
      if (savedStep !== null) currentStep = Math.max(0, Math.min(4, parseInt(savedStep, 10) || 0));
      const savedResult = localStorage.getItem(STORAGE_RESULT_KEY);
      if (savedResult) lastDiagnosis = JSON.parse(savedResult);
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

    if (!supabaseClient) return;

    try {
      const { error } = await supabaseClient.from("diagnosticos").insert([payload]);
      if (error) console.error("Error guardando en Supabase:", error);
    } catch (err) {
      console.error("Excepción al guardar en Supabase:", err);
    }
  }

  async function fetchStatsRecords() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from("diagnosticos")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1000);
        if (!error && Array.isArray(data)) {
          return { source: "supabase", rows: data };
        }
        console.error("Error consultando Supabase:", error);
      } catch (err) {
        console.error("Excepción consultando Supabase:", err);
      }
    }
    const localRows = JSON.parse(localStorage.getItem(STORAGE_LOCAL_DB_KEY) || "[]");
    return { source: "local", rows: localRows };
  }

  // --- Helpers Visuales ---
  function scoreColor(score) {
    if (score >= 70) return { bar: "#1E7E5A", bg: "bg-emerald-50", text: "text-emerald-800", label: "Bueno" };
    if (score >= 45) return { bar: "#D96B27", bg: "bg-amber-50", text: "text-amber-800", label: "Mejorable" };
    return { bar: "#C0392B", bg: "bg-red-50", text: "text-red-800", label: "Crítico" };
  }

  function updateNavHighlight(route) {
    document.querySelectorAll("[data-nav-link]").forEach((el) => {
      const target = el.getAttribute("data-nav-link");
      const isActive = route === target;
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
            Descubre qué tan aislado térmicamente está tu hogar en menos de 5 minutos
          </h1>

          <p class="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Diagnóstico térmico gratuito para <strong>casas y departamentos de Santiago</strong>. Recibe recomendaciones claras, alternativas de bajo costo, tips útiles y acceso a subsidios estatales vigentes.
          </p>

          <div class="mt-7 flex flex-col sm:flex-row gap-3">
            <button onclick="window.EnvuelveApp.startOrContinue()" class="w-full sm:w-auto px-7 py-4 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-semibold text-base sm:text-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer">
              <span>${hasProgress ? "Continuar mi evaluación" : "Evaluar mi vivienda ahora"}</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
            </button>
            ${lastDiagnosis ? `
              <button onclick="window.EnvuelveApp.navigateTo('/resultado')" class="w-full sm:w-auto px-6 py-4 rounded-xl border-2 border-[#0F3D5E] text-[#0F3D5E] hover:bg-slate-50 font-semibold text-base transition cursor-pointer">
                Ver mi último diagnóstico (${lastDiagnosis.result.letraEstimada})
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
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Sobre tus muros, ventanas, techo y sol en menos de 5 minutos. Cada pregunta incluye trucos caseros y un asistente guiado.</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <div class="w-10 h-10 rounded-xl bg-[#D96B27]/15 text-[#D96B27] font-heading font-bold flex items-center justify-center text-lg mb-4">2</div>
              <h3 class="font-heading font-bold text-lg text-[#0F3D5E]">Obtén tu perfil térmico</h3>
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Calculamos tu etiqueta estimada (A+ a G) y tu desempeño separado para invierno y verano según parámetros del Manual CEV.</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <div class="w-10 h-10 rounded-xl bg-[#1E7E5A]/15 text-[#1E7E5A] font-heading font-bold flex items-center justify-center text-lg mb-4">3</div>
              <h3 class="font-heading font-bold text-lg text-[#0F3D5E]">Accede a soluciones reales</h3>
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Recibe medidas priorizadas por impacto, soluciones bajo $30.000 CLP, tips sencillos a costo $0 y subsidios MINVU 2026.</p>
            </div>
          </div>
        </div>

        <!-- Accesos rápidos: Tips, Subsidios y Documentos -->
        <div class="mt-10 bg-[#0F3D5E] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p class="text-xs uppercase tracking-wider text-sky-200 font-semibold">Innovación tecnológica con sentido social</p>
            <h3 class="font-heading text-xl font-bold mt-1">Respaldo técnico y política pública</h3>
            <p class="mt-2 text-sm text-sky-100 max-w-2xl leading-relaxed">
              La <strong>Iniciativa Envuelve tu Casa</strong> está alineada con la <strong>Estrategia Nacional de Calor y Frío</strong> del Ministerio de Energía y basada en el <strong>Manual Técnico CEV del MINVU</strong>. Consulta los documentos oficiales, tips útiles y subsidios vigentes 2026.
            </p>
          </div>
          <div class="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button onclick="window.EnvuelveApp.openSolutionsTab('subsidios')" class="px-5 py-3 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-semibold text-sm transition cursor-pointer">
              Ver subsidios 2026 y tips
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

  function renderSurvey() {
    const blocks = window.QUESTIONS_DATA.blocks;
    const block = blocks[currentStep];
    const progressPct = Math.round(((currentStep + 1) / blocks.length) * 100);
    const esAdiabatico = isTechoAdiabaticoSelected();

    const questionsHtml = block.questions
      .map((q) => {
        if (q.hideWhenAdiabatic && esAdiabatico) {
          return `
            <div class="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div class="flex items-start gap-3">
                <span class="text-xl">🏢</span>
                <div>
                  <p class="font-semibold text-base">Pregunta 5 (Techo) omitida automáticamente</p>
                  <p class="text-sm text-emerald-800 mt-1">
                    Como indicaste que vives en un <strong>${answers.tipoVivienda === "depto_intermedio" ? "departamento de piso intermedio" : "departamento de primer piso"}</strong>, tienes otra vivienda acondicionada arriba. En el Manual CEV esto se considera un <em>elemento adiabático</em> (no pierdes calor por el techo), por lo que el cálculo concentra el peso en tus muros y ventanas.
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
                <span class="text-xs font-bold uppercase tracking-wider text-[#D96B27]">Pregunta ${q.number} de 15</span>
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
        <!-- Barra de progreso fija -->
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
              Ver mi diagnóstico térmico ✓
            </button>
          `
          }
        </div>
      </section>
    `;
  }

  function validateCurrentStep() {
    const block = window.QUESTIONS_DATA.blocks[currentStep];
    const esAdiabatico = isTechoAdiabaticoSelected();
    const missing = [];

    block.questions.forEach((q) => {
      if (q.hideWhenAdiabatic && esAdiabatico) return;
      if (answers[q.id] === undefined || answers[q.id] === "") {
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

    const { input, estimatedFieldsCount } = window.ThermalEngine.normalizeSurveyAnswers(answers);
    const result = window.ThermalEngine.calculateThermalDiagnosis(input);

    lastDiagnosis = {
      timestamp: new Date().toISOString(),
      rawAnswers: { ...answers },
      normalizedInput: input,
      estimatedFieldsCount,
      tenencia: answers.tenencia || "dueno",
      presupuesto: answers.presupuesto || "bajo",
      result
    };

    filterArrendatarioOnly = lastDiagnosis.tenencia === "arrendatario";
    if (lastDiagnosis.presupuesto === "bajo" || lastDiagnosis.tenencia === "arrendatario") {
      activeSolutionTab = "bajo_costo";
    } else {
      activeSolutionTab = "alto_impacto";
    }

    saveState();

    const dbPayload = {
      comuna: input.comuna,
      tipo_vivienda: input.tipoVivienda,
      antiguedad: input.antiguedad,
      respuestas_json: {
        ...answers,
        estimatedFieldsCount
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
  // VISTA 3: DIAGNÓSTICO (/resultado)
  // =========================================================================
  function renderResult() {
    if (!lastDiagnosis) {
      return `
        <section class="max-w-2xl mx-auto px-4 py-16 text-center">
          <div class="bg-white rounded-2xl border border-slate-200 p-8">
            <h2 class="font-heading text-2xl font-bold text-[#0F3D5E]">Aún no has completado tu evaluación</h2>
            <p class="mt-2 text-slate-600">Responde la encuesta en menos de 5 minutos para conocer el nivel de aislación térmica de tu vivienda.</p>
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
              ? `<span class="text-xs sm:text-sm font-bold text-[#0F3D5E] bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">← Tu vivienda (${result.ahorroEstimadoPct >= 0 ? "+" : ""}${result.ahorroEstimadoPct}%)</span>`
              : ""
          }
        </div>
      `;
    }).join("");

    const components = [
      { key: "techo", label: "Techo / Cubierta", score: result.desgloseComponentes.techo },
      { key: "muros", label: "Muros exteriores", score: result.desgloseComponentes.muros },
      { key: "ventanas", label: "Ventanas (Vidrio + Marco)", score: result.desgloseComponentes.ventanas },
      { key: "puertas", label: "Puerta exterior", score: result.desgloseComponentes.puertas }
    ];

    const componentsHtml = components
      .map((c) => {
        if (c.score === null) {
          return `
            <div class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <span class="font-semibold text-slate-700 text-sm sm:text-base">${c.label}</span>
              <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">Adiabático (vecino arriba)</span>
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
      `🏠 Diagnóstico Térmico "Iniciativa Envuelve tu Casa" (${normalizedInput.comuna}):\n` +
      `• Etiqueta estimada CEV: ${result.letraEstimada} (${result.ahorroEstimadoPct >= 0 ? "+" : ""}${result.ahorroEstimadoPct}% vs estándar base)\n` +
      `• Confort Invierno: ${result.puntajeInvierno}/100 | Protección Verano: ${result.puntajeVerano}/100\n` +
      `• U estimado ventanas: ${result.uVentanaEstimado} W/m²K`
    );

    return `
      <section class="max-w-4xl mx-auto px-4 pt-6 pb-16">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-5 no-print">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#1E7E5A]">Zona Térmica D · ${normalizedInput.comuna}</span>
            <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E]">Tu Diagnóstico Térmico</h1>
          </div>
          <button onclick="window.EnvuelveApp.resetSurvey()" class="text-sm text-slate-500 hover:text-[#0F3D5E] underline cursor-pointer">
            Evaluar otra vivienda
          </button>
        </div>

        ${
          estimatedFieldsCount > 0
            ? `
          <div class="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-2.5">
            <span>ℹ️</span>
            <p><strong>Nota sobre datos estimados:</strong> Respondiste "No sé" en <strong>${estimatedFieldsCount} ${estimatedFieldsCount === 1 ? "pregunta" : "preguntas"}</strong>. Para no frenar tu diagnóstico, usamos valores promedio de viviendas de Santiago en esos puntos.</p>
          </div>
        `
            : ""
        }

        <!-- Tarjeta principal: Etiqueta CEV -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div class="md:col-span-5 text-center md:text-left">
              <p class="text-xs font-bold uppercase tracking-wider text-slate-500">Nivel de aislación estimado</p>
              <div class="mt-2 flex items-baseline justify-center md:justify-start gap-3">
                <span class="font-heading text-6xl font-extrabold text-[#0F3D5E]">${result.letraEstimada}</span>
                <span class="text-sm font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  ${result.ahorroEstimadoPct >= 0 ? "+" : ""}${result.ahorroEstimadoPct}% ahorro vs. base
                </span>
              </div>
              <p class="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed">${result.resumenEjecutivo}</p>
            </div>
            <div class="md:col-span-7 space-y-2">
              <p class="text-xs font-semibold text-slate-500 mb-2">Escala referencial CEV (A+ más eficiente · G menos eficiente)</p>
              ${cevBars}
            </div>
          </div>

          <!-- Medidores Invierno / Verano -->
          <div class="mt-8 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="flex items-center justify-between">
                <span class="font-heading font-bold text-[#0F3D5E]">❄️ Confort en Invierno</span>
                <span class="text-lg font-extrabold text-[#0F3D5E]">${result.puntajeInvierno}/100</span>
              </div>
              <div class="w-full h-3 bg-white rounded-full overflow-hidden mt-3 border border-slate-200">
                <div class="h-full rounded-full" style="width: ${result.puntajeInvierno}%; background-color: ${invStyle.bar};"></div>
              </div>
              <p class="text-xs text-slate-500 mt-2">Capacidad de retener calefacción y evitar chiflones fríos.</p>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div class="flex items-center justify-between">
                <span class="font-heading font-bold text-[#0F3D5E]">☀️ Protección en Verano</span>
                <span class="text-lg font-extrabold text-[#0F3D5E]">${result.puntajeVerano}/100</span>
              </div>
              <div class="w-full h-3 bg-white rounded-full overflow-hidden mt-3 border border-slate-200">
                <div class="h-full rounded-full" style="width: ${result.puntajeVerano}%; background-color: ${verStyle.bar};"></div>
              </div>
              <p class="text-xs text-slate-500 mt-2">Resistencia frente al calor y radiación solar de tarde en Santiago.</p>
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
              <h3 class="font-heading text-base font-bold text-[#0F3D5E] mb-3">Principales hallazgos detectados en tu vivienda</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                ${weaknessCardsHtml}
              </div>
            </div>
          `
              : ""
          }
        </div>

        <!-- Aviso legal/metodológico -->
        <div class="mt-6 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>Transparencia metodológica:</strong> ${window.SOLUTIONS_CATALOG.meta.aviso_legal_ui} Basado en parámetros del <em>Manual Técnico CEV (MINVU)</em> para Zona Térmica D (Santiago).
        </div>

        <!-- Acciones -->
        <div class="mt-7 flex flex-col sm:flex-row gap-3 no-print">
          <button onclick="window.EnvuelveApp.navigateTo('/soluciones')" class="flex-1 px-7 py-4 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-bold text-base shadow-md transition cursor-pointer">
            Ver soluciones, tips y subsidios →
          </button>
          <button onclick="window.print()" class="px-6 py-4 rounded-xl border-2 border-[#0F3D5E] text-[#0F3D5E] hover:bg-slate-50 font-semibold text-base transition cursor-pointer">
            🖨️ Guardar PDF / Imprimir
          </button>
          <a href="https://wa.me/?text=${whatsappText}" target="_blank" rel="noopener" class="px-6 py-4 rounded-xl bg-[#1E7E5A] hover:bg-[#176447] text-white font-semibold text-base text-center transition">
            Compartir WhatsApp
          </a>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // VISTA 4: SOLUCIONES, TIPS ÚTILES Y SUBSIDIOS 2026 (/soluciones)
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

  function renderSolutionCard(sol, rankIndex) {
    const isTopPriority = rankIndex < 3 && lastDiagnosis;
    return `
      <article class="bg-white rounded-2xl border ${isTopPriority ? "border-[#D96B27]/50 ring-1 ring-[#D96B27]/20" : "border-slate-200"} p-5 sm:p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-3">
            ${
              isTopPriority
                ? `<span class="text-xs font-bold px-2.5 py-1 rounded-full bg-[#D96B27] text-white">★ Prioridad #${rankIndex + 1}</span>`
                : ""
            }
            <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
              sol.categoria === "bajo_costo"
                ? "bg-emerald-50 text-[#1E7E5A]"
                : "bg-sky-50 text-[#0F3D5E]"
            }">Impacto ${sol.impacto} (${sol.impacto_termico_1_10}/10)</span>
            ${getArrendatarioBadge(sol.apto_arrendatario)}
            ${getSubsidioBadge(sol.subsidio_ds27)}
          </div>

          <h3 class="font-heading text-lg font-bold text-[#0F3D5E]">${sol.nombre}</h3>

          <div class="mt-2 inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-lg">
            <span>💰 ${formatCostRange(sol.costo)}</span>
          </div>
          ${
            sol.costo && sol.costo.caso_tipico
              ? `<p class="text-xs text-slate-500 mt-1.5">Referencia: ${sol.costo.caso_tipico}.</p>`
              : ""
          }

          <p class="mt-3 text-sm text-slate-700 leading-relaxed">
            <strong class="text-[#0F3D5E]">Qué resuelve:</strong> ${sol.problema_que_ataca}
          </p>

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

  function renderSolutions() {
    const catalog = window.SOLUTIONS_CATALOG;
    const debilidades = lastDiagnosis ? lastDiagnosis.result.debilidades : null;
    const tipoVivienda = lastDiagnosis ? lastDiagnosis.normalizedInput.tipoVivienda : null;
    const tenencia = lastDiagnosis ? lastDiagnosis.tenencia : "dueno";

    let tabContentHtml = "";

    // --- PESTAÑA 1 y 2: BAJO COSTO / MAYOR IMPACTO ---
    if (activeSolutionTab === "bajo_costo" || activeSolutionTab === "alto_impacto") {
      let list = catalog.soluciones.filter((s) => s.categoria === activeSolutionTab);

      // Filtrar por tipo de vivienda (ej. no recomendar techumbre en depto piso intermedio)
      if (tipoVivienda) {
        list = list.filter((s) => !s.aplica_a || s.aplica_a.includes(tipoVivienda));
      }

      // Filtrar por debilidades detectadas
      if (debilidades && debilidades.length > 0) {
        const matched = list.filter((s) => s.tags.some((t) => debilidades.includes(t)));
        if (matched.length > 0) list = matched;
      }

      // Filtrar para arrendatarios (incluye "si" y "con_permiso", poniendo "si" primero)
      if (filterArrendatarioOnly) {
        list = list.filter((s) => s.apto_arrendatario === "si" || s.apto_arrendatario === "con_permiso");
      }

      // Ordenar según fórmula oficial del catálogo
      list = [...list].sort((a, b) => {
        if (filterArrendatarioOnly && a.apto_arrendatario !== b.apto_arrendatario) {
          return a.apto_arrendatario === "si" ? -1 : 1;
        }
        if (activeSolutionTab === "bajo_costo") {
          const pA = a.impacto_termico_1_10 / ((a.costo.tipico_clp || 10000) / 10000);
          const pB = b.impacto_termico_1_10 / ((b.costo.tipico_clp || 10000) / 10000);
          return pB - pA;
        }
        return b.impacto_termico_1_10 - a.impacto_termico_1_10;
      });

      if (list.length === 0) {
        tabContentHtml = `
          <div class="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-600">
            <p>No hay soluciones en esta categoría con el filtro actual.</p>
            ${
              filterArrendatarioOnly
                ? `<button onclick="window.EnvuelveApp.toggleArrendatarioFilter()" class="mt-3 text-sm font-semibold text-[#D96B27] underline cursor-pointer">Mostrar también soluciones para propietarios</button>`
                : ""
            }
          </div>
        `;
      } else {
        tabContentHtml = `
          <div class="mb-4 p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600">
            <strong>Sobre los precios:</strong> ${catalog.meta.advertencia_precios}
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${list.map((sol, idx) => renderSolutionCard(sol, idx)).join("")}
          </div>
        `;
      }
    }

    // --- PESTAÑA 3: SOLO TIPS ÚTILES Y SENCILLOS ($0) ---
    if (activeSolutionTab === "tips") {
      let tips = [...catalog.tips_costo_cero];

      // Si hay diagnóstico, marcar los más relevantes para esta vivienda y ordenarlos primero
      if (debilidades && debilidades.length > 0) {
        tips.sort((a, b) => {
          const matchA = a.tags.some((t) => debilidades.includes(t)) ? 1 : 0;
          const matchB = b.tags.some((t) => debilidades.includes(t)) ? 1 : 0;
          return matchB - matchA;
        });
      }

      if (tipSeasonFilter !== "todas") {
        tips = tips.filter((t) => t.temporada === tipSeasonFilter || t.temporada === "ambas");
      }

      tabContentHtml = `
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <div>
            <h2 class="font-heading text-lg font-bold text-[#0F3D5E]">Tips útiles y sencillos a costo $0</h2>
            <p class="text-xs sm:text-sm text-slate-600">Hábitos cotidianos sin gasto para mejorar la temperatura de tu vivienda hoy mismo.</p>
          </div>
          <div class="inline-flex bg-slate-100 p-1 rounded-xl gap-1 text-xs font-semibold">
            <button onclick="window.EnvuelveApp.setTipSeason('todas')" class="px-3 py-1.5 rounded-lg cursor-pointer ${tipSeasonFilter === "todas" ? "bg-[#0F3D5E] text-white" : "text-slate-600"}">Todos (${catalog.tips_costo_cero.length})</button>
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
                        ${isRelevant ? `<span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">Recomendado para tu hogar</span>` : ""}
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
    }

    // --- PESTAÑA 4: SUBSIDIOS VIGENTES 2026 (MINVU / SERVIU) ---
    if (activeSolutionTab === "subsidios") {
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
              <strong>Nota para arrendatarios:</strong> Los subsidios de mejoramiento del MINVU exigen ser propietario o asignatario. Te recomendamos revisar la pestaña <strong>Bajo Costo</strong> y <strong>Tips Útiles ($0)</strong>, o compartir tu diagnóstico con el propietario.
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
          <span class="text-xs font-bold uppercase tracking-wider text-[#1E7E5A]">Banco de soluciones, tips y apoyo estatal</span>
          <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E] mt-1">
            ${lastDiagnosis ? "Soluciones, tips y subsidios para tu hogar" : "Soluciones, tips útiles y subsidios MINVU 2026"}
          </h1>
          ${
            lastDiagnosis
              ? `<p class="text-sm sm:text-base text-slate-600 mt-1">Priorizadas según los puntos críticos detectados en tu diagnóstico (Etiqueta estimada <strong>${lastDiagnosis.result.letraEstimada}</strong>).</p>`
              : `<p class="text-sm sm:text-base text-slate-600 mt-1">Explora libremente o <button onclick="window.EnvuelveApp.navigateTo('/encuesta')" class="text-[#D96B27] font-semibold underline cursor-pointer">haz el diagnóstico</button> para personalizar el orden según tu vivienda.</p>`
          }
        </div>

        <!-- Pestañas -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div class="inline-flex flex-wrap bg-white p-1.5 rounded-2xl border border-slate-200 gap-1 w-full sm:w-auto">
            <button onclick="window.EnvuelveApp.setSolutionTab('bajo_costo')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeSolutionTab === "bajo_costo" ? "bg-[#1E7E5A] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Bajo Costo (&lt; $30.000)</button>
            <button onclick="window.EnvuelveApp.setSolutionTab('alto_impacto')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeSolutionTab === "alto_impacto" ? "bg-[#0F3D5E] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Mayor Impacto</button>
            <button onclick="window.EnvuelveApp.setSolutionTab('tips')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeSolutionTab === "tips" ? "bg-[#0F3D5E] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Tips Útiles ($0)</button>
            <button onclick="window.EnvuelveApp.setSolutionTab('subsidios')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeSolutionTab === "subsidios" ? "bg-[#D96B27] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Subsidios 2026</button>
          </div>

          ${
            activeSolutionTab === "bajo_costo" || activeSolutionTab === "alto_impacto"
              ? `
            <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer">
              <input type="checkbox" ${filterArrendatarioOnly ? "checked" : ""} onchange="window.EnvuelveApp.toggleArrendatarioFilter()" class="w-4 h-4 accent-[#0F3D5E]" />
              <span>Solo aptas para arrendatarios</span>
            </label>
          `
              : ""
          }
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
  // VISTA 6: ESTADÍSTICAS (/estadisticas)
  // =========================================================================
  async function renderStats() {
    const main = document.getElementById("app-main");
    main.innerHTML = `<div class="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">Cargando estadísticas de Santiago...</div>`;

    const { source, rows } = await fetchStatsRecords();
    const total = rows.length;

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

    const avgInv = total ? Math.round(sumInv / total) : 0;
    const avgVer = total ? Math.round(sumVer / total) : 0;

    const topDebilidades = Object.entries(debilidadCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const topComunas = Object.entries(comunaCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const tagMap = getTagMap();

    main.innerHTML = `
      <section class="max-w-5xl mx-auto px-4 pt-6 pb-16">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#D96B27]">Panel de monitoreo · Evidencia agregada</span>
            <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E]">Estadísticas — Iniciativa Envuelve tu Casa</h1>
          </div>
          <button onclick="window.EnvuelveApp.exportStatsCSV()" class="px-4 py-2.5 rounded-xl bg-[#0F3D5E] text-white text-sm font-semibold hover:bg-[#0a2c45] cursor-pointer">
            ⬇ Exportar CSV
          </button>
        </div>

        ${
          source === "local"
            ? `
          <div class="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">
            <strong>Modo local activo:</strong> Estás viendo los diagnósticos guardados en este navegador. Para centralizar todos los usuarios en la nube, pega tu URL y anon key de Supabase en <code>supabaseConfig.js</code>.
          </div>
        `
            : `
          <div class="mb-6 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
            ✓ Conectado en tiempo real a Supabase (tabla <code>diagnosticos</code>)
          </div>
        `
        }

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div class="bg-white p-6 rounded-2xl border border-slate-200">
            <p class="text-xs font-bold uppercase text-slate-500">Viviendas diagnosticadas</p>
            <p class="font-heading text-4xl font-extrabold text-[#0F3D5E] mt-1">${total}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200">
            <p class="text-xs font-bold uppercase text-slate-500">Promedio Confort Invierno</p>
            <p class="font-heading text-4xl font-extrabold text-[#D96B27] mt-1">${avgInv}<span class="text-lg text-slate-400">/100</span></p>
          </div>
          <div class="bg-white p-6 rounded-2xl border border-slate-200">
            <p class="text-xs font-bold uppercase text-slate-500">Promedio Protección Verano</p>
            <p class="font-heading text-4xl font-extrabold text-[#1E7E5A] mt-1">${avgVer}<span class="text-lg text-slate-400">/100</span></p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200">
            <h2 class="font-heading font-bold text-lg text-[#0F3D5E] mb-4">Distribución de Etiquetas Estimadas CEV</h2>
            <canvas id="cevChartCanvas" height="220"></canvas>
          </div>

          <div class="lg:col-span-5 space-y-6">
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <h2 class="font-heading font-bold text-lg text-[#0F3D5E] mb-3">Top 3 debilidades más repetidas</h2>
              ${
                topDebilidades.length
                  ? `<ol class="space-y-2.5 text-sm">
                      ${topDebilidades
                        .map(
                          ([tag, count], idx) => `
                        <li class="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50">
                          <span class="font-medium text-slate-800">${idx + 1}. ${(tagMap[tag] && tagMap[tag].etiqueta_usuario) || tag}</span>
                          <span class="font-bold text-[#D96B27] shrink-0">${count} (${Math.round((count / total) * 100)}%)</span>
                        </li>
                      `
                        )
                        .join("")}
                    </ol>`
                  : `<p class="text-sm text-slate-500">Aún no hay registros suficientes.</p>`
              }
            </div>

            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <h2 class="font-heading font-bold text-lg text-[#0F3D5E] mb-3">Comunas con más evaluaciones</h2>
              ${
                topComunas.length
                  ? `<div class="flex flex-wrap gap-2">
                      ${topComunas
                        .map(
                          ([comuna, count]) =>
                            `<span class="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">${comuna}: ${count}</span>`
                        )
                        .join("")}
                    </div>`
                  : `<p class="text-sm text-slate-500">Aún no hay comunas registradas.</p>`
              }
            </div>
          </div>
        </div>
      </section>
    `;

    window.__lastStatsRows = rows;

    const canvas = document.getElementById("cevChartCanvas");
    if (canvas && window.Chart) {
      if (statsChart) statsChart.destroy();
      statsChart = new window.Chart(canvas, {
        type: "bar",
        data: {
          labels: CEV_LEVELS.map((l) => l.letter),
          datasets: [
            {
              label: "Viviendas",
              data: CEV_LEVELS.map((l) => letterCounts[l.letter]),
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
    const rows = window.__lastStatsRows || [];
    if (!rows.length) {
      alert("Todavía no hay registros para exportar.");
      return;
    }
    const headers = [
      "fecha",
      "comuna",
      "tipo_vivienda",
      "antiguedad",
      "letra_estimada",
      "ahorro_estimado_pct",
      "puntaje_invierno",
      "puntaje_verano",
      "debilidades"
    ];
    const csvLines = [headers.join(",")];
    rows.forEach((r) => {
      const safeComuna = String(r.comuna || "").split('"').join('""');
      const vals = [
        r.created_at || "",
        `"${safeComuna}"`,
        r.tipo_vivienda || "",
        r.antiguedad || "",
        r.letra_estimada || "",
        r.ahorro_estimado_pct ?? "",
        r.puntaje_invierno ?? "",
        r.puntaje_verano ?? "",
        `"${(r.debilidades || []).join("; ")}"`
      ];
      csvLines.push(vals.join(","));
    });
    const blob = new Blob([csvLines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estadisticas_iniciativa_envuelve_tu_casa.csv";
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
    const faqGroup = window.QUESTIONS_DATA.assistantFAQ[block.assistantBlockKey];

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
    } else if (route === "/soluciones") {
      main.innerHTML = renderSolutions();
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
    openSolutionsTab(tab) {
      activeSolutionTab = tab;
      navigateTo("/soluciones");
    },
    setAnswer(field, value) {
      answers[field] = value;
      if (field === "tipoVivienda" && (value === "depto_intermedio" || value === "depto_primer_piso")) {
        answers.techo = "adiabatico";
      } else if (field === "tipoVivienda" && answers.techo === "adiabatico") {
        delete answers.techo;
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
    setSolutionTab(tab) {
      activeSolutionTab = tab;
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
  document.addEventListener("DOMContentLoaded", () => {
    initSupabase();
    loadState();
    renderRoute();
  });
})();
