// =========================================================================
// BANCO DE SOLUCIONES, SUBSIDIOS Y TIPS COSTO $0
// =========================================================================
// Cuando Persona 3 entregue su archivo final, puedes reemplazar los textos
// y precios aquí manteniendo exactamente los mismos nombres en "tags".

window.SOLUTIONS_CATALOG = {
  weaknessLabels: {
    fuga_techo: "Pérdida de calor por el techo",
    muro_sin_aislacion: "Muros exteriores sin aislación",
    puente_termico_muro: "Puentes térmicos en bordes de muros",
    vidrio_simple: "Ventanas de vidrio simple",
    marco_metalico_frio: "Marcos metálicos sin corte térmico",
    infiltracion_ventanas: "Infiltración de aire en ventanas",
    infiltracion_puerta: "Fugas de aire y calor por puerta exterior",
    sobrecalentamiento_poniente: "Sobrecalentamiento por sol de tarde (Poniente)",
    frio_orientacion_sur: "Baja ganancia solar (Orientación Sur)",
    falta_sombra_solar: "Falta de protección solar exterior"
  },

  solutions: [
    // --- FUGA TECHO ---
    {
      id: "techo_lana_mineral",
      nombre: "Aislación de entretecho con lana mineral o poliéster (100–120 mm)",
      categoria: "mayor_impacto",
      costoCLP: "$180.000 – $350.000 (casa 60 m²)",
      rangoPresupuesto: "medio",
      impacto: "Muy Alto",
      aptaArrendatario: false,
      tags: ["fuga_techo"],
      descripcion: "Instalar rollos de lana mineral o fibra de poliéster sobre el cielo del entretecho reduce hasta un 35% las pérdidas de calor en invierno y frena la radiación del verano.",
      tip: "Verifica que los rollos queden bien juntos sin dejar rendijas y sin aplastar el material."
    },
    {
      id: "techo_escotilla_sello",
      nombre: "Sellar y aislar la escotilla (tapa) del entretecho",
      categoria: "bajo_costo",
      costoCLP: "$6.000 – $12.000",
      rangoPresupuesto: "bajo",
      impacto: "Medio",
      aptaArrendatario: true,
      tags: ["fuga_techo"],
      descripcion: "Por la tapa del cielo escapa aire caliente constantemente. Pegar una plancha de plumavit encima de la tapa y burlete de espuma en su borde frena esa fuga.",
      tip: "Usa una plancha de EPS (plumavit) de 30–50 mm cortada a medida y burlete adhesivo."
    },

    // --- MURO SIN AISLACIÓN ---
    {
      id: "muro_eifs_exterior",
      nombre: "Revestimiento térmico exterior (Sistema EIFS)",
      categoria: "mayor_impacto",
      costoCLP: "Desde $1.200.000 (postulable a Subsidio DS 27)",
      rangoPresupuesto: "alto",
      impacto: "Muy Alto",
      aptaArrendatario: false,
      tags: ["muro_sin_aislacion", "puente_termico_muro"],
      descripcion: "Envuelve los muros exteriores con planchas de poliestireno expandido (EPS) de alta densidad y estuco elastomérico, eliminando el frío de los muros y los puentes térmicos.",
      tip: "Es la intervención estrella cubierta por el Subsidio de Acondicionamiento Térmico del MINVU."
    },
    {
      id: "muro_cortinas_alfombras_reflector",
      nombre: "Lámina reflectante detrás de estufas + reubicación de muebles",
      categoria: "bajo_costo",
      costoCLP: "$8.000 – $18.000",
      rangoPresupuesto: "bajo",
      impacto: "Medio",
      aptaArrendatario: true,
      tags: ["muro_sin_aislacion", "frio_orientacion_sur"],
      descripcion: "Colocar un panel reflectante térmico entre radiadores/estufas eléctricas y muros exteriores fríos devuelve el calor hacia la habitación en lugar de calentar la pared.",
      tip: "Ubica libreros o camas en los muros interiores y evita apoyar respaldos directamente contra muros exteriores húmedos."
    },

    // --- PUENTE TÉRMICO MURO ---
    {
      id: "puente_sellado_pilares",
      nombre: "Revestimiento interior con placa termoacústica en muros fríos",
      categoria: "mayor_impacto",
      costoCLP: "$120.000 – $280.000 por muro",
      rangoPresupuesto: "medio",
      impacto: "Alto",
      aptaArrendatario: false,
      tags: ["puente_termico_muro", "muro_sin_aislacion"],
      descripcion: "Instalar planchas de yeso-cartón laminadas con poliestireno (Volcapol) en muros perimetrales críticos o esquinas con condensación.",
      tip: "Ideal en dormitorios orientados al sur donde aparece condensación o manchas de humedad en invierno."
    },
    {
      id: "puente_pintura_anticondensacion",
      nombre: "Sellado de grietas perimetrales y limpieza preventiva de condensación",
      categoria: "bajo_costo",
      costoCLP: "$9.000 – $22.000",
      rangoPresupuesto: "bajo",
      impacto: "Medio",
      aptaArrendatario: true,
      tags: ["puente_termico_muro"],
      descripcion: "Sellar uniones entre marco y muro con silicona acrílica pintable evita puentes de aire frío y humedad localizada.",
      tip: "Ventila 10 minutos cada mañana para bajar la humedad interior y evitar hongos en esquinas frías."
    },

    // --- VIDRIO SIMPLE ---
    {
      id: "ventana_termopanel_pvc",
      nombre: "Recambio a ventanas termopanel (DVH) con marco PVC",
      categoria: "mayor_impacto",
      costoCLP: "$220.000 – $380.000 por ventana (postulable a DS 27)",
      rangoPresupuesto: "alto",
      impacto: "Muy Alto",
      aptaArrendatario: false,
      tags: ["vidrio_simple", "marco_metalico_frio", "infiltracion_ventanas"],
      descripcion: "Reduce a la mitad la transmitancia térmica respecto al vidrio simple (de 5,8 a ~2,8 W/m²K), eliminando la sensación de frío junto a la ventana y el ruido exterior.",
      tip: "Prioriza primero los dormitorios y el living, donde pasas más horas."
    },
    {
      id: "ventana_film_termico",
      nombre: "Film transparente aislante termocontraíble para ventanas",
      categoria: "bajo_costo",
      costoCLP: "$10.000 – $18.000 (rinde 2 a 3 ventanas)",
      rangoPresupuesto: "bajo",
      impacto: "Alto",
      aptaArrendatario: true,
      tags: ["vidrio_simple", "infiltracion_ventanas"],
      descripcion: "Lámina plástica transparente que se pega al marco con cinta doble faz y se tensa con secador de pelo, creando una cámara de aire similar a un doble vidrio temporal.",
      tip: "Fácil de instalar en invierno y se retira sin dañar el marco si arriendas."
    },
    {
      id: "ventana_cortina_blackout_termica",
      nombre: "Cortinas gruesas o blackout con respaldo térmico",
      categoria: "bajo_costo",
      costoCLP: "$18.000 – $29.000 por ventana",
      rangoPresupuesto: "bajo",
      impacto: "Alto",
      aptaArrendatario: true,
      tags: ["vidrio_simple", "marco_metalico_frio", "sobrecalentamiento_poniente", "frio_orientacion_sur"],
      descripcion: "Crean una barrera textil frente al vidrio: retienen el calor en noches de invierno y bloquean el sol intenso en tardes de verano.",
      tip: "Instálalas lo más pegadas posible al muro y que cubran 10–15 cm más allá de los bordes del marco."
    },

    // --- MARCO METÁLICO FRÍO ---
    {
      id: "marco_burlete_aislante",
      nombre: "Burletes de caucho EPDM (perfil D o P) en marcos metálicos",
      categoria: "bajo_costo",
      costoCLP: "$4.500 – $8.000 por rollo de 6 metros",
      rangoPresupuesto: "bajo",
      impacto: "Alto",
      aptaArrendatario: true,
      tags: ["marco_metalico_frio", "infiltracion_ventanas"],
      descripcion: "Sella las holguras donde choca la hoja con el marco de aluminio o fierro, cortando los chiflones de aire helado y el ruido de la calle.",
      tip: "Limpia muy bien el aluminio con alcohol antes de pegar el burlete para que dure varios inviernos."
    },

    // --- INFILTRACIÓN VENTANAS ---
    {
      id: "ventana_felpa_corredera",
      nombre: "Cambio de felpas y ajuste de carros en ventanas correderas",
      categoria: "bajo_costo",
      costoCLP: "$6.000 – $15.000",
      rangoPresupuesto: "bajo",
      impacto: "Alto",
      aptaArrendatario: true,
      tags: ["infiltracion_ventanas"],
      descripcion: "Las ventanas correderas pierden hermeticidad cuando sus felpas se aplastan. Reemplazar la felpa perimetral y sellar el encuentro central frena la entrada de viento.",
      tip: "También revisa que el pestillo cierre con firmeza para que ambas hojas queden bien apretadas."
    },

    // --- INFILTRACIÓN PUERTA ---
    {
      id: "puerta_sello_basico",
      nombre: "Burlete perimetral + cubre rendija inferior (escobilla o doble rollo)",
      categoria: "bajo_costo",
      costoCLP: "$5.000 – $12.000",
      rangoPresupuesto: "bajo",
      impacto: "Alto",
      aptaArrendatario: true,
      tags: ["infiltracion_puerta"],
      descripcion: "Un burlete adhesivo en los costados y un zócalo/tubo doble bajo la puerta bloquean una de las entradas más directas de aire frío a ras de piso.",
      tip: "Los tubos dobles deslizables de espuma no requieren tornillos y son ideales para departamentos arrendados."
    },
    {
      id: "puerta_reemplazo_solida",
      nombre: "Cambio a puerta exterior sólida con burlete integrado",
      categoria: "mayor_impacto",
      costoCLP: "$160.000 – $320.000",
      rangoPresupuesto: "medio",
      impacto: "Alto",
      aptaArrendatario: false,
      tags: ["infiltracion_puerta"],
      descripcion: "Reemplazar una puerta hueca/terciada o metálica delgada por una puerta de madera maciza o núcleo aislante reduce pérdidas térmicas y mejora la seguridad.",
      tip: "Asegúrate de sellar el contorno entre el marco de madera y el muro con espuma de poliuretano o silicona."
    },

    // --- SOBRECALENTAMIENTO PONIENTE / FALTA SOMBRA ---
    {
      id: "sombra_toldo_exterior",
      nombre: "Instalación de toldo retráctil, celosía o alero exterior",
      categoria: "mayor_impacto",
      costoCLP: "$90.000 – $280.000",
      rangoPresupuesto: "medio",
      impacto: "Muy Alto",
      aptaArrendatario: false,
      tags: ["sobrecalentamiento_poniente", "falta_sombra_solar"],
      descripcion: "Detener la radiación solar ANTES de que toque el vidrio es hasta 3 veces más efectivo que usar cortinas interiores para evitar el efecto invernadero en verano.",
      tip: "En orientación poniente, una malla o toldo vertical exterior bloquea el sol bajo de las 16:00 a 19:00 hrs."
    },
    {
      id: "sombra_malla_raschel_lamina",
      nombre: "Malla sombra exterior (Raschel) o lámina de control solar en vidrios",
      categoria: "bajo_costo",
      costoCLP: "$12.000 – $26.000",
      rangoPresupuesto: "bajo",
      impacto: "Alto",
      aptaArrendatario: true,
      tags: ["sobrecalentamiento_poniente", "falta_sombra_solar"],
      descripcion: "Colgar malla sombra por fuera del balcón/ventana en meses de calor o adherir lámina reflectiva estática reduce drásticamente el sobrecalentamiento de tarde.",
      tip: "Si arriendas, usa láminas de control solar de adhesión estática (sin pegamento) o malla con amarras removibles."
    },

    // --- FRÍO ORIENTACIÓN SUR ---
    {
      id: "sur_sello_calefaccion_eficiente",
      nombre: "Aislación focalizada en recintos sur + burletes y alfombra gruesa",
      categoria: "mayor_impacto",
      costoCLP: "$150.000 – $350.000",
      rangoPresupuesto: "medio",
      impacto: "Alto",
      aptaArrendatario: false,
      tags: ["frio_orientacion_sur"],
      descripcion: "Como los recintos al sur casi no reciben sol en invierno, concentrar en ellos la aislación de cielo/muro y el recambio a doble vidrio rinde mucho más que intervenir otras fachadas.",
      tip: "Complementa con una alfombra gruesa sobre pisos de cerámica o radier para reducir la pérdida por contacto."
    }
  ],

  subsidioDS27: {
    titulo: "Subsidio Hogar Mejor — Acondicionamiento Térmico (D.S. N° 27 MINVU)",
    subtitulo: "Financiamiento estatal para mejorar techo, muros, ventanas y ventilación de tu vivienda",
    descripcion: "Permite a familias propietarias de viviendas existentes (casas y copropiedades) financiar obras como aislación exterior (EIFS), recambio a ventanas termopanel, aislación de techumbre y sellado de infiltraciones.",
    requisitos: [
      "Ser propietario o asignatario de la vivienda (o cónyuge).",
      "Contar con Registro Social de Hogares (RSH) vigente (prioridad tramos 40% a 60%, según llamado).",
      "Tener ahorro mínimo en cuenta de ahorro para la vivienda (referencia habitual desde 3 UF, varía según llamado).",
      "Postular a través de una Entidad Patrocinante (EP) o Municipalidad en los llamados vigentes del SERVIU Metropolitano."
    ],
    urlOficial: "https://www.minvu.gob.cl/beneficio/vivienda/subsidio-de-mejoramiento-de-vivienda-hogar-mejor/",
    notaArrendatarios: "Importante: Este subsidio estatal exige acreditar propiedad de la vivienda. Si arriendas, puedes compartir este diagnóstico con el propietario para evaluar una postulación."
  },

  tipsCostoCero: [
    {
      titulo: "Aprovecha el sol en invierno (Regla de las cortinas)",
      texto: "Abre completamente las cortinas de ventanas al Norte y Oriente durante el día para captar calor gratis, y ciérralas apenas baje el sol (17:30–18:00 hrs) para retener el calor adentro."
    },
    {
      titulo: "Ventilación cruzada nocturna en verano",
      texto: "En Santiago las noches refrescan mucho. Mantén persianas y ventanas cerradas entre las 12:00 y 19:00 hrs, y abre ventanas opuestas de noche o muy temprano en la mañana para renovar el aire caliente."
    },
    {
      titulo: "Ventilación corta y efectiva en invierno",
      texto: "Ventila solo 10 minutos al mediodía (cuando la temperatura exterior es más alta) abriendo ventanas opuestas. Evita dejar una ventana entreabierta todo el día, porque enfría los muros."
    },
    {
      titulo: "Sectoriza la calefacción",
      texto: "Mantén cerradas las puertas de dormitorios o piezas que no estés usando cuando enciendas la estufa; calefaccionar menos metros cúbicos ahorra hasta un 25% de energía."
    },
    {
      titulo: "Reduce la humedad interior al cocinar y ducharte",
      texto: "El aire húmedo se siente mucho más frío y cuesta más calentarlo. Tapa las ollas al cocinar, seca la ropa afuera si puedes y ventila el baño inmediatamente después de la ducha."
    }
  ]
};
