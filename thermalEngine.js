// Motor de Pre-Diagnóstico Térmico "Envuelve tu Casa"
// Basado en parámetros del Manual Técnico CEV (MINVU) - Zona Térmica D (Santiago)

(function (global) {
  const U_VIDRIO = {
    monolitico: { u: 5.8, fs: 0.87 },
    doble_ventana: { u: 3.3, fs: 0.774 },
    dvh_basico: { u: 3.28, fs: 0.774 },
    dvh_alto: { u: 2.85, fs: 0.774 }
  };

  const MARCO_DATA = {
    madera: { u: 2.6, fm: 0.75 },
    pvc: { u: 2.8, fm: 0.8 },
    aluminio_rpt: { u: 3.3, fm: 0.8 },
    aluminio_sin_rpt: { u: 5.8, fm: 0.85 },
    acero: { u: 5.8, fm: 0.85 }
  };

  const FACTOR_CIERRE = {
    fija: 0.85,
    abatir_proyectante: 0.92,
    corredera: 1.15,
    guillotina_antigua: 1.3
  };

  const DEFAULTS_NO_SE = {
    antiguedad: "16_20",
    materialMuro: "ladrillo_sin_aislacion",
    vidrio: "monolitico",
    marco: "aluminio_sin_rpt",
    cierreVentana: "corredera",
    puerta: "madera_entablerada",
    sienteChiflon: false,
    orientacionPrincipal: "oriente",
    tieneAleroOToldo: false,
    nivelSombraEntorno: "parcial"
  };

  function mapAhorroToCEVLetter(ahorroPct) {
    if (ahorroPct > 85) return "A+";
    if (ahorroPct > 70) return "A";
    if (ahorroPct > 55) return "B";
    if (ahorroPct > 40) return "C";
    if (ahorroPct > 20) return "D";
    if (ahorroPct > -10) return "E";
    if (ahorroPct > -35) return "F";
    return "G";
  }

  function normalizeSurveyAnswers(rawAnswers) {
    let estimatedFieldsCount = 0;
    const normalized = {};

    normalized.comuna = rawAnswers.comuna || "Santiago";
    normalized.tipoVivienda = rawAnswers.tipoVivienda || "casa_pareada";

    const esTechoAdiabatico =
      normalized.tipoVivienda === "depto_intermedio" ||
      normalized.tipoVivienda === "depto_primer_piso";

    normalized.techo = esTechoAdiabatico
      ? "adiabatico"
      : (rawAnswers.techo || "aislacion_basica");

    Object.keys(DEFAULTS_NO_SE).forEach((field) => {
      const val = rawAnswers[field];
      if (val === "no_se" || val === undefined || val === null || val === "") {
        normalized[field] = DEFAULTS_NO_SE[field];
        if (val === "no_se") estimatedFieldsCount += 1;
      } else if (field === "sienteChiflon" || field === "tieneAleroOToldo") {
        normalized[field] = val === true || val === "true";
      } else {
        normalized[field] = val;
      }
    });

    return {
      input: normalized,
      estimatedFieldsCount: estimatedFieldsCount
    };
  }

  function calculateThermalDiagnosis(input) {
    const debilidades = new Set();

    const esTechoAdiabatico =
      input.tipoVivienda === "depto_intermedio" ||
      input.tipoVivienda === "depto_primer_piso" ||
      input.techo === "adiabatico";

    let wTecho = 0.35;
    let wMuro = 0.30;
    let wVentana = 0.25;
    let wPuerta = 0.10;

    if (input.tipoVivienda === "casa_pareada") {
      wTecho = 0.38;
      wMuro = 0.24;
      wVentana = 0.28;
      wPuerta = 0.10;
    } else if (input.tipoVivienda === "depto_ultimo_piso") {
      wTecho = 0.40;
      wMuro = 0.22;
      wVentana = 0.30;
      wPuerta = 0.08;
    } else if (esTechoAdiabatico) {
      wTecho = 0;
      wMuro = 0.38;
      wVentana = 0.50;
      wPuerta = 0.12;
    }

    const techoDemandMap = {
      adiabatico: 0,
      sin_aislacion: 1.85,
      aislacion_basica: 1.15,
      aislacion_estandar: 0.85,
      aislacion_alta: 0.38
    };
    const dTecho = esTechoAdiabatico ? 0 : (techoDemandMap[input.techo] ?? 1.15);
    if (!esTechoAdiabatico && (input.techo === "sin_aislacion" || input.techo === "aislacion_basica")) {
      debilidades.add("fuga_techo");
    }

    const muroBaseMap = {
      ladrillo_sin_aislacion: 1.4,
      hormigon_sin_aislacion: 1.5,
      tabique_sin_aislacion: 1.55,
      adobe: 1.18,
      muro_aislacion_interior: 0.72,
      muro_aislacion_exterior: 0.35
    };
    let dMuro = muroBaseMap[input.materialMuro] ?? 1.4;

    const sinAislacionMuro =
      input.materialMuro !== "muro_aislacion_interior" &&
      input.materialMuro !== "muro_aislacion_exterior";

    if (sinAislacionMuro) {
      debilidades.add("muro_sin_aislacion");
      if (input.antiguedad === "16_20") dMuro += 0.1;
      if (input.antiguedad === "21_mas") dMuro += 0.18;
    } else if (input.materialMuro === "muro_aislacion_interior") {
      debilidades.add("puente_termico_muro");
    }

    const vidrioInfo = U_VIDRIO[input.vidrio] || U_VIDRIO.monolitico;
    const marcoInfo = MARCO_DATA[input.marco] || MARCO_DATA.aluminio_sin_rpt;
    const uVentana = Number((marcoInfo.fm * vidrioInfo.u + (1 - marcoInfo.fm) * marcoInfo.u).toFixed(2));
    const factorCierre = FACTOR_CIERRE[input.cierreVentana] || 1.15;
    const factorInfiltracion = factorCierre * (input.sienteChiflon ? 1.15 : 1.0);
    const dVentana = (uVentana / 4.8) * factorInfiltracion;

    if (input.vidrio === "monolitico") debilidades.add("vidrio_simple");
    if (input.marco === "aluminio_sin_rpt" || input.marco === "acero") {
      debilidades.add("marco_metalico_frio");
    }
    if (
      input.cierreVentana === "corredera" ||
      input.cierreVentana === "guillotina_antigua" ||
      input.sienteChiflon
    ) {
      debilidades.add("infiltracion_ventanas");
    }

    const uPuertaMap = {
      madera_solida: 1.7,
      madera_entablerada: 2.63,
      con_vidrio_parcial: 3.55,
      metal_o_vidrio_total: 4.8
    };
    const uPuerta = uPuertaMap[input.puerta] ?? 2.63;
    const dPuerta = (uPuerta / 2.4) * (input.sienteChiflon ? 1.3 : 0.9);
    if (input.sienteChiflon || input.puerta !== "madera_solida") {
      debilidades.add("infiltracion_puerta");
    }

    let fInvierno = 1.0;
    let fVerano = 1.0;

    if (input.orientacionPrincipal === "norte") {
      fInvierno = input.nivelSombraEntorno === "muy_sombreado" ? 1.02 : 0.88;
      fVerano = input.tieneAleroOToldo ? 0.92 : 1.05;
    } else if (input.orientacionPrincipal === "poniente") {
      fInvierno = 1.0;
      const sobrecargaSolar = vidrioInfo.fs > 0.8 ? 1.35 : 1.2;
      fVerano =
        input.nivelSombraEntorno === "despejado" && !input.tieneAleroOToldo
          ? sobrecargaSolar
          : 1.08;
      if (fVerano >= 1.2) {
        debilidades.add("sobrecalentamiento_poniente");
        debilidades.add("falta_sombra_solar");
      }
    } else if (input.orientacionPrincipal === "sur") {
      fInvierno = input.nivelSombraEntorno === "muy_sombreado" ? 1.25 : 1.15;
      fVerano = 0.82;
      debilidades.add("frio_orientacion_sur");
    } else {
      fInvierno = 0.96;
      fVerano = input.nivelSombraEntorno === "despejado" ? 1.06 : 0.96;
    }

    const demandaBase =
      wTecho * dTecho + wMuro * dMuro + wVentana * dVentana + wPuerta * dPuerta;

    const demandaInvierno = demandaBase * fInvierno;
    const demandaVerano = demandaBase * fVerano;
    const demandaGlobal = 0.65 * demandaInvierno + 0.35 * demandaVerano;

    const ahorroEstimadoPct = Math.max(-75, Math.min(95, Math.round((1 - demandaGlobal) * 100)));
    const letraEstimada = mapAhorroToCEVLetter(ahorroEstimadoPct);

    const toScore100 = (demanda) =>
      Math.max(10, Math.min(98, Math.round(100 - (demanda - 0.25) * 58)));

    const puntajeInvierno = toScore100(demandaInvierno);
    const puntajeVerano = toScore100(demandaVerano);

    const resumenEjecutivo =
      ahorroEstimadoPct < -10
        ? "Tu vivienda presenta pérdidas térmicas importantes respecto al estándar base de Santiago. Priorizar sellos de infiltración y control en techo/ventanas generará un cambio inmediato."
        : ahorroEstimadoPct < 40
        ? "Tu vivienda tiene un desempeño térmico intermedio. Con medidas focalizadas de bajo costo y gestión solar puedes mejorar notoriamente tu confort en invierno y verano."
        : "Tu vivienda cuenta con una envolvente sólida para la Zona Térmica D (Santiago). Puedes optimizar pequeños detalles para reducir aún más tus cuentas de energía.";

    return {
      letraEstimada,
      ahorroEstimadoPct,
      puntajeInvierno,
      puntajeVerano,
      uVentanaEstimado: uVentana,
      desgloseComponentes: {
        techo: esTechoAdiabatico ? null : toScore100(dTecho),
        muros: toScore100(dMuro),
        ventanas: toScore100(dVentana),
        puertas: toScore100(dPuerta)
      },
      debilidades: Array.from(debilidades),
      resumenEjecutivo
    };
  }

  global.ThermalEngine = {
    normalizeSurveyAnswers,
    calculateThermalDiagnosis,
    mapAhorroToCEVLetter
  };
})(window);
