// Motor de Pre-Diagnóstico Térmico "Iniciativa Envuelve tu Casa" v2.1
// Basado referencialmente en parámetros del Manual Técnico CEV (MINVU) - Zona Térmica D (Santiago)
// Soporta múltiples orientaciones de fachada y detección de ventilación cruzada

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
    abatir_proyectante: 0.9,
    corredera: 1.12,
    guillotina_antigua: 1.28
  };

  // Factor de compacidad / superficie expuesta (distingue casa aislada, pareada y continua)
  const FACTOR_COMPACIDAD = {
    casa_aislada: 1.06,
    casa_pareada: 0.98,
    casa_continua: 0.91,
    depto_ultimo_piso: 0.94,
    depto_primer_piso: 0.9,
    depto_intermedio: 0.82
  };

  // Comunas RM con sectores sobre 2.000 MSNM (Zona Térmica H según Anexo F Manual CEV)
  const COMUNAS_PRECORDILLERA_ZONA_H = ["Lo Barnechea", "Colina", "San José de Maipo"];
  const VALID_ORIENTATIONS = ["norte", "oriente", "poniente", "sur"];

  // Supuestos conservadores de referencia cuando el usuario marca "No sé"
  const DEFAULTS_NO_SE = {
    antiguedad: "16_20",
    materialMuro: "ladrillo_sin_aislacion",
    piso: "piso_sobre_terreno",
    vidrio: "monolitico",
    marco: "aluminio_sin_rpt",
    cierreVentana: "corredera",
    puerta: "madera_entablerada",
    sienteChiflon: false,
    humedadCondensacion: false,
    orientacionPrincipal: ["oriente"],
    tieneAleroOToldo: "ninguno",
    nivelSombraEntorno: "parcial"
  };

  const LETTERS_ORDER = ["A+", "A", "B", "C", "D", "E", "F", "G"];

  function mapAhorroToCEVLetter(indicePct) {
    if (indicePct > 85) return "A+";
    if (indicePct > 70) return "A";
    if (indicePct > 55) return "B";
    if (indicePct > 40) return "C";
    if (indicePct > 20) return "D";
    if (indicePct > -10) return "E";
    if (indicePct > -35) return "F";
    return "G";
  }

  function normalizeAleroValue(rawVal) {
    if (rawVal === "completo" || rawVal === "parcial" || rawVal === "ninguno") return rawVal;
    if (rawVal === true || rawVal === "true") return "completo";
    if (rawVal === false || rawVal === "false") return "ninguno";
    return "ninguno";
  }

  // Normaliza orientaciones tanto desde array (multiselección) como desde string antiguo (compatibilidad)
  function normalizeOrientaciones(rawVal) {
    let arr = [];
    if (Array.isArray(rawVal)) {
      arr = rawVal;
    } else if (typeof rawVal === "string" && rawVal.trim() !== "") {
      arr = rawVal.split(",").map((s) => s.trim());
    }

    const explicitlyUnknown = arr.includes("no_se");
    const valid = [];
    arr.forEach((v) => {
      if (VALID_ORIENTATIONS.includes(v) && !valid.includes(v)) {
        valid.push(v);
      }
    });

    if (valid.length === 0) {
      return { orientaciones: ["oriente"], wasEstimated: explicitlyUnknown };
    }
    return { orientaciones: valid, wasEstimated: false };
  }

  function hasCrossVentilation(orientaciones) {
    const hasNS = orientaciones.includes("norte") && orientaciones.includes("sur");
    const hasEO = orientaciones.includes("oriente") && orientaciones.includes("poniente");
    return hasNS || hasEO;
  }

  function normalizeSurveyAnswers(rawAnswers) {
    const estimatedFields = [];
    const normalized = {};

    normalized.comuna = rawAnswers.comuna || "Santiago";
    normalized.tipoVivienda = rawAnswers.tipoVivienda || "casa_pareada";

    const esTechoAdiabatico =
      normalized.tipoVivienda === "depto_intermedio" ||
      normalized.tipoVivienda === "depto_primer_piso";

    const esPisoAdiabatico =
      normalized.tipoVivienda === "depto_intermedio" ||
      normalized.tipoVivienda === "depto_ultimo_piso";

    if (esTechoAdiabatico) {
      normalized.techo = "adiabatico";
    } else {
      normalized.techo = rawAnswers.techo || "aislacion_basica";
    }

    if (esPisoAdiabatico) {
      normalized.piso = "adiabatico";
    } else if (rawAnswers.piso === "no_se" || !rawAnswers.piso) {
      normalized.piso = DEFAULTS_NO_SE.piso;
      if (rawAnswers.piso === "no_se") estimatedFields.push("piso");
    } else {
      normalized.piso = rawAnswers.piso;
    }

    // Orientaciones múltiples (Pregunta 13)
    const oriNorm = normalizeOrientaciones(rawAnswers.orientacionPrincipal);
    normalized.orientaciones = oriNorm.orientaciones;
    normalized.orientacionPrincipal =
      oriNorm.orientaciones.length === 1
        ? oriNorm.orientaciones[0]
        : oriNorm.orientaciones.join(",");
    if (oriNorm.wasEstimated) {
      estimatedFields.push("orientacionPrincipal");
    }

    Object.keys(DEFAULTS_NO_SE).forEach((field) => {
      if (field === "piso" || field === "orientacionPrincipal") return;
      const val = rawAnswers[field];
      if (val === "no_se" || val === undefined || val === null || val === "") {
        normalized[field] = DEFAULTS_NO_SE[field];
        if (val === "no_se") estimatedFields.push(field);
      } else if (field === "sienteChiflon" || field === "humedadCondensacion") {
        normalized[field] = val === true || val === "true";
      } else if (field === "tieneAleroOToldo") {
        normalized[field] = normalizeAleroValue(val);
      } else {
        normalized[field] = val;
      }
    });

    // Campos de perfil (no afectan puntaje de envolvente, sí filtran soluciones)
    normalized.calefaccionActual = rawAnswers.calefaccionActual || "estufa_electrica_gas_parafina";
    normalized.tenencia = rawAnswers.tenencia || "dueno";
    normalized.presupuesto = rawAnswers.presupuesto || "bajo";

    return {
      input: normalized,
      estimatedFieldsCount: estimatedFields.length,
      estimatedFields: estimatedFields
    };
  }

  function calculateThermalDiagnosis(input, estimatedFieldsCount) {
    const estCount = typeof estimatedFieldsCount === "number" ? estimatedFieldsCount : 0;
    const debilidades = new Set();

    const tv = input.tipoVivienda;
    const esTechoAdiabatico =
      tv === "depto_intermedio" || tv === "depto_primer_piso" || input.techo === "adiabatico";
    const esPisoAdiabatico =
      tv === "depto_intermedio" || tv === "depto_ultimo_piso" || input.piso === "adiabatico";

    // Pesos dinámicos por elemento de la envolvente (suman 1.00 en cada tipología)
    let wTecho = 0.32;
    let wMuro = 0.28;
    let wVentana = 0.22;
    let wPuerta = 0.08;
    let wPiso = 0.10;

    if (tv === "casa_pareada") {
      wTecho = 0.34;
      wMuro = 0.22;
      wVentana = 0.25;
      wPuerta = 0.09;
      wPiso = 0.10;
    } else if (tv === "casa_continua") {
      wTecho = 0.36;
      wMuro = 0.18;
      wVentana = 0.27;
      wPuerta = 0.09;
      wPiso = 0.10;
    } else if (tv === "depto_ultimo_piso") {
      wTecho = 0.40;
      wMuro = 0.22;
      wVentana = 0.30;
      wPuerta = 0.08;
      wPiso = 0.0;
    } else if (tv === "depto_primer_piso") {
      wTecho = 0.0;
      wMuro = 0.30;
      wVentana = 0.42;
      wPuerta = 0.10;
      wPiso = 0.18;
    } else if (tv === "depto_intermedio") {
      wTecho = 0.0;
      wMuro = 0.38;
      wVentana = 0.50;
      wPuerta = 0.12;
      wPiso = 0.0;
    }

    // 1. Techo
    const techoDemandMap = {
      adiabatico: 0,
      sin_aislacion: 1.85,
      aislacion_basica: 1.25,
      aislacion_estandar: 0.95,
      aislacion_alta: 0.35
    };
    const dTecho = esTechoAdiabatico ? 0 : (techoDemandMap[input.techo] ?? 1.25);
    if (!esTechoAdiabatico && (input.techo === "sin_aislacion" || input.techo === "aislacion_basica")) {
      debilidades.add("fuga_techo");
    }

    // 2. Piso / contacto inferior
    const pisoDemandMap = {
      adiabatico: 0,
      piso_ventilado_estacionamiento: 1.6,
      piso_sobre_terreno: 1.15,
      piso_aislado: 0.45
    };
    const dPiso = esPisoAdiabatico ? 0 : (pisoDemandMap[input.piso] ?? 1.15);
    if (!esPisoAdiabatico && (input.piso === "piso_ventilado_estacionamiento" || input.piso === "piso_sobre_terreno")) {
      debilidades.add("fuga_piso");
    }

    // 3. Muros (Tabla 3 Manual CEV: deterioro por antigüedad en ladrillo y adobe)
    const muroBaseMap = {
      ladrillo_sin_aislacion: 1.35,
      hormigon_sin_aislacion: 1.48,
      tabique_sin_aislacion: 1.5,
      adobe: 1.15,
      muro_aislacion_interior: 0.82,
      muro_aislacion_exterior: 0.3
    };
    let dMuro = muroBaseMap[input.materialMuro] ?? 1.35;

    if (input.materialMuro === "ladrillo_sin_aislacion" || input.materialMuro === "adobe") {
      if (input.antiguedad === "11_15") dMuro += 0.04;
      if (input.antiguedad === "16_20") dMuro += 0.1;
      if (input.antiguedad === "21_mas") dMuro += 0.16;
    }

    const sinAislacionMuro =
      input.materialMuro !== "muro_aislacion_interior" &&
      input.materialMuro !== "muro_aislacion_exterior";

    if (sinAislacionMuro) {
      debilidades.add("muro_sin_aislacion");
    } else if (input.materialMuro === "muro_aislacion_interior") {
      debilidades.add("puente_termico_muro");
    }

    // 4. Ventanas (Tablas 4, 5 y 6 Manual CEV)
    const vidrioInfo = U_VIDRIO[input.vidrio] || U_VIDRIO.monolitico;
    const marcoInfo = MARCO_DATA[input.marco] || MARCO_DATA.aluminio_sin_rpt;
    const uVentana = Number((marcoInfo.fm * vidrioInfo.u + (1 - marcoInfo.fm) * marcoInfo.u).toFixed(2));
    const factorCierre = FACTOR_CIERRE[input.cierreVentana] || 1.12;
    const factorInfiltracion = factorCierre * (input.sienteChiflon ? 1.16 : 1.0);
    const dVentana = (uVentana / 6.0) * factorInfiltracion;

    if (input.vidrio === "monolitico") debilidades.add("vidrio_simple");
    if (input.marco === "aluminio_sin_rpt" || input.marco === "acero") {
      debilidades.add("marco_metalico_frio");
    }

    if (input.sienteChiflon) {
      debilidades.add("infiltracion_ventanas");
    } else if (input.cierreVentana === "corredera" || input.cierreVentana === "guillotina_antigua") {
      debilidades.add("riesgo_infiltracion_ventanas");
    }

    // 5. Puertas
    const uPuertaMap = {
      madera_solida: 1.7,
      madera_entablerada: 2.63,
      con_vidrio_parcial: 3.55,
      metal_o_vidrio_total: 4.8
    };
    const uPuerta = uPuertaMap[input.puerta] ?? 2.63;
    const dPuerta = (uPuerta / 2.8) * (input.sienteChiflon ? 1.3 : 0.85);

    if (input.sienteChiflon) {
      debilidades.add("infiltracion_puerta");
    }
    if (input.puerta !== "madera_solida") {
      debilidades.add("puerta_poco_aislada");
    }

    // 6. Humedad / condensación confirmada
    if (input.humedadCondensacion === true) {
      debilidades.add("humedad_condensacion");
    }

    // 7. Modulador Bioclimático Santiago (promedia todas las orientaciones marcadas + ventilación cruzada)
    const alero = normalizeAleroValue(input.tieneAleroOToldo);
    const orientaciones = Array.isArray(input.orientaciones) && input.orientaciones.length > 0
      ? input.orientaciones
      : normalizeOrientaciones(input.orientacionPrincipal).orientaciones;

    let sumFInv = 0;
    let sumFVer = 0;

    orientaciones.forEach((ori) => {
      let fI = 1.0;
      let fV = 1.0;

      if (ori === "norte") {
        fI = input.nivelSombraEntorno === "muy_sombreado" ? 1.02 : 0.86;
        if (alero === "completo") {
          fV = 0.88;
        } else if (alero === "parcial") {
          fV = 0.97;
        } else {
          fV = 1.05;
          if (input.nivelSombraEntorno === "despejado") {
            debilidades.add("falta_sombra_solar");
          }
        }
      } else if (ori === "poniente") {
        fI = 1.0;
        if (alero === "completo") {
          fV = input.nivelSombraEntorno === "despejado" ? 1.02 : 0.95;
          if (input.nivelSombraEntorno === "despejado") {
            debilidades.add("sobrecalentamiento_poniente");
          }
        } else if (alero === "parcial") {
          const sobrecargaParcial = vidrioInfo.fs > 0.8 ? 1.26 : 1.15;
          fV =
            input.nivelSombraEntorno === "despejado"
              ? sobrecargaParcial
              : input.nivelSombraEntorno === "parcial"
              ? sobrecargaParcial - 0.08
              : 0.98;
          if (input.nivelSombraEntorno !== "muy_sombreado") {
            debilidades.add("sobrecalentamiento_poniente");
            debilidades.add("falta_sombra_solar");
          }
        } else {
          const sobrecargaBase = vidrioInfo.fs > 0.8 ? 1.38 : 1.22;
          fV =
            input.nivelSombraEntorno === "despejado"
              ? sobrecargaBase
              : input.nivelSombraEntorno === "parcial"
              ? sobrecargaBase - 0.1
              : 1.02;
          if (input.nivelSombraEntorno !== "muy_sombreado") {
            debilidades.add("sobrecalentamiento_poniente");
            debilidades.add("falta_sombra_solar");
          }
        }
      } else if (ori === "sur") {
        fI = input.nivelSombraEntorno === "muy_sombreado" ? 1.24 : 1.14;
        fV = 0.82;
        debilidades.add("frio_orientacion_sur");
      } else {
        // Oriente
        fI = 0.96;
        fV = input.nivelSombraEntorno === "despejado" && alero === "ninguno" ? 1.06 : 0.95;
      }

      sumFInv += fI;
      sumFVer += fV;
    });

    const fInvierno = sumFInv / orientaciones.length;
    const tieneVentilacionCruzada = hasCrossVentilation(orientaciones);
    // En Santiago (noches frescas de verano), tener fachadas opuestas facilita refrescar por ventilación cruzada (-6% demanda estival)
    const fVerano = (sumFVer / orientaciones.length) * (tieneVentilacionCruzada ? 0.94 : 1.0);

    // 8. Índice orientativo de desempeño (modelo simplificado 65% invierno / 35% verano)
    const compacidad = FACTOR_COMPACIDAD[tv] || 1.0;
    const demandaBase =
      (wTecho * dTecho + wPiso * dPiso + wMuro * dMuro + wVentana * dVentana + wPuerta * dPuerta) *
      compacidad;

    const demandaInvierno = demandaBase * fInvierno;
    const demandaVerano = demandaBase * fVerano;
    const demandaGlobal = 0.65 * demandaInvierno + 0.35 * demandaVerano;

    const ahorroEstimadoPct = Math.max(-75, Math.min(90, Math.round((1 - demandaGlobal) * 100)));
    const letraEstimada = mapAhorroToCEVLetter(ahorroEstimadoPct);

    const toScore100 = (demanda) =>
      Math.max(10, Math.min(98, Math.round(100 - (demanda - 0.25) * 58)));

    const puntajeInvierno = toScore100(demandaInvierno);
    const puntajeVerano = toScore100(demandaVerano);

    let nivelCerteza = "alta";
    let rangoLetras = null;
    if (estCount >= 4) {
      nivelCerteza = "baja";
      const pos = LETTERS_ORDER.indexOf(letraEstimada);
      const mejor = LETTERS_ORDER[Math.max(1, pos - 1)];
      const peor = LETTERS_ORDER[Math.min(LETTERS_ORDER.length - 1, pos + 1)];
      rangoLetras = `${mejor} – ${peor}`;
    } else if (estCount >= 1) {
      nivelCerteza = "media";
    }

    const esComunaPrecordillera = COMUNAS_PRECORDILLERA_ZONA_H.includes(input.comuna);

    const resumenEjecutivo =
      nivelCerteza === "baja"
        ? "Respondiste 'No sé' en varios puntos clave de tu envolvente. Este resultado es una aproximación preliminar con rango de incertidumbre: te sugerimos verificar esos datos básicos antes de invertir en obras mayores."
        : ahorroEstimadoPct < -10
        ? "Tu vivienda presenta pérdidas térmicas importantes respecto a la referencia base de Santiago. Atacar primero los puntos con menor puntaje generará la mayor mejora de confort."
        : ahorroEstimadoPct < 40
        ? "Tu vivienda tiene un desempeño térmico intermedio. Con medidas focalizadas en los puntos críticos detectados puedes mejorar notoriamente el confort en invierno y verano."
        : "Tu vivienda cuenta con una envolvente sólida para la Zona Térmica D (Santiago). Ya tienes resueltos los puntos más costosos; solo conviene revisar detalles puntuales.";

    return {
      letraEstimada,
      rangoLetras,
      nivelCerteza,
      esComunaPrecordillera,
      tieneVentilacionCruzada,
      orientacionesEvaluadas: orientaciones,
      ahorroEstimadoPct,
      puntajeInvierno,
      puntajeVerano,
      uVentanaEstimado: uVentana,
      desgloseComponentes: {
        techo: esTechoAdiabatico ? null : toScore100(dTecho),
        piso: esPisoAdiabatico ? null : toScore100(dPiso),
        muros: toScore100(dMuro),
        ventanas: toScore100(dVentana),
        puertas: toScore100(dPuerta)
      },
      pesosComponentes: {
        techo: wTecho,
        piso: wPiso,
        muros: wMuro,
        ventanas: wVentana,
        puertas: wPuerta
      },
      debilidades: Array.from(debilidades),
      resumenEjecutivo
    };
  }

  global.ThermalEngine = {
    normalizeSurveyAnswers,
    calculateThermalDiagnosis,
    mapAhorroToCEVLetter,
    normalizeOrientaciones
  };
})(window);
