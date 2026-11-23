// Contenido completo de la Encuesta (18 preguntas), Ayudas (?) y Asistente Guiado
// Iniciativa Envuelve tu Casa v2.0 (Auditoría completa integrada)

window.QUESTIONS_DATA = {
  "comunasRM": [
    "Alhué",
    "Buin",
    "Calera de Tango",
    "Cerrillos",
    "Cerro Navia",
    "Colina",
    "Conchalí",
    "Curacaví",
    "El Bosque",
    "El Monte",
    "Estación Central",
    "Huechuraba",
    "Independencia",
    "Isla de Maipo",
    "La Cisterna",
    "La Florida",
    "La Granja",
    "La Pintana",
    "La Reina",
    "Lampa",
    "Las Condes",
    "Lo Barnechea",
    "Lo Espejo",
    "Lo Prado",
    "Macul",
    "Maipú",
    "María Pinto",
    "Melipilla",
    "Ñuñoa",
    "Padre Hurtado",
    "Paine",
    "Pedro Aguirre Cerda",
    "Peñaflor",
    "Peñalolén",
    "Pirque",
    "Providencia",
    "Pudahuel",
    "Puente Alto",
    "Quilicura",
    "Quinta Normal",
    "Recoleta",
    "Renca",
    "San Bernardo",
    "San Joaquín",
    "San José de Maipo",
    "San Miguel",
    "San Pedro",
    "San Ramón",
    "Santiago",
    "Talagante",
    "Tiltil",
    "Vitacura"
  ],
  "blocks": [
    {
      "id": 1,
      "title": "Ubicación y tipo de vivienda",
      "subtitle": "Datos generales de tu hogar en la Región Metropolitana",
      "assistantBlockKey": "bloque_1",
      "questions": [
        {
          "id": "comuna",
          "number": 1,
          "label": "¿En qué comuna vives?",
          "type": "select",
          "placeholder": "Selecciona tu comuna...",
          "help": "Usamos tu comuna para confirmar que te ubicas en la Zona Térmica D (Santiago urbano según Manual CEV), advertir si tu comuna tiene sectores precordilleranos (Zona H) y registrar estadísticas anónimas agregadas. No cambia el cálculo entre comunas urbanas ni te pedimos tu dirección."
        },
        {
          "id": "tipoVivienda",
          "number": 2,
          "label": "¿En qué tipo de vivienda vives?",
          "type": "radio",
          "options": [
            {
              "value": "casa_aislada",
              "label": "Casa aislada (no toca vecinos)"
            },
            {
              "value": "casa_pareada",
              "label": "Casa pareada (comparte 1 muro)"
            },
            {
              "value": "casa_continua",
              "label": "Casa continua / en hilera (pegada por ambos lados)"
            },
            {
              "value": "depto_ultimo_piso",
              "label": "Depto último piso"
            },
            {
              "value": "depto_intermedio",
              "label": "Depto piso intermedio"
            },
            {
              "value": "depto_primer_piso",
              "label": "Depto primer piso"
            }
          ],
          "help": "Una casa aislada tiene sus 4 lados al exterior. Una casa pareada comparte un muro con una casa vecina. Una casa continua está pegada a otras casas por ambos lados (expone menos muros al frío). En departamento, fíjate si hay otro departamento arriba y/o abajo."
        },
        {
          "id": "antiguedad",
          "number": 3,
          "label": "¿Cuántos años tiene tu vivienda, más o menos?",
          "type": "radio",
          "options": [
            {
              "value": "0_10",
              "label": "0 a 10 años"
            },
            {
              "value": "11_15",
              "label": "11 a 15 años"
            },
            {
              "value": "16_20",
              "label": "16 a 20 años"
            },
            {
              "value": "21_mas",
              "label": "21 años o más"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "Si no lo sabes, pregúntale al dueño, a la administración del edificio o a un vecino antiguo. Pista: en Chile las viviendas desde el año 2000 debían aislar techos, y desde 2007 también muros."
        }
      ]
    },
    {
      "id": 2,
      "title": "Muros, techo y piso",
      "subtitle": "La envolvente principal que separa tu hogar del exterior",
      "assistantBlockKey": "bloque_2",
      "questions": [
        {
          "id": "materialMuro",
          "number": 4,
          "label": "¿De qué material son los muros que dan hacia afuera?",
          "type": "radio",
          "options": [
            {
              "value": "ladrillo_sin_aislacion",
              "label": "Ladrillo sin aislación"
            },
            {
              "value": "hormigon_sin_aislacion",
              "label": "Hormigón armado sin aislación"
            },
            {
              "value": "tabique_sin_aislacion",
              "label": "Tabique liviano o madera sin aislación"
            },
            {
              "value": "adobe",
              "label": "Adobe"
            },
            {
              "value": "muro_aislacion_interior",
              "label": "Muro con aislación por dentro"
            },
            {
              "value": "muro_aislacion_exterior",
              "label": "Muro con aislación por fuera"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "Golpea suavemente con los nudillos un muro que dé a la calle o al patio. Si suena hueco y vibra, es tabique o madera. Si suena sólido y se siente frío al tacto, es ladrillo u hormigón. Elige 'con aislación' solo si sabes que tiene poliestireno o lana mineral, por dentro o por fuera."
        },
        {
          "id": "techo",
          "number": 5,
          "label": "¿Tu techo tiene material aislante?",
          "type": "radio",
          "hideWhenTechoAdiabatic": true,
          "options": [
            {
              "value": "sin_aislacion",
              "label": "Sin aislación"
            },
            {
              "value": "aislacion_basica",
              "label": "Aislación básica (< 5 cm) o no sé"
            },
            {
              "value": "aislacion_estandar",
              "label": "Aislación estándar (8–10 cm lana o poliestireno)"
            },
            {
              "value": "aislacion_alta",
              "label": "Aislación alta (12 cm o más)"
            }
          ],
          "help": "Si vives en casa, mira por la escotilla del entretecho (la tapa en el cielo de un pasillo o clóset). El aislante se ve como lana amarilla/gris o planchas blancas. Si en verano el cielo irradia mucho calor en la tarde, suele tener poca aislación. En último piso de edificio, consulta a la administración."
        },
        {
          "id": "piso",
          "number": 6,
          "label": "¿Qué hay debajo del piso de tu vivienda?",
          "type": "radio",
          "hideWhenPisoAdiabatic": true,
          "options": [
            {
              "value": "piso_sobre_terreno",
              "label": "Directo sobre tierra / radier (sin aislación conocida)"
            },
            {
              "value": "piso_ventilado_estacionamiento",
              "label": "Estacionamiento abierto, pilotes o espacio frío ventilado"
            },
            {
              "value": "piso_aislado",
              "label": "Piso con aislación térmica o sobre recinto cerrado tibio"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "La mayoría de las casas de Santiago están apoyadas sobre radier (directo en el terreno). Los pisos sobre estacionamientos abiertos, pasillos exteriores o pilotes (pisos ventilados) pierden bastante más calor en invierno."
        }
      ]
    },
    {
      "id": 3,
      "title": "Ventanas, puertas y humedad",
      "subtitle": "Puntos donde ocurren filtraciones de aire y condensación",
      "assistantBlockKey": "bloque_3",
      "questions": [
        {
          "id": "vidrio",
          "number": 7,
          "label": "¿Qué tipo de vidrio tienen tus ventanas?",
          "type": "radio",
          "options": [
            {
              "value": "monolitico",
              "label": "Vidrio simple"
            },
            {
              "value": "doble_ventana",
              "label": "Doble ventana simple"
            },
            {
              "value": "dvh_basico",
              "label": "Termopanel básico"
            },
            {
              "value": "dvh_alto",
              "label": "Termopanel grueso"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "Acerca la linterna de tu celular en diagonal al vidrio. Si ves 2 reflejos de la luz, es vidrio simple. Si ves 4 reflejos (dos pares), es termopanel. Si tienes dos ventanas separadas una detrás de otra, es doble ventana."
        },
        {
          "id": "marco",
          "number": 8,
          "label": "¿De qué material es el marco de tus ventanas?",
          "type": "radio",
          "options": [
            {
              "value": "madera",
              "label": "Madera"
            },
            {
              "value": "pvc",
              "label": "PVC"
            },
            {
              "value": "aluminio_rpt",
              "label": "Aluminio con corte térmico"
            },
            {
              "value": "aluminio_sin_rpt",
              "label": "Aluminio común"
            },
            {
              "value": "acero",
              "label": "Acero o fierro"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "Abre la ventana y mira el borde del marco. Si es metálico y helado al tacto, es aluminio común o fierro. Si ves una franja plástica negra que separa la cara interior de la exterior, es aluminio con corte térmico. El PVC es plástico, generalmente blanco."
        },
        {
          "id": "cierreVentana",
          "number": 9,
          "label": "¿Cómo se abren tus ventanas?",
          "type": "radio",
          "options": [
            {
              "value": "fija",
              "label": "Fija (no se abre)"
            },
            {
              "value": "abatir_proyectante",
              "label": "Abatir o proyectante (gira)"
            },
            {
              "value": "corredera",
              "label": "Corredera (desliza al lado)"
            },
            {
              "value": "guillotina_antigua",
              "label": "Guillotina antigua (sube y baja)"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "Elige el tipo de apertura que predomina en tu living y dormitorios. Las ventanas de abatir o proyectantes sellan mejor al apretarse contra una goma, mientras que las correderas y de guillotina tienen mayor riesgo de desgaste en sus felpas."
        },
        {
          "id": "puerta",
          "number": 10,
          "label": "¿Cómo es la puerta principal que da hacia afuera?",
          "type": "radio",
          "options": [
            {
              "value": "madera_solida",
              "label": "Madera sólida (maciza y pesada)"
            },
            {
              "value": "madera_entablerada",
              "label": "Madera hueca o terciada"
            },
            {
              "value": "con_vidrio_parcial",
              "label": "Con vidrio parcial"
            },
            {
              "value": "metal_o_vidrio_total",
              "label": "Metal o casi todo vidrio"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "Golpea la puerta con los nudillos. Si suena sólida y pesa bastante, es madera sólida. Si suena hueca, es madera hueca o terciada. Si tiene vidrios que ocupan cerca de la mitad, elige 'Con vidrio parcial'."
        },
        {
          "id": "sienteChiflon",
          "number": 11,
          "label": "¿Sientes chiflones de aire frío o pasa luz por los bordes de puertas o ventanas?",
          "type": "radio",
          "options": [
            {
              "value": "true",
              "label": "Sí, siento chiflón o entra aire"
            },
            {
              "value": "false",
              "label": "No, cierran bien sin chiflones"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "En un día de viento, pasa la mano mojada cerca de los bordes de puertas y ventanas: si sientes frío puntual, entra aire. También puedes fijarte de noche si pasa luz por las rendijas o por debajo de la puerta."
        },
        {
          "id": "humedadCondensacion",
          "number": 12,
          "label": "¿Notas manchas de humedad, moho (hongos) o gotitas de agua en vidrios o esquinas en invierno?",
          "type": "radio",
          "options": [
            {
              "value": "true",
              "label": "Sí, aparece humedad, condensación o moho"
            },
            {
              "value": "false",
              "label": "No, no tengo problemas de humedad ni hongos"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "Fíjate si en las mañanas de invierno amanecen los vidrios mojados por dentro o si hay manchas oscuras en esquinas de dormitorios, detrás de muebles o cerca del cielo. Solo recomendaremos tratamientos antihongos si respondes Sí."
        }
      ]
    },
    {
      "id": 4,
      "title": "Sol, sombra y orientación",
      "subtitle": "Cómo interactúa tu vivienda con el sol de Santiago en invierno y verano",
      "assistantBlockKey": "bloque_4",
      "questions": [
        {
          "id": "orientacionPrincipal",
          "number": 13,
          "label": "¿Hacia dónde miran las ventanas del living o de los dormitorios?",
          "type": "radio",
          "options": [
            {
              "value": "norte",
              "label": "Norte"
            },
            {
              "value": "oriente",
              "label": "Oriente (hacia la cordillera)"
            },
            {
              "value": "poniente",
              "label": "Poniente (sol de tarde)"
            },
            {
              "value": "sur",
              "label": "Sur"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "En Santiago, la cordillera siempre está al oriente. Párate mirando la cordillera: a tu izquierda está el norte, a tu derecha el sur y a tu espalda el poniente. Otra pista: sol de mañana = oriente; sol fuerte de tarde = poniente; casi nunca entra sol = sur."
        },
        {
          "id": "tieneAleroOToldo",
          "number": 14,
          "label": "¿Tienes alero, balcón arriba o toldo? ¿Logra tapar el sol en verano?",
          "type": "radio",
          "options": [
            {
              "value": "completo",
              "label": "Sí, da sombra completa al vidrio en verano"
            },
            {
              "value": "parcial",
              "label": "Sí, pero es corto y entra sol igual en las tardes"
            },
            {
              "value": "ninguno",
              "label": "No tengo alero, balcón arriba ni toldo"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "En ventanas al poniente un alero corto o un balcón angosto muchas veces no frena el sol bajo de las 16:00 a 19:00 hrs. Marca 'sombra completa' solo si realmente impide que el sol pegue directo al vidrio en verano."
        },
        {
          "id": "nivelSombraEntorno",
          "number": 15,
          "label": "¿Cuánta sombra le dan a tu vivienda los edificios o árboles cercanos?",
          "type": "radio",
          "options": [
            {
              "value": "despejado",
              "label": "Despejado (sol directo)"
            },
            {
              "value": "parcial",
              "label": "Sombra parcial (árboles o casas)"
            },
            {
              "value": "muy_sombreado",
              "label": "Muy sombreado (edificios pegados)"
            },
            {
              "value": "no_se",
              "label": "No sé"
            }
          ],
          "help": "Piensa en un día despejado de verano a las 3 de la tarde. ¿Qué parte de tu fachada principal queda tapada por edificios, casas o árboles vecinos?"
        }
      ]
    },
    {
      "id": 5,
      "title": "Perfil y presupuesto",
      "subtitle": "Últimas 3 preguntas para ajustar el paquete de soluciones a tu realidad",
      "assistantBlockKey": "bloque_5",
      "questions": [
        {
          "id": "calefaccionActual",
          "number": 16,
          "label": "¿Cómo calefaccionas principalmente tu vivienda en invierno?",
          "type": "radio",
          "options": [
            {
              "value": "estufa_electrica_gas_parafina",
              "label": "Estufa eléctrica, a gas o parafina"
            },
            {
              "value": "aire_acondicionado_inverter",
              "label": "Ya tengo aire acondicionado Inverter (frío/calor)"
            },
            {
              "value": "calefaccion_central",
              "label": "Calefacción central (radiadores o losa radiante)"
            },
            {
              "value": "lena_pellet",
              "label": "Estufa a pellet o leña"
            },
            {
              "value": "sin_calefaccion",
              "label": "No uso calefacción / solo abrigo"
            }
          ],
          "help": "Este dato no altera tu nota de envolvente, pero evita recomendarte comprar un aire acondicionado Inverter si ya tienes uno o si no lo necesitas."
        },
        {
          "id": "tenencia",
          "number": 17,
          "label": "¿Eres dueño o arrendatario de la vivienda?",
          "type": "radio",
          "options": [
            {
              "value": "dueno",
              "label": "Soy dueño"
            },
            {
              "value": "arrendatario",
              "label": "Arriendo"
            }
          ],
          "help": "Si arriendas, priorizaremos soluciones que puedas instalar y retirar sin hacer obras estructurales. Este dato no afecta el cálculo térmico."
        },
        {
          "id": "presupuesto",
          "number": 18,
          "label": "¿Cuánto podrías destinar hoy a mejorar tu vivienda?",
          "type": "radio",
          "options": [
            {
              "value": "bajo",
              "label": "Hasta $30.000 (paquete inicial económico)"
            },
            {
              "value": "medio",
              "label": "Entre $30.000 y $300.000"
            },
            {
              "value": "alto",
              "label": "Más de $300.000 (obras de mayor impacto)"
            }
          ],
          "help": "Si eliges hasta $30.000, te armaremos automáticamente un paquete inicial acotado a ese monto máximo. Si eliges un rango mayor, destacaremos las medidas que calzan con tu presupuesto."
        }
      ]
    }
  ],
  "assistantFAQ": {
    "bloque_1": {
      "titulo": "Ayuda: Tipo de vivienda",
      "items": [
        {
          "q": "¿Cuál es la diferencia entre casa pareada y continua?",
          "a": "La casa pareada está pegada a otra casa por un solo lado (comparte 1 muro). La casa continua está en medio de una hilera y comparte ambos muros laterales con vecinos, por lo que pierde menos calor por muros."
        },
        {
          "q": "¿Qué marco si vivo en un block?",
          "a": "Elige departamento y fíjate en qué piso estás: primer piso, piso intermedio (hay vecinos arriba y abajo) o último piso (no hay nadie arriba)."
        },
        {
          "q": "¿Me van a pedir mi nombre, RUT o dirección?",
          "a": "No. Solo te preguntamos la comuna para confirmar tu zona térmica y estadísticas agregadas anónimas."
        }
      ]
    },
    "bloque_2": {
      "titulo": "Ayuda: Muros, techo y piso",
      "items": [
        {
          "q": "¿Cómo sé si mi muro es de ladrillo o de tabique?",
          "a": "Golpea suavemente con los nudillos un muro que dé a la calle. Si suena hueco, es tabique o madera. Si suena sólido y se siente frío, es ladrillo u hormigón."
        },
        {
          "q": "No puedo subir al entretecho, ¿qué marco?",
          "a": "No te arriesgues a subir. Elige 'Aislación básica (< 5 cm) o no sé'. Después el diagnóstico te indicará cómo confirmarlo de forma segura."
        },
        {
          "q": "¿Qué es un piso ventilado?",
          "a": "Es un piso que no está apoyado sobre tierra ni sobre otro departamento habitado, sino sobre estacionamientos abiertos, pilotes o un espacio exterior donde corre aire frío por debajo."
        }
      ]
    },
    "bloque_3": {
      "titulo": "Ayuda: Ventanas, puertas y humedad",
      "items": [
        {
          "q": "¿Cómo diferencio el vidrio simple del termopanel?",
          "a": "Acerca la linterna del celular en diagonal al vidrio. Si ves 2 reflejos, es vidrio simple. Si ves 4 reflejos (dos pares), es termopanel."
        },
        {
          "q": "¿Cómo sé si entra aire por la puerta o ventanas?",
          "a": "En un día de viento, pasa la mano mojada por los bordes y debajo de la puerta. Si sientes frío puntual o pasa luz de noche, marca Sí."
        },
        {
          "q": "¿Por qué preguntan por humedad y hongos?",
          "a": "Para no recomendarte pinturas antihongos si no las necesitas, y porque la condensación suele avisar puntos fríos o falta de ventilación diaria."
        }
      ]
    },
    "bloque_4": {
      "titulo": "Ayuda: Sol y orientación",
      "items": [
        {
          "q": "No sé hacia dónde mira mi living",
          "a": "En Santiago, la cordillera siempre está al oriente. Párate mirando la cordillera: a tu izquierda es norte, a tu derecha es sur y a tu espalda es poniente."
        },
        {
          "q": "¿Cuándo marco alero 'parcial' vs 'completo'?",
          "a": "Si tienes balcón arriba o un alero, pero en verano igual ves entrar sol directo por el vidrio durante la tarde (muy común al poniente), marca 'parcial'."
        },
        {
          "q": "¿Por qué importa tanto el norte vs el poniente?",
          "a": "En Santiago, el sol del norte entra bajo en invierno (calienta gratis) y alto en verano (un alero lo frena). En cambio, el sol del poniente entra casi horizontal en las tardes de verano y recalienta mucho."
        }
      ]
    },
    "bloque_5": {
      "titulo": "Ayuda: Calefacción y presupuesto",
      "items": [
        {
          "q": "¿Para qué preguntan cómo calefacciono?",
          "a": "Solo para personalizar si conviene sugerirte climatización eficiente (como aire acondicionado Inverter) o evitar recomendarte un equipo que ya tienes."
        },
        {
          "q": "¿Cómo funciona la pregunta del presupuesto?",
          "a": "Si eliges hasta $30.000, armamos un paquete inicial acotado a ese tope real. En tramos más altos, destacamos las medidas que calzan con tu inversión disponible."
        },
        {
          "q": "Si arriendo, ¿puedo postular a subsidios?",
          "a": "Los subsidios del MINVU exigen ser propietario o asignatario. Si arriendas, filtraremos primero soluciones removibles sin obras y podrás compartir tu diagnóstico con el dueño."
        }
      ]
    }
  }
};
