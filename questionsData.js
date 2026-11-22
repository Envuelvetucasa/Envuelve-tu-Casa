// Contenido exacto de la Encuesta, Ayudas (?) y Asistente Guiado (Persona 2)

window.QUESTIONS_DATA = {
  comunasRM: [
    "Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina",
    "Conchalí", "Curacaví", "El Bosque", "El Monte", "Estación Central",
    "Huechuraba", "Independencia", "Isla de Maipo", "La Cisterna", "La Florida",
    "La Granja", "La Pintana", "La Reina", "Lampa", "Las Condes", "Lo Barnechea",
    "Lo Espejo", "Lo Prado", "Macul", "Maipú", "María Pinto", "Melipilla",
    "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", "Peñaflor",
    "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura",
    "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín",
    "San José de Maipo", "San Miguel", "San Pedro", "San Ramón", "Santiago",
    "Talagante", "Tiltil", "Vitacura"
  ],

  blocks: [
    {
      id: 1,
      title: "Ubicación y tipo de vivienda",
      subtitle: "Datos generales de tu hogar en Santiago",
      assistantBlockKey: "bloque_1",
      questions: [
        {
          id: "comuna",
          number: 1,
          label: "¿En qué comuna vives?",
          type: "select",
          placeholder: "Selecciona tu comuna...",
          help: "Solo usamos tu comuna para conocer el clima de tu zona y para estadísticas generales. No te pedimos tu dirección."
        },
        {
          id: "tipoVivienda",
          number: 2,
          label: "¿En qué tipo de vivienda vives?",
          type: "radio",
          options: [
            { value: "casa_aislada", label: "Casa aislada" },
            { value: "casa_pareada", label: "Casa pareada o continua" },
            { value: "depto_ultimo_piso", label: "Depto último piso" },
            { value: "depto_intermedio", label: "Depto piso intermedio" },
            { value: "depto_primer_piso", label: "Depto primer piso" }
          ],
          help: "Una casa aislada no toca otras casas. Una casa pareada comparte un muro con la casa vecina. Una casa continua está pegada a otras casas por ambos lados. Si vives en departamento, fíjate si hay otro departamento encima del tuyo: si no lo hay, estás en el último piso."
        },
        {
          id: "antiguedad",
          number: 3,
          label: "¿Cuántos años tiene tu vivienda, más o menos?",
          type: "radio",
          options: [
            { value: "0_10", label: "0 a 10 años" },
            { value: "11_15", label: "11 a 15 años" },
            { value: "16_20", label: "16 a 20 años" },
            { value: "21_mas", label: "21 años o más" },
            { value: "no_se", label: "No sé" }
          ],
          help: "Si no lo sabes, pregúntale al dueño, a la administración del edificio o a un vecino antiguo. Una pista: las viviendas construidas desde el año 2000 debían tener aislación en el techo, y las construidas desde 2007, también en los muros."
        }
      ]
    },
    {
      id: 2,
      title: "Muros y techo",
      subtitle: "La estructura principal que envuelve tu hogar",
      assistantBlockKey: "bloque_2",
      questions: [
        {
          id: "materialMuro",
          number: 4,
          label: "¿De qué material son los muros que dan hacia afuera?",
          type: "radio",
          options: [
            { value: "ladrillo_sin_aislacion", label: "Ladrillo sin aislación" },
            { value: "hormigon_sin_aislacion", label: "Hormigón armado sin aislación" },
            { value: "tabique_sin_aislacion", label: "Tabique liviano o madera sin aislación" },
            { value: "adobe", label: "Adobe" },
            { value: "muro_aislacion_interior", label: "Muro con aislación por dentro" },
            { value: "muro_aislacion_exterior", label: "Muro con aislación por fuera" },
            { value: "no_se", label: "No sé" }
          ],
          help: "Golpea suavemente con los nudillos un muro que dé a la calle o al patio. Si suena hueco y vibra, es tabique o madera. Si suena sólido y se siente frío al tacto, es ladrillo u hormigón. El adobe es de barro y sus muros son muy gruesos. Elige 'con aislación' solo si sabes que tiene plumavit u otro aislante, por dentro o por fuera."
        },
        {
          id: "techo",
          number: 5,
          label: "¿Tu techo tiene material aislante?",
          type: "radio",
          hideWhenAdiabatic: true,
          options: [
            { value: "sin_aislacion", label: "Sin aislación" },
            { value: "aislacion_basica", label: "Aislación básica o no sé" },
            { value: "aislacion_estandar", label: "Aislación estándar (8–10 cm lana o plumavit)" },
            { value: "aislacion_alta", label: "Aislación alta (12 cm o más)" }
          ],
          help: "Si vives en casa, mira por la escotilla del entretecho (la tapa en el cielo de algún pasillo o clóset). El aislante se ve como lana amarilla o gris, o como planchas blancas de plumavit. Si en verano el cielo de tu casa calienta mucho en la tarde, probablemente tiene poco aislante. Si vives en el último piso de un edificio, pregúntale a la administración."
        }
      ]
    },
    {
      id: 3,
      title: "Ventanas y puertas",
      subtitle: "Por donde suelen entrar los chiflones y el frío",
      assistantBlockKey: "bloque_3",
      questions: [
        {
          id: "vidrio",
          number: 6,
          label: "¿Qué tipo de vidrio tienen tus ventanas?",
          type: "radio",
          options: [
            { value: "monolitico", label: "Vidrio simple" },
            { value: "doble_ventana", label: "Doble ventana simple" },
            { value: "dvh_basico", label: "Termopanel básico" },
            { value: "dvh_alto", label: "Termopanel grueso" },
            { value: "no_se", label: "No sé" }
          ],
          help: "Acerca la linterna de tu celular en diagonal al vidrio. Si ves 2 reflejos de la luz, es vidrio simple. Si ves 4 reflejos (dos pares), es termopanel. Si tienes dos ventanas separadas, una detrás de la otra, es doble ventana. Si tienes termopanel y no sabes cuál es, elige el básico."
        },
        {
          id: "marco",
          number: 7,
          label: "¿De qué material es el marco de tus ventanas?",
          type: "radio",
          options: [
            { value: "madera", label: "Madera" },
            { value: "pvc", label: "PVC" },
            { value: "aluminio_rpt", label: "Aluminio con corte térmico" },
            { value: "aluminio_sin_rpt", label: "Aluminio común" },
            { value: "acero", label: "Acero o fierro" },
            { value: "no_se", label: "No sé" }
          ],
          help: "Abre la ventana y mira el borde del marco. Si es metálico y frío al tacto, es aluminio o fierro. Si ves una franja de plástico que separa la parte de adentro de la de afuera, es aluminio con corte térmico. El PVC es un plástico, casi siempre blanco. El fierro es común en ventanas antiguas."
        },
        {
          id: "cierreVentana",
          number: 8,
          label: "¿Cómo se abren tus ventanas?",
          type: "radio",
          options: [
            { value: "fija", label: "Fija" },
            { value: "abatir_proyectante", label: "Abatir o proyectante" },
            { value: "corredera", label: "Corredera" },
            { value: "guillotina_antigua", label: "Guillotina antigua" },
            { value: "no_se", label: "No sé" }
          ],
          help: "Fija: no se abre. Abatir o proyectante: la hoja gira hacia adentro o hacia afuera, como una puerta. Corredera: la hoja se desliza hacia el lado. Guillotina: la hoja sube y baja. Si tienes de varios tipos, elige el más común en el living y los dormitorios."
        },
        {
          id: "puerta",
          number: 9,
          label: "¿Cómo es la puerta principal que da hacia afuera?",
          type: "radio",
          options: [
            { value: "madera_solida", label: "Madera sólida" },
            { value: "madera_entablerada", label: "Madera hueca o terciada" },
            { value: "con_vidrio_parcial", label: "Con vidrio parcial" },
            { value: "metal_o_vidrio_total", label: "Metal o casi todo vidrio" },
            { value: "no_se", label: "No sé" }
          ],
          help: "Golpea la puerta con los nudillos. Si suena sólida y es pesada, es madera sólida. Si suena hueca, es madera hueca o terciada. Si tiene vidrios que ocupan hasta la mitad de la puerta, elige 'Con vidrio parcial'."
        },
        {
          id: "sienteChiflon",
          number: 10,
          label: "¿Sientes chiflones de aire frío o pasa luz por los bordes de puertas o ventanas?",
          type: "radio",
          options: [
            { value: "true", label: "Sí" },
            { value: "false", label: "No" },
            { value: "no_se", label: "No sé" }
          ],
          help: "En un día de viento, pasa la mano mojada cerca de los bordes de puertas y ventanas: si sientes frío, entra aire. También puedes fijarte de noche si pasa luz por las rendijas o por debajo de la puerta."
        }
      ]
    },
    {
      id: 4,
      title: "Sol y orientación",
      subtitle: "Cómo interactúa tu vivienda con el sol y la sombra en Santiago",
      assistantBlockKey: "bloque_4",
      questions: [
        {
          id: "orientacionPrincipal",
          number: 11,
          label: "¿Hacia dónde miran las ventanas del living o de los dormitorios?",
          type: "radio",
          options: [
            { value: "norte", label: "Norte" },
            { value: "oriente", label: "Oriente (hacia la cordillera)" },
            { value: "poniente", label: "Poniente (sol de tarde)" },
            { value: "sur", label: "Sur" },
            { value: "no_se", label: "No sé" }
          ],
          help: "En Santiago, la cordillera siempre está al oriente. Párate mirando hacia la cordillera: a tu izquierda está el norte, a tu derecha el sur y a tu espalda el poniente. Otra pista: si el sol entra en la mañana, miran al oriente; si entra en la tarde, al poniente; si casi nunca entra, al sur."
        },
        {
          id: "tieneAleroOToldo",
          number: 12,
          label: "¿Tienes alero, balcón arriba o toldo que dé sombra a tus ventanas?",
          type: "radio",
          options: [
            { value: "true", label: "Sí" },
            { value: "false", label: "No" },
            { value: "no_se", label: "No sé" }
          ],
          help: "Un alero es la parte del techo que sobresale por encima de la ventana. Si vives en departamento, el balcón del piso de arriba también cuenta. Un toldo es una lona o cubierta. Todos bloquean el sol fuerte del verano."
        },
        {
          id: "nivelSombraEntorno",
          number: 13,
          label: "¿Cuánta sombra le dan a tu vivienda los edificios o árboles cercanos?",
          type: "radio",
          options: [
            { value: "despejado", label: "Despejado (sol directo)" },
            { value: "parcial", label: "Sombra parcial (árboles o casas)" },
            { value: "muy_sombreado", label: "Muy sombreado (edificios pegados)" },
            { value: "no_se", label: "No sé" }
          ],
          help: "Piensa en un día despejado de verano a las 3 de la tarde. ¿Qué parte de tu fachada principal queda tapada por edificios, casas o árboles vecinos?"
        }
      ]
    },
    {
      id: 5,
      title: "Personaliza tus soluciones",
      subtitle: "Últimas 2 preguntas para ajustar las recomendaciones a tu realidad",
      assistantBlockKey: "bloque_4",
      questions: [
        {
          id: "tenencia",
          number: 14,
          label: "¿Eres dueño o arrendatario de la vivienda?",
          type: "radio",
          options: [
            { value: "dueno", label: "Soy dueño" },
            { value: "arrendatario", label: "Arriendo" }
          ],
          help: "Si arriendas, priorizaremos soluciones que puedas instalar y retirar sin hacer obras estructurales. Este dato no afecta el cálculo térmico."
        },
        {
          id: "presupuesto",
          number: 15,
          label: "¿Cuánto podrías gastar en mejorar tu vivienda?",
          type: "radio",
          options: [
            { value: "bajo", label: "Menos de $30.000" },
            { value: "medio", label: "Entre $30.000 y $300.000" },
            { value: "alto", label: "Más de $300.000" }
          ],
          help: "Usamos este rango solo para mostrarte primero las opciones que mejor se ajustan a tu bolsillo."
        }
      ]
    }
  ],

  assistantFAQ: {
    bloque_1: {
      titulo: "Ayuda: Tipo de vivienda",
      items: [
        {
          q: "¿Qué marco si vivo en un block?",
          a: "Elige departamento y fíjate en qué piso estás: primer piso, piso intermedio (hay vecinos arriba) o último piso (no hay nadie arriba)."
        },
        {
          q: "Vivo en una casa de dos pisos, ¿cuál elijo?",
          a: "Elige según si tu casa toca otras casas o no: aislada, pareada o continua. La cantidad de pisos no cambia la respuesta."
        },
        {
          q: "¿Me van a pedir mi nombre, RUT o dirección?",
          a: "No. Solo te preguntamos la comuna. No necesitas registrarte ni dar datos personales."
        }
      ]
    },
    bloque_2: {
      titulo: "Ayuda: Muros y techo",
      items: [
        {
          q: "¿Cómo sé si mi muro es de ladrillo o de tabique?",
          a: "Golpea suavemente con los nudillos un muro que dé a la calle. Si suena hueco, es tabique o madera. Si suena sólido y se siente frío, es ladrillo u hormigón."
        },
        {
          q: "No puedo subir al entretecho, ¿qué marco?",
          a: "No te arriesgues a subir. Elige 'Aislación básica o no sé'. También puedes preguntarle al dueño o a quien construyó la casa."
        },
        {
          q: "¿Qué es el plumavit o la lana mineral?",
          a: "Son materiales aislantes: frenan el paso del calor. El plumavit son planchas blancas y livianas. La lana mineral parece algodón amarillo o gris."
        }
      ]
    },
    bloque_3: {
      titulo: "Ayuda: Ventanas y puertas",
      items: [
        {
          q: "¿Cómo diferencio el vidrio simple del termopanel?",
          a: "Acerca la linterna del celular en diagonal al vidrio. Si ves 2 reflejos, es vidrio simple. Si ves 4 reflejos (dos pares), es termopanel."
        },
        {
          q: "Mis ventanas son distintas entre sí, ¿cuál elijo?",
          a: "Responde pensando en las ventanas del living y los dormitorios, que es donde pasas más tiempo."
        },
        {
          q: "¿Cómo sé si entra aire por la puerta?",
          a: "En un día de viento, pasa la mano mojada por los bordes y por debajo de la puerta. Si sientes frío, hay una filtración."
        }
      ]
    },
    bloque_4: {
      titulo: "Ayuda: Sol y orientación",
      items: [
        {
          q: "No sé hacia dónde mira mi living",
          a: "En Santiago, la cordillera siempre está al oriente. Párate mirando la cordillera: a tu izquierda es norte, a tu derecha es sur y a tu espalda es poniente."
        },
        {
          q: "¿Por qué importa la orientación?",
          a: "Las ventanas al norte reciben sol en invierno y ayudan a calentar. Las del poniente reciben el sol fuerte de la tarde y calientan mucho en verano. Las del sur casi no reciben sol y suelen ser más frías."
        },
        {
          q: "¿Qué cuenta como sombra del entorno?",
          a: "Todo lo que esté fuera de tu vivienda y le tape el sol: edificios, casas vecinas o árboles grandes. El alero o el balcón de arriba van en la pregunta de protección solar."
        }
      ]
    }
  }
};
