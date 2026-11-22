// Aplicación principal "Envuelve tu Casa"
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
  let activeSolutionTab = "mayor_impacto";
  let filterArrendatarioOnly = false;

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
    // Siempre guarda copia local para demo/offline
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
            Servicio ciudadano 100% gratuito · Santiago (Zona Térmica D)
          </div>

          <h1 class="font-heading text-3xl sm:text-5xl font-extrabold text-[#0F3D5E] leading-tight tracking-tight max-w-3xl">
            Descubre cuánto frío o calor deja entrar tu casa, en 3 minutos.
          </h1>

          <p class="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Diagnóstico térmico gratuito para <strong>casas y departamentos de Santiago</strong>. Recibe recomendaciones claras, alternativas de bajo costo y orientación para acceder a subsidios estatales.
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
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Sobre tus muros, ventanas, techo y sol. Cada pregunta incluye trucos caseros y un asistente guiado si tienes dudas.</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <div class="w-10 h-10 rounded-xl bg-[#D96B27]/15 text-[#D96B27] font-heading font-bold flex items-center justify-center text-lg mb-4">2</div>
              <h3 class="font-heading font-bold text-lg text-[#0F3D5E]">Obtén tu perfil térmico</h3>
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Calculamos tu etiqueta estimada (A+ a G) y tu desempeño separado para invierno y verano según parámetros del Manual CEV.</p>
            </div>
            <div class="bg-white p-6 rounded-2xl border border-slate-200">
              <div class="w-10 h-10 rounded-xl bg-[#1E7E5A]/15 text-[#1E7E5A] font-heading font-bold flex items-center justify-center text-lg mb-4">3</div>
              <h3 class="font-heading font-bold text-lg text-[#0F3D5E]">Accede a soluciones reales</h3>
              <p class="mt-2 text-slate-600 text-sm leading-relaxed">Recibe un banco de medidas ordenadas por impacto, soluciones bajo $30.000 CLP y guía para el Subsidio DS 27 del MINVU.</p>
            </div>
          </div>
        </div>

        <!-- Respaldo institucional -->
        <div class="mt-10 bg-[#0F3D5E] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div>
            <p class="text-xs uppercase tracking-wider text-sky-200 font-semibold">Innovación tecnológica con sentido social</p>
            <h3 class="font-heading text-xl font-bold mt-1">Alineado con la Estrategia Nacional de Calor y Frío</h3>
            <p class="mt-2 text-sm text-sky-100 max-w-2xl leading-relaxed">
              Metodología referencial basada en los parámetros técnicos del <strong>Manual de Calificación Energética de Viviendas (CEV - MINVU)</strong> para la Región Metropolitana. Privacidad garantizada: solo registramos datos técnicos anónimos por comuna.
            </p>
          </div>
          <button onclick="window.EnvuelveApp.navigateTo('/soluciones')" class="shrink-0 px-5 py-3 rounded-xl bg-white text-[#0F3D5E] font-semibold text-sm hover:bg-sky-50 transition cursor-pointer">
            Explorar tips y subsidios
          </button>
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

    // Configurar pestaña inicial de soluciones según presupuesto y tenencia
    filterArrendatarioOnly = lastDiagnosis.tenencia === "arrendatario";
    if (lastDiagnosis.presupuesto === "bajo" || lastDiagnosis.tenencia === "arrendatario") {
      activeSolutionTab = "bajo_costo";
    } else {
      activeSolutionTab = "mayor_impacto";
    }

    saveState();

    // Guardar de forma asíncrona sin bloquear la vista
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
            <p class="mt-2 text-slate-600">Responde la encuesta de 3 minutos para conocer el nivel de aislación térmica de tu vivienda.</p>
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

    const whatsappText = encodeURIComponent(
      `🏠 Diagnóstico Térmico "Envuelve tu Casa" (${normalizedInput.comuna}):
` +
      `• Etiqueta estimada CEV: ${result.letraEstimada} (${result.ahorroEstimadoPct >= 0 ? "+" : ""}${result.ahorroEstimadoPct}% vs estándar base)
` +
      `• Confort Invierno: ${result.puntajeInvierno}/100 | Protección Verano: ${result.puntajeVerano}/100
` +
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
        </div>

        <!-- Aviso legal/metodológico -->
        <div class="mt-6 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>Transparencia metodológica:</strong> Pre-diagnóstico orientativo basado en parámetros del <em>Manual Técnico de Calificación Energética de Viviendas (CEV - MINVU)</em> para Zona Térmica D (Santiago). No reemplaza una certificación oficial realizada por un Evaluador Energético acreditado.
        </div>

        <!-- Acciones -->
        <div class="mt-7 flex flex-col sm:flex-row gap-3 no-print">
          <button onclick="window.EnvuelveApp.navigateTo('/soluciones')" class="flex-1 px-7 py-4 rounded-xl bg-[#D96B27] hover:bg-[#bf5a1d] text-white font-bold text-base shadow-md transition cursor-pointer">
            Ver soluciones recomendadas para mi casa →
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
  // VISTA 4: SOLUCIONES Y TIPS (/soluciones)
  // =========================================================================
  function renderSolutions() {
    const catalog = window.SOLUTIONS_CATALOG;
    const debilidades = lastDiagnosis ? lastDiagnosis.result.debilidades : null;
    const tenencia = lastDiagnosis ? lastDiagnosis.tenencia : "dueno";

    // Filtrar por debilidades detectadas (o mostrar todo si entra directo sin encuesta)
    let matchedSolutions = catalog.solutions;
    if (debilidades && debilidades.length > 0) {
      matchedSolutions = catalog.solutions.filter((s) =>
        s.tags.some((t) => debilidades.includes(t))
      );
      if (matchedSolutions.length === 0) matchedSolutions = catalog.solutions;
    }

    if (filterArrendatarioOnly && activeSolutionTab !== "subsidios") {
      matchedSolutions = matchedSolutions.filter((s) => s.aptaArrendatario);
    }

    const tabSolutions = matchedSolutions.filter((s) => s.categoria === activeSolutionTab);

    let tabContentHtml = "";
    if (activeSolutionTab === "subsidios") {
      const sub = catalog.subsidioDS27;
      tabContentHtml = `
        <div class="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div class="inline-block px-3 py-1 rounded-full bg-emerald-50 text-[#1E7E5A] text-xs font-bold mb-3">
            Financiamiento Estatal · MINVU
          </div>
          <h2 class="font-heading text-2xl font-bold text-[#0F3D5E]">${sub.titulo}</h2>
          <p class="text-slate-600 mt-2 leading-relaxed">${sub.descripcion}</p>

          ${
            tenencia === "arrendatario"
              ? `<div class="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm">${sub.notaArrendatarios}</div>`
              : ""
          }

          <h3 class="font-heading font-bold text-[#0F3D5E] mt-6 mb-3">Requisitos principales referenciales:</h3>
          <ul class="space-y-2 text-sm sm:text-base text-slate-700">
            ${sub.requisitos.map((r) => `<li class="flex items-start gap-2"><span class="text-[#1E7E5A] font-bold">✓</span><span>${r}</span></li>`).join("")}
          </ul>

          <div class="mt-6">
            <a href="${sub.urlOficial}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F3D5E] hover:bg-[#0a2c45] text-white font-semibold text-sm sm:text-base transition">
              Ir al portal oficial del MINVU ↗
            </a>
          </div>
        </div>
      `;
    } else if (tabSolutions.length === 0) {
      tabContentHtml = `
        <div class="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-600">
          <p>No hay soluciones en esta categoría con el filtro actual.</p>
          ${
            filterArrendatarioOnly
              ? `<button onclick="window.EnvuelveApp.toggleArrendatarioFilter()" class="mt-3 text-sm font-semibold text-[#D96B27] underline cursor-pointer">Ver también soluciones con obra (para propietarios)</button>`
              : ""
          }
        </div>
      `;
    } else {
      tabContentHtml = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${tabSolutions
            .map(
              (sol) => `
            <article class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div class="flex flex-wrap items-center gap-2 mb-3">
                  <span class="text-xs font-bold px-2.5 py-1 rounded-full ${
                    sol.categoria === "bajo_costo"
                      ? "bg-emerald-50 text-[#1E7E5A]"
                      : "bg-sky-50 text-[#0F3D5E]"
                  }">Impacto: ${sol.impacto}</span>
                  <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">${sol.costoCLP}</span>
                  ${
                    sol.aptaArrendatario
                      ? `<span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800">Sin obras / Arrendatarios</span>`
                      : ""
                  }
                </div>
                <h3 class="font-heading text-lg font-bold text-[#0F3D5E]">${sol.nombre}</h3>
                <p class="mt-2 text-sm text-slate-600 leading-relaxed">${sol.descripcion}</p>
              </div>
              <div class="mt-4 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-700 bg-slate-50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-2xl">
                <strong class="text-[#0F3D5E]">Tip práctico:</strong> ${sol.tip}
              </div>
            </article>
          `
            )
            .join("")}
        </div>
      `;
    }

    const tipsHtml = catalog.tipsCostoCero
      .map(
        (tip, i) => `
        <div class="bg-white rounded-2xl border border-slate-200 p-5">
          <div class="flex items-start gap-3">
            <span class="w-7 h-7 shrink-0 rounded-full bg-[#1E7E5A] text-white text-xs font-bold flex items-center justify-center mt-0.5">${i + 1}</span>
            <div>
              <h4 class="font-heading font-bold text-[#0F3D5E] text-base">${tip.titulo}</h4>
              <p class="text-sm text-slate-600 mt-1 leading-relaxed">${tip.texto}</p>
            </div>
          </div>
        </div>
      `
      )
      .join("");

    return `
      <section class="max-w-5xl mx-auto px-4 pt-6 pb-16">
        <div class="mb-6">
          <span class="text-xs font-bold uppercase tracking-wider text-[#1E7E5A]">Banco de soluciones priorizadas</span>
          <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E] mt-1">
            ${lastDiagnosis ? "Soluciones recomendadas para tu vivienda" : "Soluciones y tips de confort térmico"}
          </h1>
          ${
            lastDiagnosis
              ? `<p class="text-sm sm:text-base text-slate-600 mt-1">Filtradas según los puntos críticos detectados en tu diagnóstico (Etiqueta estimada <strong>${lastDiagnosis.result.letraEstimada}</strong>).</p>`
              : `<p class="text-sm sm:text-base text-slate-600 mt-1">Explora medidas generales o <button onclick="window.EnvuelveApp.navigateTo('/encuesta')" class="text-[#D96B27] font-semibold underline cursor-pointer">haz el diagnóstico</button> para personalizarlas a tu casa.</p>`
          }
        </div>

        <!-- Pestañas -->
        <div class="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div class="inline-flex bg-white p-1.5 rounded-2xl border border-slate-200 gap-1 w-full sm:w-auto overflow-x-auto">
            <button onclick="window.EnvuelveApp.setSolutionTab('mayor_impacto')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeSolutionTab === "mayor_impacto" ? "bg-[#0F3D5E] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Mayor Impacto</button>
            <button onclick="window.EnvuelveApp.setSolutionTab('bajo_costo')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeSolutionTab === "bajo_costo" ? "bg-[#1E7E5A] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Bajo Costo (&lt; $30.000)</button>
            <button onclick="window.EnvuelveApp.setSolutionTab('subsidios')" class="flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeSolutionTab === "subsidios" ? "bg-[#D96B27] text-white" : "text-slate-600 hover:bg-slate-100"
            }">Subsidios DS 27</button>
          </div>

          ${
            activeSolutionTab !== "subsidios"
              ? `
            <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-white px-4 py-2.5 rounded-xl border border-slate-200 cursor-pointer">
              <input type="checkbox" ${filterArrendatarioOnly ? "checked" : ""} onchange="window.EnvuelveApp.toggleArrendatarioFilter()" class="w-4 h-4 accent-[#0F3D5E]" />
              <span>Solo soluciones sin obras (arrendatarios)</span>
            </label>
          `
              : ""
          }
        </div>

        ${tabContentHtml}

        <!-- Sección Tips Costo $0 -->
        <div class="mt-12">
          <h2 class="font-heading text-2xl font-bold text-[#0F3D5E]">Tips diarios a costo $0</h2>
          <p class="text-sm text-slate-600 mt-1 mb-4">Hábitos simples que mejoran la temperatura de tu hogar desde hoy sin gastar dinero.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            ${tipsHtml}
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // VISTA 5: ESTADÍSTICAS (/estadisticas)
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

    const labelsMap = window.SOLUTIONS_CATALOG.weaknessLabels;

    main.innerHTML = `
      <section class="max-w-5xl mx-auto px-4 pt-6 pb-16">
        <div class="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-[#D96B27]">Panel de monitoreo · Evidencia agregada</span>
            <h1 class="font-heading text-2xl sm:text-3xl font-extrabold text-[#0F3D5E]">Estadísticas de Viviendas en Santiago</h1>
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
                          <span class="font-medium text-slate-800">${idx + 1}. ${labelsMap[tag] || tag}</span>
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

    // Guardar filas temporalmente para exportar CSV
    window.__lastStatsRows = rows;

    // Renderizar gráfico con Chart.js
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
      const vals = [
        r.created_at || "",
        `"${(r.comuna || "").replace(/"/g, '""')}"`,
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
    const blob = new Blob([csvLines.join("
")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "estadisticas_envuelve_tu_casa.csv";
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
                <p class="font-heading font-bold text-sm">Asistente Envuelve tu Casa</p>
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
