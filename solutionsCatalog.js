// =========================================================================
// BANCO DE SOLUCIONES v2.0 (ANTI-REDUNDANCIA, SIN EPS EXPUESTO, PISO, AC INVERTER)
// Iniciativa Envuelve tu Casa
// =========================================================================

window.SOLUTIONS_CATALOG = {
  "meta": {
    "proyecto": "Iniciativa Envuelve tu Casa",
    "version": "2.0.0",
    "fecha_actualizacion": "2026-11-23",
    "moneda": "CLP",
    "zona_termica": "D (Santiago urbano)",
    "motor_compatible": "thermalEngine.js v2.0",
    "fuente_precios": "Burletes, guardapolvos y selladores: verificados en Sodimac.cl (nov 2026). Obras mayores y equipos: rangos referenciales en Santiago.",
    "advertencia_precios": "Precios referenciales en CLP con IVA en Santiago. En medidas económicas el monto es POR UNIDAD (puerta, ventana, rollo o paño), no por la vivienda completa. En obras mayores, cotiza con 2 o 3 maestros o empresas.",
    "aviso_legal_ui": "Orientación preliminar basada en un modelo simplificado (65% invierno / 35% verano). No reemplaza una Calificación Energética de Viviendas (CEV) oficial del MINVU ni garantiza montos exactos de ahorro en cuentas."
  },
  "tags": [
    {
      "tag": "fuga_techo",
      "etiqueta_usuario": "Pérdida de calor por el techo",
      "explicacion": "El techo es uno de los puntos donde más calor escapa en invierno y por donde más calor entra en verano.",
      "elemento": "techo",
      "temporada_critica": "ambas"
    },
    {
      "tag": "fuga_piso",
      "etiqueta_usuario": "Pérdida de calor por el piso",
      "explicacion": "Los pisos sobre estacionamientos abiertos, pilotes o radier sin aislación enfrían la vivienda desde abajo en invierno.",
      "elemento": "piso",
      "temporada_critica": "invierno"
    },
    {
      "tag": "muro_sin_aislacion",
      "etiqueta_usuario": "Muros exteriores sin aislación",
      "explicacion": "Los muros de ladrillo, hormigón, tabique o adobe sin aislación dejan pasar el frío exterior y enfrían las habitaciones.",
      "elemento": "muros",
      "temporada_critica": "invierno"
    },
    {
      "tag": "puente_termico_muro",
      "etiqueta_usuario": "Posibles puntos fríos en bordes de muros",
      "explicacion": "Incluso con aislación interior, esquinas, pilares y losas pueden quedar más fríos que el resto del muro.",
      "elemento": "muros",
      "temporada_critica": "invierno"
    },
    {
      "tag": "vidrio_simple",
      "etiqueta_usuario": "Ventanas con vidrio simple",
      "explicacion": "Un vidrio simple (U ≈ 5,8 W/m²K) deja pasar cerca del doble de calor que un termopanel.",
      "elemento": "ventanas",
      "temporada_critica": "ambas"
    },
    {
      "tag": "marco_metalico_frio",
      "etiqueta_usuario": "Marcos de aluminio común o fierro",
      "explicacion": "El metal sin corte térmico conduce el frío y el calor con facilidad y favorece condensación en los bordes.",
      "elemento": "ventanas",
      "temporada_critica": "invierno"
    },
    {
      "tag": "infiltracion_ventanas",
      "etiqueta_usuario": "Chiflones confirmados en ventanas",
      "explicacion": "Indicaste que entra aire frío por las rendijas, lo que enfría rápidamente los recintos.",
      "elemento": "ventanas",
      "temporada_critica": "invierno"
    },
    {
      "tag": "riesgo_infiltracion_ventanas",
      "etiqueta_usuario": "Riesgo de infiltración en ventanas correderas o antiguas",
      "explicacion": "Aunque hoy no sientas chiflones, este tipo de cierre suele desgastar felpas con el tiempo; conviene inspeccionarlo antes de comprar sellos.",
      "elemento": "ventanas",
      "temporada_critica": "invierno"
    },
    {
      "tag": "infiltracion_puerta",
      "etiqueta_usuario": "Chiflones confirmados en puerta exterior",
      "explicacion": "Entra aire frío por el marco o por debajo de la hoja, generando corrientes heladas a ras de piso.",
      "elemento": "puertas",
      "temporada_critica": "invierno"
    },
    {
      "tag": "puerta_poco_aislada",
      "etiqueta_usuario": "Puerta exterior de baja aislación",
      "explicacion": "Una puerta hueca, metálica o con vidrio simple conduce más frío que una de madera sólida, aunque esté bien sellada.",
      "elemento": "puertas",
      "temporada_critica": "invierno"
    },
    {
      "tag": "humedad_condensacion",
      "etiqueta_usuario": "Humedad, condensación o moho reportado",
      "explicacion": "Reportaste agua en vidrios o manchas de humedad/hongos en invierno; requiere ventilar a diario y tratar la superficie afectada.",
      "elemento": "muros",
      "temporada_critica": "invierno"
    },
    {
      "tag": "sobrecalentamiento_poniente",
      "etiqueta_usuario": "Sobrecalentamiento por sol de tarde (Poniente)",
      "explicacion": "El sol bajo de la tarde pega directo al poniente en verano y eleva la temperatura interior.",
      "elemento": "entorno_solar",
      "temporada_critica": "verano"
    },
    {
      "tag": "frio_orientacion_sur",
      "etiqueta_usuario": "Recintos al Sur con poca ganancia solar",
      "explicacion": "La fachada sur casi no recibe sol directo en invierno, manteniéndose más fría que el resto de la vivienda.",
      "elemento": "entorno_solar",
      "temporada_critica": "invierno"
    },
    {
      "tag": "falta_sombra_solar",
      "etiqueta_usuario": "Falta de protección solar exterior efectiva",
      "explicacion": "Sin un alero o sombra que realmente tape el vidrio en verano, la radiación solar directa recalienta los recintos.",
      "elemento": "entorno_solar",
      "temporada_critica": "verano"
    }
  ],
  "soluciones": [
    {
      "id": "B01_burlete_perimetral_puerta",
      "nombre": "Burlete autoadhesivo en el marco de la puerta",
      "descripcion_corta": "Burlete autoadhesivo en el marco de la puerta de entrada. Corta las rendijas por donde se cuela el aire frío.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_puerta"
      ],
      "requiere_alguno": {
        "sienteChiflon": [
          true
        ]
      },
      "elemento": "puertas",
      "impacto": "medio",
      "impacto_termico_1_10": 5,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 3500,
        "max_clp": 12000,
        "tipico_clp": 6000,
        "unidad": "por puerta",
        "precio_unitario_texto": "$3.500 – $12.000 por puerta",
        "total_referencial_texto": "1 puerta de entrada (~5 m de burlete): ~$6.000",
        "caso_tipico": "Puerta de entrada estándar, unos 5 metros de burlete de espuma o goma"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Corta el aire frío que entra por las rendijas confirmadas entre la puerta y su marco.",
      "tip_practico": "Limpia el marco con un paño seco antes de pegar. Pega el burlete por el marco, no por la hoja, y cierra suavemente para que se asiente.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B02_guardapolvo_bajo_puerta",
      "nombre": "Guardapolvo o burlete bajo la puerta",
      "descripcion_corta": "Guardapolvo o tira de goma bajo la puerta. Tapa el espacio con el piso, por donde entra el chiflón más fuerte.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_puerta"
      ],
      "requiere_alguno": {
        "sienteChiflon": [
          true
        ]
      },
      "elemento": "puertas",
      "impacto": "medio",
      "impacto_termico_1_10": 4,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 2000,
        "max_clp": 5000,
        "tipico_clp": 3500,
        "unidad": "por puerta",
        "precio_unitario_texto": "$2.000 – $5.000 por puerta",
        "total_referencial_texto": "1 puerta de entrada (1 tira de 1 m): ~$3.500",
        "caso_tipico": "Guardapolvo de cepillo o tira de goma de 1 metro"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Tapa el espacio entre el borde inferior de la puerta y el piso por donde entra el chiflón.",
      "tip_practico": "Mide el ancho de la hoja y corta la tira. Usa cepillo si el piso es irregular o goma si es liso.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B03_burlete_ventanas",
      "nombre": "Burlete de espuma o felpa en ventanas",
      "descripcion_corta": "Burlete de espuma o felpa en los bordes de la ventana. Reduce el aire que se cuela en ventanas correderas o antiguas.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_ventanas",
        "riesgo_infiltracion_ventanas"
      ],
      "excluir_si": {
        "cierreVentana": [
          "fija"
        ]
      },
      "elemento": "ventanas",
      "impacto": "medio",
      "impacto_termico_1_10": 5,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 1500,
        "max_clp": 8000,
        "tipico_clp": 4000,
        "unidad": "por ventana",
        "precio_unitario_texto": "$1.500 – $8.000 por ventana",
        "total_referencial_texto": "1 ventana prioritaria: ~$4.000 (4 ventanas: ~$16.000)",
        "caso_tipico": "Ventana mediana de 1,2 x 1,2 m, 2 o 3 rollos de burlete"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Reduce la entrada de aire por los rieles o bordes de ventanas móviles con sellos gastados.",
      "tip_practico": "En ventanas correderas usa burlete de felpa en los rieles; en ventanas de abatir usa espuma adhesiva en el marco. Si hoy no sientes chiflones, haz primero la prueba de la mano mojada en un día de viento antes de comprar.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B04_sellador_silicona_perimetral",
      "nombre": "Sellado con silicona o sellador acrílico alrededor del marco",
      "descripcion_corta": "Silicona o sellador acrílico alrededor del marco. Cierra grietas confirmadas entre el marco y el muro.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_ventanas",
        "infiltracion_puerta"
      ],
      "requiere_alguno": {
        "sienteChiflon": [
          true
        ]
      },
      "elemento": "ventanas",
      "impacto": "medio",
      "impacto_termico_1_10": 4,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 3000,
        "max_clp": 7000,
        "tipico_clp": 4500,
        "unidad": "por cartucho",
        "precio_unitario_texto": "$3.000 – $7.000 por cartucho",
        "total_referencial_texto": "1 cartucho rinde 2 a 3 ventanas: ~$4.500",
        "caso_tipico": "Cartucho de silicona o sellador acrílico pintable"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Cierra grietas o uniones abiertas entre el marco de puertas/ventanas y el muro cuando existen filtraciones de aire.",
      "tip_practico": "Raspa el sellador viejo, limpia y seca bien. Aplica un cordón parejo donde detectes entrada de aire y alisa con agua jabonosa.",
      "precaucion": "No selles los orificios de drenaje del riel inferior ni las rejillas de ventilación de cocina o baño.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B05_espuma_pu_rendijas",
      "nombre": "Espuma de poliuretano para huecos grandes y cajón de persiana",
      "descripcion_corta": "Espuma de poliuretano para huecos grandes (cajón de persiana, pasadas, uniones) donde el burlete no alcanza.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_ventanas",
        "infiltracion_puerta"
      ],
      "requiere_alguno": {
        "sienteChiflon": [
          true
        ]
      },
      "elemento": "ventanas",
      "impacto": "medio",
      "impacto_termico_1_10": 4,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 3500,
        "max_clp": 9000,
        "tipico_clp": 5500,
        "unidad": "por lata",
        "precio_unitario_texto": "$3.500 – $9.000 por lata",
        "total_referencial_texto": "1 lata para varios huecos/cajones: ~$5.500",
        "caso_tipico": "Una lata de espuma expansiva para sellar cajón de persiana y uniones marco-muro"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Rellena huecos grandes confirmados que el burlete no alcanza: cajones de persiana, pasadas de cañerías y separaciones marco-muro.",
      "tip_practico": "Aplica poca cantidad porque se expande. Espera que seque, recorta el sobrante y cúbrela con sellador o pintura para protegerla del sol.",
      "precaucion": "Usa guantes y ventila: la espuma fresca es irritante y se adhiere con fuerza a la piel.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B06_sellar_escotilla_y_pasadas_cielo",
      "nombre": "Sellar la escotilla del entretecho y pasadas del cielo",
      "descripcion_corta": "Burlete en la escotilla y sello en pasadas del cielo. Etapa 1 económica para frenar fugas hacia el entretecho.",
      "categoria": "bajo_costo",
      "tags": [
        "fuga_techo"
      ],
      "excluir_si": {
        "techo": [
          "adiabatico",
          "aislacion_alta"
        ]
      },
      "grupo_alternativa": "techo_etapas",
      "etiqueta_alternativa": "Etapa 1 (sellado inicial) — complementaria a aislar el cielo",
      "elemento": "techo",
      "impacto": "medio",
      "impacto_termico_1_10": 4,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$",
        "min_clp": 5000,
        "max_clp": 15000,
        "tipico_clp": 9000,
        "unidad": "por vivienda",
        "precio_unitario_texto": "$5.000 – $15.000 por vivienda",
        "total_referencial_texto": "1 escotilla + pasadas del cielo: ~$9.000",
        "caso_tipico": "Burlete en el marco de la escotilla y sello de pasadas de cañerías en el cielo"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua"
      ],
      "problema_que_ataca": "Evita que el aire caliente se escape hacia el entretecho por la tapa de acceso y rendijas del cielo.",
      "tip_practico": "Pega burlete en el marco de la tapa y coloca encima una capa de lana mineral (material no combustible) sujeta a la tapa.",
      "precaucion": "No cubras focos embutidos ni cajas eléctricas con aislante para evitar sobrecalentamiento.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B07_film_termico_ventana",
      "nombre": "Kit de film aislante termorretráctil para ventanas (invierno)",
      "descripcion_corta": "Film plástico transparente pegado al marco que crea una cámara de aire quieto frente al vidrio simple.",
      "categoria": "bajo_costo",
      "tags": [
        "vidrio_simple"
      ],
      "excluir_si": {
        "vidrio": [
          "doble_ventana",
          "dvh_basico",
          "dvh_alto"
        ]
      },
      "grupo_alternativa": "film_ventana",
      "etiqueta_alternativa": "Alternativa para invierno (no combinar con film solar en el mismo vidrio)",
      "elemento": "ventanas",
      "impacto": "medio",
      "impacto_termico_1_10": 5,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 6000,
        "max_clp": 15000,
        "tipico_clp": 9000,
        "unidad": "por ventana",
        "precio_unitario_texto": "$6.000 – $15.000 por ventana",
        "total_referencial_texto": "1 ventana prioritaria: ~$9.000 (3 ventanas: ~$27.000)",
        "caso_tipico": "Kit de film plástico con cinta doble contacto, para ventana de 1,2 x 1,2 m"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Crea una cámara de aire quieto frente al vidrio simple, frenando la pérdida de calor en invierno sin cambiar la ventana.",
      "tip_practico": "Pega la cinta por el interior del marco, estira el film y dale calor con secador de pelo para tensarlo. Se instala en otoño y se retira en primavera.",
      "precaucion": "No cubras ventanas que sean salida de emergencia o que necesites abrir diariamente para ventilar.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B08_cortinas_termicas",
      "nombre": "Cortinas térmicas o con forro blackout",
      "descripcion_corta": "Cortinas gruesas con respaldo térmico. Guardan calor de noche en invierno y frenan el sol en verano.",
      "categoria": "bajo_costo",
      "tags": [
        "vidrio_simple",
        "frio_orientacion_sur",
        "marco_metalico_frio",
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "elemento": "ventanas",
      "impacto": "medio",
      "impacto_termico_1_10": 5,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$",
        "min_clp": 12000,
        "max_clp": 29000,
        "tipico_clp": 20000,
        "unidad": "por ventana",
        "precio_unitario_texto": "$12.000 – $29.000 por ventana",
        "total_referencial_texto": "1 ventana prioritaria: ~$20.000 (3 ventanas: ~$60.000)",
        "caso_tipico": "Cortina con forro térmico o blackout, de largo hasta el piso"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Agrega una barrera textil frente al vidrio y al marco metálico frío: retiene calor en noches de invierno y frena sol de tarde en verano.",
      "tip_practico": "Elige una cortina 15 cm más ancha que la ventana por lado. En invierno ábrela con sol y ciérrala al atardecer; en verano ciérrala al poniente desde el mediodía con el lado claro hacia afuera.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, tiendas de telas y hogar",
      "subsidio_ds27": "no"
    },
    {
      "id": "B09_film_control_solar",
      "nombre": "Film reflectante de control solar (solo vidrio simple al Poniente/Oriente)",
      "descripcion_corta": "Film reflectante en el vidrio simple que rebota el sol de tarde en verano. No recomendado en fachadas al Norte.",
      "categoria": "bajo_costo",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "excluir_si": {
        "vidrio": [
          "dvh_basico",
          "dvh_alto"
        ],
        "orientacionPrincipal": [
          "norte",
          "sur"
        ]
      },
      "grupo_alternativa": "film_ventana",
      "etiqueta_alternativa": "Alternativa para verano al Poniente (no usar en ventanas al Norte)",
      "elemento": "ventanas",
      "impacto": "alto",
      "impacto_termico_1_10": 6,
      "temporada": "verano",
      "costo": {
        "simbolo": "$",
        "min_clp": 8000,
        "max_clp": 25000,
        "tipico_clp": 15000,
        "unidad": "por ventana",
        "precio_unitario_texto": "$8.000 – $25.000 por ventana",
        "total_referencial_texto": "1 ventana al poniente: ~$15.000 (2 ventanas: ~$30.000)",
        "caso_tipico": "Film adhesivo o electrostático removible, ventana de 1,2 x 1,2 m"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Rebota parte del sol intenso de la tarde antes de que atraviese el vidrio simple y sobrecaliente la pieza.",
      "tip_practico": "Aplícalo con agua jabonosa y espátula blanda solo en ventanas al poniente. Prefiere film electrostático removible si arriendas.",
      "precaucion": "No apliques láminas reflectantes sobre termopanel (DVH) por riesgo de rotura térmica, ni en ventanas al Norte porque quitan el sol gratuito del invierno.",
      "donde_comprar": "Sodimac, Easy, tiendas de vidrios y ferreterías",
      "subsidio_ds27": "no"
    },
    {
      "id": "B10_malla_raschel_sombra",
      "nombre": "Malla raschel o toldo liviano exterior (Poniente)",
      "descripcion_corta": "Malla raschel removible por fuera de la ventana al poniente. Detiene el sol antes de que toque el vidrio.",
      "categoria": "bajo_costo",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "excluir_si": {
        "tieneAleroOToldo": [
          "completo"
        ],
        "nivelSombraEntorno": [
          "muy_sombreado"
        ],
        "orientacionPrincipal": [
          "norte",
          "sur"
        ]
      },
      "grupo_alternativa": "sombra_exterior",
      "etiqueta_alternativa": "Alternativa económica removible (elige entre malla raschel, enredadera o toldo)",
      "elemento": "entorno_solar",
      "impacto": "alto",
      "impacto_termico_1_10": 6,
      "temporada": "verano",
      "costo": {
        "simbolo": "$",
        "min_clp": 6000,
        "max_clp": 25000,
        "tipico_clp": 12000,
        "unidad": "por paño 2x2 m",
        "precio_unitario_texto": "$6.000 – $25.000 por paño (2 x 2 m)",
        "total_referencial_texto": "1 paño para ventana/balcón poniente: ~$12.000",
        "caso_tipico": "Malla raschel de 80% sombra con ganchos removibles en fachada poniente"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Sombrea el vidrio desde afuera, evitando el efecto invernadero durante las tardes calurosas de verano.",
      "tip_practico": "Instálala separada unos 20 cm del vidrio para que circule el aire y retírala en invierno.",
      "precaucion": "En balcones de edificios pide autorización a la administración y asegúrala bien frente a ráfagas de viento.",
      "donde_comprar": "Sodimac, Easy, ferreterías y viveros",
      "subsidio_ds27": "no"
    },
    {
      "id": "B11_panel_reflectante_ignifugo",
      "nombre": "Lámina reflectante térmica ignífuga detrás de estufas o radiadores",
      "descripcion_corta": "Panel reflectante no combustible colocado entre calefactores de pared/radiadores y muros exteriores sin aislación.",
      "categoria": "bajo_costo",
      "tags": [
        "muro_sin_aislacion",
        "frio_orientacion_sur"
      ],
      "excluir_si": {
        "materialMuro": [
          "muro_aislacion_exterior"
        ],
        "calefaccionActual": [
          "sin_calefaccion",
          "aire_acondicionado_inverter"
        ]
      },
      "elemento": "muros",
      "impacto": "bajo",
      "impacto_termico_1_10": 3,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 8000,
        "max_clp": 22000,
        "tipico_clp": 14000,
        "unidad": "por rollo (2 a 3 equipos)",
        "precio_unitario_texto": "$8.000 – $22.000 por rollo",
        "total_referencial_texto": "1 rollo para 2 o 3 estufas/radiadores: ~$14.000",
        "caso_tipico": "Lámina reflectante de aluminio con respaldo mineral ignífugo detrás de radiador o panel mural"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Devuelve hacia la habitación el calor que normalmente se pierde a través de muros exteriores fríos detrás de radiadores o estufas murales.",
      "tip_practico": "Instala solo productos certificados para calor (lámina metálica con núcleo mineral o fibra de vidrio, nunca poliestireno expuesto) respetando las distancias de seguridad del fabricante.",
      "precaucion": "Nunca uses poliestireno (plumavit) ni materiales inflamables expuestos en muros interiores o cerca de estufas.",
      "donde_comprar": "Sodimac, Easy, tiendas de climatización",
      "subsidio_ds27": "no"
    },
    {
      "id": "B12_antihongos_y_ventilacion",
      "nombre": "Limpieza y pintura antihongos en zonas con humedad o moho",
      "descripcion_corta": "Limpieza y pintura antihongos para las manchas de humedad reportadas. Cuida la salud; debe combinarse con ventilación diaria.",
      "categoria": "bajo_costo",
      "tags": [
        "humedad_condensacion"
      ],
      "requiere_alguno": {
        "humedadCondensacion": [
          true
        ]
      },
      "elemento": "muros",
      "impacto": "bajo",
      "impacto_termico_1_10": 2,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 8000,
        "max_clp": 25000,
        "tipico_clp": 15000,
        "unidad": "por pieza afectada",
        "precio_unitario_texto": "$8.000 – $25.000 por pieza",
        "total_referencial_texto": "1 pieza afectada (limpiador + pintura): ~$15.000",
        "caso_tipico": "Producto antihongos y pintura antihongos para una esquina o pared"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Trata la humedad y el moho reportados en esquinas o muros fríos. Cuida la salud, aunque es un paliativo y no reemplaza aislar ni ventilar.",
      "tip_practico": "Limpia primero con producto antihongos, deja secar bien y pinta. Ventila 10 minutos cada día al mediodía para bajar la humedad interior.",
      "precaucion": "Usa guantes y mascarilla al aplicar. Si el moho reaparece rápido, revisa si existe filtración de agua o puente térmico severo.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B13_lana_mineral_parcial_cielo",
      "nombre": "Rollos de lana mineral sobre el cielo de la pieza más fría",
      "descripcion_corta": "Rollos de lana mineral sobre un dormitorio prioritario. Etapa económica para empezar a aislar un techo sin aislación.",
      "categoria": "bajo_costo",
      "tags": [
        "fuga_techo"
      ],
      "excluir_si": {
        "techo": [
          "adiabatico",
          "aislacion_estandar",
          "aislacion_alta"
        ]
      },
      "grupo_alternativa": "techo_etapas",
      "etiqueta_alternativa": "Etapa parcial por habitación (alternativa gradual a aislar toda la casa)",
      "elemento": "techo",
      "impacto": "medio",
      "impacto_termico_1_10": 6,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$",
        "min_clp": 15000,
        "max_clp": 29000,
        "tipico_clp": 22000,
        "unidad": "por rollo (~7–12 m²)",
        "precio_unitario_texto": "$15.000 – $29.000 por rollo",
        "total_referencial_texto": "1 rollo (1 dormitorio ~10 m²): ~$22.000 (casa 40 m²: ~$88.000 en materiales)",
        "caso_tipico": "1 rollo de lana mineral o de vidrio sin papel tendido sobre el dormitorio más frío"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua"
      ],
      "problema_que_ataca": "Permite comenzar a frenar la pérdida de calor por el techo en la pieza que más usas mientras juntas presupuesto para cubrir toda la casa.",
      "tip_practico": "Tiende los rollos sin aplastarlos y bien juntos sin dejar rendijas. Revisa en la etiqueta cuántos m² cubre cada rollo.",
      "precaucion": "Usa guantes, mascarilla y lentes. Pisa solo sobre vigas, nunca sobre el cielo falso, y no cubras focos embutidos ni cajas eléctricas.",
      "donde_comprar": "Sodimac, Easy",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "B14_enredadera_o_planta_caducifolia",
      "nombre": "Enredadera de hoja caduca frente a fachada Poniente",
      "descripcion_corta": "Enredadera realmente caducifolia (parra, glicinia o ampelopsis) frente al poniente: da sombra en verano y deja pasar el sol en invierno.",
      "categoria": "bajo_costo",
      "tags": [
        "falta_sombra_solar",
        "sobrecalentamiento_poniente"
      ],
      "excluir_si": {
        "tieneAleroOToldo": [
          "completo"
        ],
        "nivelSombraEntorno": [
          "muy_sombreado"
        ],
        "orientacionPrincipal": [
          "norte",
          "sur"
        ]
      },
      "grupo_alternativa": "sombra_exterior",
      "etiqueta_alternativa": "Alternativa natural (elige entre malla raschel, enredadera o toldo)",
      "elemento": "entorno_solar",
      "impacto": "medio",
      "impacto_termico_1_10": 3,
      "temporada": "verano",
      "costo": {
        "simbolo": "$",
        "min_clp": 5000,
        "max_clp": 30000,
        "tipico_clp": 15000,
        "unidad": "por planta con maceta y guía",
        "precio_unitario_texto": "$5.000 – $30.000 por planta y guía",
        "total_referencial_texto": "1 planta caducifolia con tutor/malla: ~$15.000",
        "caso_tipico": "Parra (vid), glicinia (Wisteria sinensis) o ampelopsis (enredadera virgen) con tutor o malla"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Genera sombra vegetal fresca en tardes de verano y bota sus hojas en invierno para no restar luz ni calor.",
      "tip_practico": "Elige especies verdaderamente caducifolias adaptadas a Santiago como parra (vid), glicinia o ampelopsis (enredadera virgen). Demora 1 a 2 temporadas en cubrir bien.",
      "precaucion": "Evita especies de hoja perenne (como hiedra o jazmín del cabo) frente a ventanas que necesiten sol en invierno.",
      "donde_comprar": "Viveros locales, Sodimac, Easy",
      "subsidio_ds27": "no"
    },
    {
      "id": "B15_cortina_gruesa_puerta",
      "nombre": "Cortina gruesa sobre la puerta de entrada",
      "descripcion_corta": "Cortina de tela gruesa frente a la puerta de entrada. Frena parte del chiflón y del frío sin modificar la puerta.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_puerta",
        "puerta_poco_aislada"
      ],
      "requiere_alguno": {
        "sienteChiflon": [
          true
        ],
        "puerta": [
          "madera_entablerada",
          "con_vidrio_parcial",
          "metal_o_vidrio_total"
        ]
      },
      "elemento": "puertas",
      "impacto": "bajo",
      "impacto_termico_1_10": 3,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 8000,
        "max_clp": 20000,
        "tipico_clp": 12000,
        "unidad": "por puerta",
        "precio_unitario_texto": "$8.000 – $20.000 por puerta",
        "total_referencial_texto": "1 puerta de entrada (cortina + tensor): ~$12.000",
        "caso_tipico": "Cortina de tela gruesa o con forro, con barra o tensor de resorte"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Atenúa el frío que entra por puertas huecas, metálicas, vidriadas o con filtraciones sin intervenir ni perforar la hoja.",
      "tip_practico": "Cuélgala unos 10 cm sobre el marco hasta casi tocar el piso. Ideal para arrendatarios como complemento a burletes.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, tiendas de hogar",
      "subsidio_ds27": "no"
    },
    {
      "id": "B16_alfombra_aislante_piso",
      "nombre": "Alfombra gruesa o base aislante en pisos fríos (1er piso / casas)",
      "descripcion_corta": "Alfombra densa o bajo-alfombra de fieltro en living y dormitorios sobre radier o estacionamientos fríos.",
      "categoria": "bajo_costo",
      "tags": [
        "fuga_piso"
      ],
      "excluir_si": {
        "piso": [
          "adiabatico",
          "piso_aislado"
        ]
      },
      "elemento": "piso",
      "impacto": "medio",
      "impacto_termico_1_10": 4,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 12000,
        "max_clp": 29000,
        "tipico_clp": 20000,
        "unidad": "por recinto (alfombra mediana)",
        "precio_unitario_texto": "$12.000 – $29.000 por recinto",
        "total_referencial_texto": "1 alfombra/base aislante para living o dormitorio: ~$20.000",
        "caso_tipico": "Alfombra gruesa o base de fieltro/espuma bajo alfombra en zona de estar o junto a la cama"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Reduce la pérdida de calor por contacto hacia pisos fríos de cerámica, baldosa o radier sobre tierra o estacionamientos.",
      "tip_practico": "Prioriza las zonas donde permaneces sentado o donde bajas los pies de la cama. Agregar un bajo-alfombra de fieltro duplica el confort.",
      "precaucion": "Asegura las esquinas con malla antideslizante para evitar tropiezos.",
      "donde_comprar": "Sodimac, Easy, tiendas de hogar",
      "subsidio_ds27": "no"
    },
    {
      "id": "A01_aislacion_cielo_lana_mineral",
      "nombre": "Aislación completa del techo con lana mineral de 10 a 14 cm",
      "descripcion_corta": "Lana mineral de 10 a 14 cm en todo el cielo, instalada por un maestro. Es la medida pasiva más efectiva en casas.",
      "categoria": "alto_impacto",
      "tags": [
        "fuga_techo"
      ],
      "excluir_si": {
        "techo": [
          "adiabatico",
          "aislacion_estandar",
          "aislacion_alta"
        ]
      },
      "grupo_alternativa": "techo_etapas",
      "etiqueta_alternativa": "Solución definitiva completa para techo de casa",
      "elemento": "techo",
      "impacto": "alto",
      "impacto_termico_1_10": 10,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 280000,
        "max_clp": 600000,
        "tipico_clp": 400000,
        "unidad": "vivienda referencial (~40 m²)",
        "precio_unitario_texto": "$7.000 – $15.000 por m² instalado",
        "total_referencial_texto": "Total referencial casa ~40 m²: $280.000 – $600.000",
        "caso_tipico": "40 m² de cielo con lana mineral de 100 a 140 mm e instalación"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua"
      ],
      "problema_que_ataca": "Frena la principal fuga de calor en invierno y el sobrecalentamiento del techo en verano.",
      "tip_practico": "Pide aislación continua de 10 a 14 cm sin huecos, con barrera de vapor hacia el interior y respetando la ventilación del entretecho.",
      "precaucion": "Pide al instalador revisar antes el estado eléctrico y focos embutidos del cielo.",
      "donde_comprar": "Maestros e instaladores; materiales en Sodimac y Easy",
      "subsidio_ds27": "si"
    },
    {
      "id": "A02_aislacion_losa_techo_plano",
      "nombre": "Aislación sobre losa o techo plano con planchas aislantes",
      "descripcion_corta": "Planchas aislantes sobre losa con impermeabilización. Corrige el frío y calor extremo en departamentos de último piso.",
      "categoria": "alto_impacto",
      "tags": [
        "fuga_techo"
      ],
      "excluir_si": {
        "techo": [
          "adiabatico",
          "aislacion_estandar",
          "aislacion_alta"
        ]
      },
      "elemento": "techo",
      "impacto": "alto",
      "impacto_termico_1_10": 9,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 600000,
        "max_clp": 1350000,
        "tipico_clp": 900000,
        "unidad": "depto referencial (~30 m²)",
        "precio_unitario_texto": "$20.000 – $45.000 por m² instalado",
        "total_referencial_texto": "Total referencial losa ~30 m²: $600.000 – $1.350.000",
        "caso_tipico": "30 m² de losa expuesta con aislación e impermeabilización"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "depto_ultimo_piso"
      ],
      "problema_que_ataca": "Corrige el calor y frío que atraviesan una losa de hormigón sin aislación en últimos pisos.",
      "tip_practico": "En edificios la cubierta es bien común: requiere acuerdo del Comité de Administración (postulable colectivamente a DS 27).",
      "precaucion": "Repara cualquier filtración de agua antes de aislar para no atrapar humedad.",
      "donde_comprar": "Empresas de aislación e impermeabilización",
      "subsidio_ds27": "si"
    },
    {
      "id": "A03_aislacion_termica_exterior_muros",
      "nombre": "Aislación exterior de muros (sistema EIFS o similar)",
      "descripcion_corta": "Capa aislante continua por fuera del muro (EIFS). Corrige muros fríos y elimina puentes térmicos en pilares y losas.",
      "categoria": "alto_impacto",
      "tags": [
        "muro_sin_aislacion",
        "puente_termico_muro"
      ],
      "excluir_si": {
        "materialMuro": [
          "muro_aislacion_exterior"
        ]
      },
      "grupo_alternativa": "aislacion_muro",
      "etiqueta_alternativa": "Alternativa A para muros (por fuera — no combinar con trasdosado interior)",
      "elemento": "muros",
      "impacto": "alto",
      "impacto_termico_1_10": 9,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 1400000,
        "max_clp": 2600000,
        "tipico_clp": 2000000,
        "unidad": "fachada referencial (~40 m²)",
        "precio_unitario_texto": "$35.000 – $65.000 por m² instalado",
        "total_referencial_texto": "Total referencial ~40 m² fachada: $1.400.000 – $2.600.000",
        "caso_tipico": "40 m² de fachada con aislación exterior continua y terminación elastomérica"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Envuelve el muro por fuera, mejorando la aislación y eliminando puentes térmicos de pilares, vigas y esquinas.",
      "tip_practico": "Es la solución técnica más completa para muros; por su costo conviene postularla mediante Subsidio DS 27 Cap. IV.",
      "precaucion": "Requiere instalador especializado; una mala terminación puede agrietarse y filtrar lluvia.",
      "donde_comprar": "Empresas constructoras y Entidades Patrocinantes (EP)",
      "subsidio_ds27": "si"
    },
    {
      "id": "A04_trasdosado_interior_muros",
      "nombre": "Aislación interior de muros con revestimiento certificado (trasdosado)",
      "descripcion_corta": "Lana mineral + barrera de vapor + placa de yeso-cartón ignífuga por dentro del muro. Útil cuando no se puede intervenir la fachada.",
      "categoria": "alto_impacto",
      "tags": [
        "muro_sin_aislacion"
      ],
      "excluir_si": {
        "materialMuro": [
          "muro_aislacion_interior",
          "muro_aislacion_exterior"
        ]
      },
      "grupo_alternativa": "aislacion_muro",
      "etiqueta_alternativa": "Alternativa B para muros (por dentro — elegir solo A o B)",
      "elemento": "muros",
      "impacto": "alto",
      "impacto_termico_1_10": 7,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 880000,
        "max_clp": 1600000,
        "tipico_clp": 1200000,
        "unidad": "muros referenciales (~40 m²)",
        "precio_unitario_texto": "$22.000 – $40.000 por m² instalado",
        "total_referencial_texto": "Total referencial ~40 m² muros: $880.000 – $1.600.000 (1 muro ~10 m²: ~$300.000)",
        "caso_tipico": "40 m² de muros exteriores con lana mineral, barrera de vapor y yeso-cartón"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Aísla muros sin aislación desde el interior cuando no se puede intervenir la fachada (edificios o casas pareadas/continuas).",
      "tip_practico": "Exige siempre barrera de vapor hacia el lado tibio (evaluación higrotérmica) y placa de yeso-cartón sellada como barrera ignífuga. Parte por el dormitorio más frío.",
      "precaucion": "Nunca dejes aislantes combustibles expuestos; requiere terminación de yeso-cartón y buena ventilación para evitar condensación oculta.",
      "donde_comprar": "Maestros e instaladores; materiales en Sodimac y Easy",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "A05_termopanel_ventanas_pvc",
      "nombre": "Ventanas nuevas de PVC con termopanel (DVH)",
      "descripcion_corta": "Ventanas de PVC con doble vidriado hermético. Reemplaza vidrio simple y marco metálico frío de una sola vez.",
      "categoria": "alto_impacto",
      "tags": [
        "vidrio_simple",
        "marco_metalico_frio"
      ],
      "excluir_si": {
        "vidrio": [
          "dvh_basico",
          "dvh_alto"
        ]
      },
      "grupo_alternativa": "mejora_ventanas",
      "etiqueta_alternativa": "Alternativa A para ventanas (recambio completo — elegir A o B)",
      "elemento": "ventanas",
      "impacto": "alto",
      "impacto_termico_1_10": 9,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 700000,
        "max_clp": 1400000,
        "tipico_clp": 1000000,
        "unidad": "3 ventanas (~5 m²)",
        "precio_unitario_texto": "$140.000 – $280.000 por m² instalado",
        "total_referencial_texto": "Total referencial 3 ventanas (~5 m²): $700.000 – $1.400.000",
        "caso_tipico": "3 ventanas (~5 m² en total) con marco PVC y termopanel instalado"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Reduce casi a la mitad la transmitancia térmica frente al vidrio simple (de U 5,80 a ~2,80 W/m²K según Manual CEV) y elimina marcos metálicos fríos.",
      "tip_practico": "Prioriza dormitorios y fachada sur o poniente. Prefiere cierres proyectantes o abatibles antes que correderas.",
      "precaucion": "En departamentos, cambiar diseño o color de ventanas de fachada requiere autorización de la comunidad.",
      "donde_comprar": "Fabricantes de ventanas PVC; cotizar con 3 proveedores",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "A06_sobreventana_doble_ventana",
      "nombre": "Sobreventana interior (doble ventana)",
      "descripcion_corta": "Segunda ventana por dentro sin retirar la actual. Baja el U de 5,80 a ~3,30 W/m²K a menor costo que el termopanel.",
      "categoria": "alto_impacto",
      "tags": [
        "vidrio_simple"
      ],
      "excluir_si": {
        "vidrio": [
          "doble_ventana",
          "dvh_basico",
          "dvh_alto"
        ]
      },
      "grupo_alternativa": "mejora_ventanas",
      "etiqueta_alternativa": "Alternativa B para ventanas (más económica — elegir A o B)",
      "elemento": "ventanas",
      "impacto": "alto",
      "impacto_termico_1_10": 7,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$",
        "min_clp": 300000,
        "max_clp": 650000,
        "tipico_clp": 450000,
        "unidad": "3 ventanas (~5 m²)",
        "precio_unitario_texto": "$60.000 – $130.000 por m² instalado",
        "total_referencial_texto": "Total referencial 3 ventanas (~5 m²): $300.000 – $650.000",
        "caso_tipico": "5 m² de ventanas con segunda hoja interior sellada"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Crea una cámara de aire aislante sin tocar la fachada exterior (Manual CEV: baja U de 5,80 a 3,30 W/m²K).",
      "tip_practico": "Muy útil en edificios patrimoniales o comunidades donde no permiten cambiar la ventana exterior.",
      "precaucion": null,
      "donde_comprar": "Talleres de aluminio y PVC",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "A07_ajuste_y_mantencion_ventanas",
      "nombre": "Ajuste de herrajes y recambio profesional de felpas/burletes",
      "descripcion_corta": "Un técnico ajusta carros, pestillos y repone burletes en ventanas con chiflones confirmados o guillotinas antiguas.",
      "categoria": "alto_impacto",
      "tags": [
        "infiltracion_ventanas",
        "riesgo_infiltracion_ventanas"
      ],
      "excluir_si": {
        "cierreVentana": [
          "fija"
        ]
      },
      "requiere_alguno": {
        "sienteChiflon": [
          true
        ],
        "cierreVentana": [
          "guillotina_antigua"
        ]
      },
      "elemento": "ventanas",
      "impacto": "medio",
      "impacto_termico_1_10": 5,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$",
        "min_clp": 30000,
        "max_clp": 90000,
        "tipico_clp": 50000,
        "unidad": "por ventana",
        "precio_unitario_texto": "$30.000 – $90.000 por ventana",
        "total_referencial_texto": "1 a 3 ventanas críticas: $50.000 – $150.000",
        "caso_tipico": "Ajuste de ruedas, pestillos, cambio de felpas y sellado por técnico"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Devuelve la hermeticidad a ventanas correderas o antiguas con chiflones sin tener que reemplazar toda la ventana.",
      "tip_practico": "Excelente opción si tus vidrios ya son termopanel pero la ventana descuadrada deja pasar aire.",
      "precaucion": null,
      "donde_comprar": "Técnicos de ventanas PVC/aluminio y carpinteros",
      "subsidio_ds27": "no"
    },
    {
      "id": "A08_puerta_exterior_nueva",
      "nombre": "Puerta exterior de madera sólida o núcleo aislante con burlete",
      "descripcion_corta": "Reemplaza una puerta hueca, metálica o con vidrio simple por una de madera maciza (U 1,70 vs 2,63 W/m²K en Manual CEV).",
      "categoria": "alto_impacto",
      "tags": [
        "puerta_poco_aislada"
      ],
      "excluir_si": {
        "puerta": [
          "madera_solida"
        ]
      },
      "elemento": "puertas",
      "impacto": "medio",
      "impacto_termico_1_10": 6,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$",
        "min_clp": 120000,
        "max_clp": 350000,
        "tipico_clp": 200000,
        "unidad": "por puerta instalada",
        "precio_unitario_texto": "$120.000 – $350.000 por puerta instalada",
        "total_referencial_texto": "1 puerta principal instalada: ~$200.000",
        "caso_tipico": "Puerta maciza o con relleno aislante, instalada con marco y burletes"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Reduce las pérdidas por conducción térmica de puertas huecas, metálicas o con mucho vidrio simple.",
      "tip_practico": "Si además sientes chiflones, parte sellando con burletes económicos antes de evaluar el cambio completo.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, carpinterías",
      "subsidio_ds27": "no"
    },
    {
      "id": "A09_proteccion_solar_exterior",
      "nombre": "Protección solar exterior retráctil (persiana exterior, celosía o toldo)",
      "descripcion_corta": "Persiana exterior o toldo móvil que bloquea el sol de verano antes del vidrio y se recoge en invierno.",
      "categoria": "alto_impacto",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "excluir_si": {
        "tieneAleroOToldo": [
          "completo"
        ],
        "nivelSombraEntorno": [
          "muy_sombreado"
        ],
        "orientacionPrincipal": [
          "sur"
        ]
      },
      "grupo_alternativa": "sombra_exterior",
      "etiqueta_alternativa": "Alternativa A exterior (retráctil — funciona tanto en Poniente como en Norte)",
      "elemento": "entorno_solar",
      "impacto": "alto",
      "impacto_termico_1_10": 9,
      "temporada": "verano",
      "costo": {
        "simbolo": "$$",
        "min_clp": 60000,
        "max_clp": 250000,
        "tipico_clp": 120000,
        "unidad": "por ventana",
        "precio_unitario_texto": "$60.000 – $250.000 por ventana",
        "total_referencial_texto": "1 a 2 ventanas principales: $120.000 – $240.000",
        "caso_tipico": "Persiana enrollable exterior o toldo retráctil en fachada expuesta"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Detiene el sol antes de que toque el vidrio en verano y se puede recoger en invierno para no perder calor solar.",
      "tip_practico": "En fachadas al Norte, poder recogerlo en invierno es clave para aprovechar el sol bajo gratuito.",
      "precaucion": "En edificios, la instalación en fachada requiere permiso de la administración.",
      "donde_comprar": "Empresas de toldos y persianas exteriores",
      "subsidio_ds27": "no"
    },
    {
      "id": "A10_alero_pergola_vegetacion",
      "nombre": "Alero horizontal, pérgola o árbol caducifolio de sombra",
      "descripcion_corta": "Alero horizontal (ideal al Norte) o pérgola con parra/árbol de hoja caduca para sombrear fachadas de casas en verano.",
      "categoria": "alto_impacto",
      "tags": [
        "falta_sombra_solar",
        "sobrecalentamiento_poniente"
      ],
      "excluir_si": {
        "tieneAleroOToldo": [
          "completo"
        ],
        "nivelSombraEntorno": [
          "muy_sombreado"
        ],
        "orientacionPrincipal": [
          "sur"
        ]
      },
      "grupo_alternativa": "sombra_exterior",
      "etiqueta_alternativa": "Alternativa B exterior fija (solo casas — elegir A o B)",
      "elemento": "entorno_solar",
      "impacto": "alto",
      "impacto_termico_1_10": 7,
      "temporada": "verano",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 150000,
        "max_clp": 600000,
        "tipico_clp": 300000,
        "unidad": "por fachada o patio",
        "precio_unitario_texto": "$150.000 – $600.000 por fachada",
        "total_referencial_texto": "1 alero o pérgola exterior: ~$300.000",
        "caso_tipico": "Alero horizontal sobre ventanas norte o pérgola con enredadera caducifolia al poniente"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua"
      ],
      "problema_que_ataca": "En fachada Norte, un alero horizontal bien dimensionado bloquea el sol alto del verano y deja entrar el sol bajo del invierno.",
      "tip_practico": "Si plantas árboles (ej. liquidámbar, fresno o jacarandá), elige hoja caduca y aléjalos de cañerías y cimientos.",
      "precaucion": "Revisa permisos municipales si construyes una pérgola techada grande.",
      "donde_comprar": "Maestros de carpintería/metalmecánica y viveros",
      "subsidio_ds27": "no"
    },
    {
      "id": "A11_correccion_puentes_termicos_puntuales",
      "nombre": "Aislación exterior puntual en pilares, vigas y esquinas frías",
      "descripcion_corta": "Aislación focalizada en pilares y esquinas con condensación cuando el muro ya tiene aislación por dentro.",
      "categoria": "alto_impacto",
      "tags": [
        "puente_termico_muro"
      ],
      "requiere_alguno": {
        "materialMuro": [
          "muro_aislacion_interior"
        ]
      },
      "elemento": "muros",
      "impacto": "medio",
      "impacto_termico_1_10": 6,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 240000,
        "max_clp": 480000,
        "tipico_clp": 400000,
        "unidad": "puntos críticos (~8 m²)",
        "precio_unitario_texto": "$30.000 – $60.000 por m² intervenido",
        "total_referencial_texto": "Total referencial ~8 m² de esquinas/pilares: $240.000 – $480.000",
        "caso_tipico": "8 m² de aislación exterior en esquinas y pilares con puente térmico"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Corrige solo los puentes térmicos en pilares y losas sin rehacer toda la aislación del muro.",
      "tip_practico": "Pide a un maestro identificar primero los puntos donde aparece frío o humedad localizada.",
      "precaucion": null,
      "donde_comprar": "Maestros e instaladores de aislación",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "A13_aislacion_piso_ventilado",
      "nombre": "Aislación bajo piso ventilado o manta térmica bajo piso flotante",
      "descripcion_corta": "Aislación por debajo de pisos sobre estacionamientos/pilotes o instalación de piso flotante con manta aislante densa.",
      "categoria": "alto_impacto",
      "tags": [
        "fuga_piso"
      ],
      "excluir_si": {
        "piso": [
          "adiabatico",
          "piso_aislado"
        ]
      },
      "elemento": "piso",
      "impacto": "alto",
      "impacto_termico_1_10": 7,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 350000,
        "max_clp": 950000,
        "tipico_clp": 600000,
        "unidad": "superficie ~35 m²",
        "precio_unitario_texto": "$10.000 – $28.000 por m² instalado",
        "total_referencial_texto": "Total referencial ~35 m²: $350.000 – $950.000",
        "caso_tipico": "Aislación bajo losa de estacionamiento abierto (EPS/lana) o piso flotante con espuma densa"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Frena la pérdida de calor a través de pisos expuestos a estacionamientos abiertos, pilotes o radier frío.",
      "tip_practico": "En pisos sobre estacionamiento, aislar por la cara inferior de la losa es lo más efectivo (postulable en DS 27 Cap. IV). Sobre radier, un piso flotante con manta térmica gruesa mejora mucho la sensación térmica.",
      "precaucion": "En edificios, intervenir el cielo del estacionamiento requiere autorización de la administración.",
      "donde_comprar": "Maestros instaladores, Sodimac, Easy",
      "subsidio_ds27": "si"
    },
    {
      "id": "A12_aire_acondicionado_inverter",
      "nombre": "Aire acondicionado Split Inverter (Bomba de calor frío/calor)",
      "descripcion_corta": "Climatización activa eficiente para reducir el gasto mensual frente a estufas eléctricas, gas o parafina, y refrescar en verano.",
      "categoria": "alto_impacto",
      "es_climatizacion_activa": true,
      "solo_letras": [
        "E",
        "F",
        "G"
      ],
      "tags": [
        "sobrecalentamiento_poniente",
        "frio_orientacion_sur",
        "fuga_techo",
        "muro_sin_aislacion",
        "vidrio_simple"
      ],
      "excluir_si": {
        "calefaccionActual": [
          "aire_acondicionado_inverter"
        ]
      },
      "elemento": "climatizacion_activa",
      "impacto": "alto",
      "impacto_termico_1_10": 8,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 320000,
        "max_clp": 550000,
        "tipico_clp": 420000,
        "unidad": "equipo + instalación",
        "precio_unitario_texto": "$320.000 – $550.000 (equipo 9.000–12.000 BTU instalado)",
        "total_referencial_texto": "1 equipo principal instalado: ~$420.000",
        "caso_tipico": "Split Inverter 9.000 a 12.000 BTU eficiencia A o superior instalado en living o dormitorio"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "No reemplaza aislar la envolvente, pero complementa el confort bajando el gasto mensual: según Manual CEV (Anexo B.2.2), una bomba de calor aire-aire entrega 3 a 4 veces más calor por kWh que una estufa eléctrica, sin humedad intradomiciliaria.",
      "tip_practico": "Sella primero los chiflones básicos para no desperdiciar energía. Elige etiqueta SEC clase A o superior, úsalo a 20–21 °C en invierno / 24–25 °C en verano y limpia sus filtros mensualmente.",
      "precaucion": "Requiere instalación por técnico calificado y verificar capacidad eléctrica. En edificios, confirma ubicación de unidad exterior con administración.",
      "donde_comprar": "Sodimac, Easy, retail y distribuidores de climatización",
      "subsidio_ds27": "no"
    }
  ],
  "tips_costo_cero": [
    {
      "id": "T01_cortinas_segun_sol_invierno",
      "titulo": "Abre cortinas con sol y ciérralas al atardecer",
      "tags": [
        "frio_orientacion_sur",
        "vidrio_simple",
        "marco_metalico_frio"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Mañana y atardecer",
      "tags_generales": false,
      "descripcion": "Abre las cortinas de las ventanas que reciben sol (norte y oriente) durante el día para que entre calor gratis. Ciérralas al atardecer para guardar ese calor en la noche."
    },
    {
      "id": "T02_ventilacion_cruzada_nocturna",
      "titulo": "Ventila de noche en verano",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "temporada": "verano",
      "momento_del_dia": "Noche y madrugada",
      "tags_generales": false,
      "descripcion": "En Santiago las noches de verano son más frescas. Abre ventanas opuestas (por ejemplo, una al oriente y otra al poniente) para que corra el aire y se lleve el calor acumulado. Ciérralas temprano en la mañana."
    },
    {
      "id": "T03_cerrar_poniente_desde_el_mediodia",
      "titulo": "Cierra cortinas y ventanas del poniente desde el mediodía",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "temporada": "verano",
      "momento_del_dia": "Desde las 13:00",
      "tags_generales": false,
      "descripcion": "Antes de que el sol de la tarde pegue directo, cierra cortinas y ventanas de las piezas al poniente. Una pieza que parte fresca a las 13:00 llega mucho mejor a las 18:00."
    },
    {
      "id": "T04_ventilar_10_minutos_invierno",
      "titulo": "Ventila 10 minutos al día, en el momento más tibio",
      "tags": [
        "humedad_condensacion",
        "puente_termico_muro",
        "frio_orientacion_sur",
        "muro_sin_aislacion"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Mediodía",
      "tags_generales": false,
      "descripcion": "Abre bien las ventanas por 10 minutos a mediodía y ciérralas. Cambia el aire húmedo por aire seco y reduce el moho en muros y esquinas, sin enfriar mucho la casa."
    },
    {
      "id": "T05_cerrar_piezas_sin_uso",
      "titulo": "Cierra las puertas de las piezas que no usas",
      "tags": [
        "infiltracion_puerta",
        "infiltracion_ventanas",
        "muro_sin_aislacion"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Todo el día",
      "tags_generales": false,
      "descripcion": "Mantén cerrada la puerta de las piezas frías o sin uso para que el calor se concentre donde estás. Así calientas menos espacio y gastas menos en calefacción."
    },
    {
      "id": "T06_tope_de_tela_casero",
      "titulo": "Haz un tope de tela con ropa vieja",
      "tags": [
        "infiltracion_puerta"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Todo el día",
      "tags_generales": false,
      "descripcion": "Enrolla una toalla o rellena una funda larga con trapos y ponla al pie de la puerta de entrada. Es una solución provisoria hasta instalar un guardapolvo."
    },
    {
      "id": "T07_alejar_muebles_y_camas_de_muros_frios",
      "titulo": "Separa camas y sillones de los muros exteriores fríos",
      "tags": [
        "muro_sin_aislacion",
        "puente_termico_muro",
        "humedad_condensacion",
        "frio_orientacion_sur"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Todo el día",
      "tags_generales": false,
      "descripcion": "Deja unos 5 a 10 cm entre el mueble y el muro exterior. Así el aire circula, baja el riesgo de humedad y no duermes pegado a una pared helada."
    },
    {
      "id": "T08_escotilla_cerrada_y_aislacion_sin_pisar",
      "titulo": "Mantén cerrada la escotilla y no pises la aislación",
      "tags": [
        "fuga_techo"
      ],
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "casa_continua"
      ],
      "temporada": "ambas",
      "momento_del_dia": "Todo el día",
      "tags_generales": false,
      "descripcion": "Cierra siempre la tapa del entretecho. Si ya hay aislación arriba, no la aplastes ni guardes cosas pesadas encima: comprimida, aísla mucho menos."
    },
    {
      "id": "T09_secar_ropa_con_ventilacion",
      "titulo": "Evita secar ropa dentro de las piezas cerradas",
      "tags": [
        "humedad_condensacion",
        "puente_termico_muro",
        "frio_orientacion_sur"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Todo el día",
      "tags_generales": false,
      "descripcion": "La ropa mojada suelta mucha humedad al aire, que se junta en los muros y vidrios fríos. Si debes secarla adentro, hazlo en una pieza con una ventana entreabierta."
    },
    {
      "id": "T10_despejar_fuentes_de_calor",
      "titulo": "Apaga lo que calienta en las tardes de verano",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "temporada": "verano",
      "momento_del_dia": "Tarde",
      "tags_generales": false,
      "descripcion": "Evita usar horno, plancha y luces incandescentes en las horas de más calor. Desenchufa cargadores y equipos que no usas: todos sueltan calor."
    },
    {
      "id": "T11_secar_condensacion_en_la_manana",
      "titulo": "Seca el agua del vidrio y del marco cada mañana",
      "tags": [
        "humedad_condensacion",
        "vidrio_simple",
        "marco_metalico_frio"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Mañana",
      "tags_generales": false,
      "descripcion": "Pasa un paño seco por los vidrios y marcos apenas te levantes. Evita que el agua se acumule, se oxide el marco o aparezcan hongos en las esquinas."
    },
    {
      "id": "T12_cerrar_trabas_y_persianas_de_noche",
      "titulo": "Cierra bien las trabas y baja las persianas de noche",
      "tags": [
        "infiltracion_ventanas",
        "riesgo_infiltracion_ventanas"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Noche",
      "tags_generales": false,
      "descripcion": "Muchas ventanas parecen cerradas, pero la traba no aprieta. Revisa que todas queden con la traba puesta y las persianas abajo, para que el marco se apoye mejor."
    },
    {
      "id": "T13_sabana_clara_en_vidrio_poniente",
      "titulo": "Cuelga una sábana clara frente al vidrio poniente",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "temporada": "verano",
      "momento_del_dia": "Tarde",
      "tags_generales": false,
      "descripcion": "Mientras no tengas cortinas apropiadas, una sábana o tela clara frente al vidrio rebota parte del sol. Es temporal, pero ayuda las tardes más fuertes."
    },
    {
      "id": "T14_vestirse_por_capas",
      "titulo": "Usa ropa por capas y zapatillas dentro de casa",
      "tags": [],
      "temporada": "invierno",
      "momento_del_dia": "Todo el día",
      "tags_generales": true,
      "descripcion": "Abrigar el cuerpo es más barato que calentar toda la casa. Varias capas delgadas, calcetines gruesos y una frazada en el sillón permiten bajar un poco la calefacción."
    },
    {
      "id": "T15_gestionar_el_dia_del_calor",
      "titulo": "Haz lo pesado temprano o tarde en verano",
      "tags": [],
      "temporada": "verano",
      "momento_del_dia": "Mañana y noche",
      "tags_generales": true,
      "descripcion": "Cocina, plancha y lava temprano en la mañana o ya entrada la noche. Así evitas sumar calor interior en las horas en que la casa ya está más cálida."
    },
    {
      "id": "T16_tapar_ollas_y_ventilar_ducha",
      "titulo": "Tapa las ollas al cocinar y ventila tras ducharte",
      "tags": [
        "humedad_condensacion",
        "puente_termico_muro",
        "frio_orientacion_sur"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Al cocinar o ducharse",
      "tags_generales": true,
      "descripcion": "El vapor de agua humedece el aire interior y hace que la casa se sienta más fría y cueste más calefaccionarla. Tapar las ollas, prender el extractor y abrir el baño 5 minutos después de la ducha evita humedad y hongos."
    },
    {
      "id": "T17_despejar_estufas_y_radiadores",
      "titulo": "No bloquees estufas ni calefactores con muebles o ropa",
      "tags": [
        "muro_sin_aislacion",
        "frio_orientacion_sur"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Al calefaccionar",
      "tags_generales": true,
      "descripcion": "Deja libre al menos un metro delante de estufas y radiadores para que el aire caliente circule por toda la pieza en vez de quedar atrapado detrás de sillones o cortinas."
    },
    {
      "id": "T18_alfombras_pisos_frios",
      "titulo": "Usa alfombras o bajadas de cama sobre pisos fríos",
      "tags": [
        "fuga_piso",
        "frio_orientacion_sur"
      ],
      "temporada": "invierno",
      "momento_del_dia": "Todo el día",
      "tags_generales": true,
      "descripcion": "Si tu piso es de cerámica, baldosa o radier (especialmente en primeros pisos), colocar alfombras o frazadas gruesas donde apoyas los pies corta el frío por contacto y mejora de inmediato la sensación térmica."
    }
  ],
  "subsidios": {
    "aviso": "Esta sección es informativa y referencial (verificada a noviembre de 2026). No determina si calificas ni garantiza un beneficio. Confirma siempre bases, cupos y fechas en minvu.gob.cl o en SERVIU Metropolitano.",
    "ultima_verificacion": "2026-11-22",
    "fichas": [
      {
        "id": "banco_materiales_2_ds27_2026",
        "nombre": "Tarjeta Banco de Materiales 2.0 para Casas y Departamentos (D.S. N° 27)",
        "organismo": "MINVU / SERVIU",
        "vigencia_badge": "VIGENTE · Hasta 9 dic 2026",
        "vigente_ahora": true,
        "estado": "Postulación 100% en línea abierta desde el 09 de noviembre hasta el 09 de diciembre de 2026 (resultados en febrero de 2027).",
        "resumen": "Gift card estatal para comprar materiales de construcción y reparar techumbres (casas), pisos (casas y departamentos), baños o cierres perimetrales en tu única vivienda.",
        "que_financia": [
          "Reparación de techumbres (solo casas): subsidio de 25 UF (~$1.031.000 CLP aprox.). No aplica a techos de asbesto/pizarreño.",
          "Mejoramiento de pisos (casas y departamentos): subsidio de 15 UF (~$619.000 CLP aprox.) para piso flotante, cerámica, porcelanato, etc.",
          "Reparación de baños (casas y departamentos): 15 UF.",
          "Cierres perimetrales / cercos y rejas (solo casas): hasta 40 UF.",
          "Importante: financia materiales, NO mano de obra ni transporte."
        ],
        "ahorro_minimo_familia": "1 UF para techumbres, baños o pisos (2 UF para cierres), depositado hasta el 9 de diciembre de 2026 a las 14:00 hrs en cuenta de ahorro en convenio (BancoEstado, Caja Los Andes, Coopeuch o Scotiabank).",
        "requisitos_vivienda": [
          "Casa o departamento ubicado en localidad urbana de más de 5.000 habitantes.",
          "Antigüedad mínima de 10 años.",
          "Avalúo fiscal igual o inferior a 2.000–2.500 UF según bases vigentes del llamado (el sistema valida en línea).",
          "Si postulas a techumbre, no tener planchas de fibrocemento con asbesto (pizarreño)."
        ],
        "requisitos_postulante": [
          "Ser persona propietaria de una única vivienda y habitarla (mayor de 18 años).",
          "Estar entre el 40% y el 90% de calificación socioeconómica del Registro Social de Hogares (RSH).",
          "Contar con ClaveÚnica activa y cédula de identidad vigente.",
          "No haber recibido subsidio DS 27 o DS 255 en los últimos 10 años."
        ],
        "quienes_no_pueden": "Quienes arriendan no pueden postular, porque exige ser propietario de única vivienda.",
        "como_se_postula": [
          "1. Ingresa en línea a minvu.gob.cl con tu RUT y ClaveÚnica entre el 9 de noviembre y el 9 de diciembre de 2026.",
          "2. Verifica tus datos del RSH y registra tu vivienda.",
          "3. Adjunta fotografías de la fachada (con número municipal) y del daño a reparar.",
          "4. Elige el tipo de obra (ej. reparación de techumbre o pisos) y valida tu cuenta de ahorro.",
          "5. Envía la postulación y descarga tu comprobante."
        ],
        "links": [
          {
            "titulo": "Postulación oficial Tarjeta Banco de Materiales 2.0 (MINVU)",
            "url": "https://www.minvu.gob.cl/tarjeta-banco-de-materiales-para-casas-y-departamentos/"
          },
          {
            "titulo": "Portal de Subsidios MINVU",
            "url": "https://www.minvu.gob.cl/"
          }
        ]
      },
      {
        "id": "llamado_poligonos_2026_ds27",
        "nombre": "Llamado Polígonos 2026: Mejoramiento de Viviendas y Condominios (D.S. N° 27 Cap. I, II y III)",
        "organismo": "MINVU / SERVIU",
        "vigencia_badge": "VIGENTE 2026 · Territorios priorizados",
        "vigente_ahora": true,
        "estado": "Llamado 2026 vigente en barrios y territorios priorizados (Quiero Mi Barrio, Zonas de Interés Público, Pequeñas Localidades).",
        "resumen": "Financia proyectos de mejoramiento de viviendas, bienes comunes y envolvente en condominios de vivienda social o económica ubicados dentro de polígonos priorizados por el MINVU.",
        "que_financia": [
          "Mejoramiento de bienes comunes en condominios (techumbres, fachadas, escaleras y áreas compartidas).",
          "Obras de mejoramiento y reparación habitacional en viviendas de barrios priorizados.",
          "Equipamiento comunitario del barrio."
        ],
        "ahorro_minimo_familia": "Varía según capítulo y tipo de obra (habitualmente desde 1 a 3 UF por familia, según bases del llamado).",
        "requisitos_vivienda": [
          "Estar emplazada dentro de un polígono o barrio priorizado por MINVU / Municipalidad.",
          "En condominios: ser Condominio de Vivienda Social o Económica (en deterioro y/o más de 15 años de antigüedad)."
        ],
        "requisitos_postulante": [
          "Postulación colectiva o mediante Comité de Administración / organización funcional.",
          "Contar con la asesoría de una Entidad Patrocinante (EP) o Municipalidad.",
          "Contar con Registro Social de Hogares y ahorro mínimo acreditado."
        ],
        "quienes_no_pueden": "No aplica a viviendas fuera de los territorios priorizados ni a postulaciones sin Entidad Patrocinante.",
        "como_se_postula": [
          "1. Consulta en tu Municipalidad o SERVIU Metropolitano si tu barrio o block forma parte de un polígono priorizado 2026.",
          "2. Coordina con tu Comité de Administración o junta de vecinos.",
          "3. Una Entidad Patrocinante (EP) prepara y presenta el proyecto al SERVIU."
        ],
        "links": [
          {
            "titulo": "Ver llamados vigentes 2026 en MINVU",
            "url": "https://www.minvu.gob.cl/"
          },
          {
            "titulo": "Proyectos para Condominios de Vivienda (SERVIU RM)",
            "url": "https://serviumetropolitana.minvu.gob.cl/proyectos-para-condominios-de-vivienda/"
          }
        ]
      },
      {
        "id": "ds27_cap4_acondicionamiento_termico",
        "nombre": "Subsidio de Acondicionamiento Térmico y Eficiencia Energética (D.S. N° 27 Capítulo IV — Hogar Mejor)",
        "organismo": "MINVU / SERVIU",
        "vigencia_badge": "Llamado 2026 cerrado · Preparar próximo llamado",
        "vigente_ahora": false,
        "estado": "El llamado nacional 2026 (Res. Exta. N° 1048) ya cerró su digitación el 31 de agosto de 2026. Puedes ir reuniendo tu ahorro y contactando una EP para el próximo llamado.",
        "resumen": "Es el subsidio más completo para envolvente térmica: financia obras profesionales de aislación de techos, muros, pisos ventilados, sistemas solares y eficiencia energética en viviendas existentes.",
        "que_financia": [
          "Aislación térmica de techumbre (cielo/techo).",
          "Aislación térmica de muros exteriores (ej. EIFS) y pisos ventilados.",
          "Acondicionamiento térmico en línea regular y en zonas con Plan de Descontaminación Atmosférica (PDA).",
          "Sistemas Solares Térmicos (SST) y Sistemas Fotovoltaicos (mínimo 2 kWp en bases 2026).",
          "Otras obras como recambio de ventanas: consultar con la Entidad Patrocinante si el proyecto las incluye."
        ],
        "ahorro_minimo_familia": "3 UF general. Personas de 60 años o más aportan solo 1 UF en proyectos térmicos. (Montos de subsidio referenciales: tope 120 UF en ChileAtiende; 151 a 592 UF en Ventanilla Única según zona y proyecto).",
        "requisitos_vivienda": [
          "Tener hasta 140 m² y más de 5 años de antigüedad.",
          "Ser vivienda social, construida por SERVIU o tener avalúo fiscal hasta 1.375 UF (criterio llamado 2026).",
          "Estar en localidad urbana de más de 5.000 habitantes.",
          "Contar con recepción final municipal y permiso de edificación hasta el 31 de diciembre de 2009 (criterio llamado 2026)."
        ],
        "requisitos_postulante": [
          "Ser mayor de 18 años con cédula vigente y propietario o asignatario de la vivienda.",
          "Estar en el Registro Social de Hogares (hasta tramo 70% individual; en grupales, 60% del grupo hasta el 60% y el resto hasta el 80%).",
          "Si recibió antes DS 255 o DS 27, tenerlo completamente pagado.",
          "Postular obligatoriamente a través de una Entidad Patrocinante (EP)."
        ],
        "quienes_no_pueden": "Quienes arriendan no pueden postular directamente porque exige propiedad; pueden compartir su diagnóstico con el dueño y usar las medidas económicas.",
        "como_se_postula": [
          "1. Revisa si tu vivienda cumple los requisitos y actualiza tu Registro Social de Hogares.",
          "2. Abre o junta tu ahorro mínimo (3 UF, o 1 UF si tienes 60+ años) con anticipación.",
          "3. Elige una Entidad Patrocinante (EP) del registro MINVU o consulta en tu Municipalidad.",
          "4. La EP evalúa tu casa, diseña el proyecto térmico y lo ingresa cuando abra el siguiente llamado."
        ],
        "links": [
          {
            "titulo": "Llamado Nacional 2026 Cap. IV DS 27 (MINVU)",
            "url": "https://www.minvu.gob.cl/postulacion/llamado-nacional-en-condiciones-especiales-ano-2026-proyectos-de-eficiencia-energetica-y-acondicionamiento-termico-capitulo-iv-d-s-27/"
          },
          {
            "titulo": "Ficha ChileAtiende: Eficiencia energética para la vivienda",
            "url": "https://www.chileatiende.gob.cl/fichas/98312-programa-de-mejoramiento-de-viviendas-y-barrios-proyectos-eficiencia-energetica-e-hidrica-para-la-vivienda"
          },
          {
            "titulo": "Ventanilla Única Social: Acondicionamiento térmico",
            "url": "https://www.ventanillaunicasocial.gob.cl/ficha/361/subsidio-mejorar-acondicionamiento-termico-eficiencia-vivienda"
          }
        ]
      },
      {
        "id": "ds27_cap2_mejoramiento_vivienda",
        "nombre": "Proyectos para la Vivienda: Mejoramiento y Recambio de Techumbres con Asbesto (D.S. N° 27 Capítulo II)",
        "organismo": "MINVU / SERVIU",
        "vigencia_badge": "Llamado anual 2026 · Vía Entidad Patrocinante",
        "vigente_ahora": false,
        "estado": "Llamado nacional 2026 (Res. Exta. N° 1001) realizado entre agosto y septiembre de 2026. Revisa próximas fechas y llamados regionales en SERVIU Metropolitano.",
        "resumen": "Alternativa estatal para reparaciones estructurales, instalaciones, accesibilidad universal y recambio seguro de techumbres de fibrocemento con asbesto (pizarreño) que no cubre Banco de Materiales.",
        "que_financia": [
          "Recambio de cubiertas de asbesto cemento (pizarreño) bajo norma sanitaria.",
          "Obras de carácter estructural, instalaciones y reparación de envolvente (según zona).",
          "Adecuaciones de accesibilidad para personas con discapacidad."
        ],
        "ahorro_minimo_familia": "Según tipo de proyecto y bases del llamado (usualmente 1 a 3 UF acreditado antes del cierre de digitación).",
        "requisitos_vivienda": [
          "Ser vivienda objeto del programa D.S. N° 27 habitada por el postulante y su grupo familiar según RSH.",
          "Permite regularización asociada cuando existen recintos sin recepción definitiva."
        ],
        "requisitos_postulante": [
          "Ser propietario o asignatario mayor de 18 años con RSH vigente.",
          "Contar con proyecto desarrollado por una Entidad Patrocinante (EP)."
        ],
        "quienes_no_pueden": "Arrendatarios y postulaciones individuales sin Entidad Patrocinante.",
        "como_se_postula": [
          "1. Revisa los requisitos y llamados en SERVIU Metropolitano.",
          "2. Contacta una Entidad Patrocinante o la oficina de vivienda de tu Municipalidad."
        ],
        "links": [
          {
            "titulo": "Mejoramiento de Vivienda DS 27 (SERVIU Metropolitano)",
            "url": "https://serviumetropolitana.minvu.gob.cl/mejoramiento-de-vivienda-barrios-y-entorno-ds27/"
          },
          {
            "titulo": "Resolución Llamado Cap. II 2026 (MINVU PDF)",
            "url": "https://www.minvu.gob.cl/wp-content/uploads/2026/07/2026.07.07-Res.-Exta.-N%C2%B01001-Llamado-Cap-2-DS27_2026.pdf"
          }
        ]
      }
    ],
    "checklist_preliminar_ui": [
      {
        "pregunta": "¿Eres propietario o asignatario de la vivienda?",
        "si_no": "Si eres arrendatario, los subsidios MINVU de mejoramiento no aplican directamente. Usa las medidas económicas removibles o comparte tu reporte con el dueño."
      },
      {
        "pregunta": "¿Tu vivienda tiene al menos 5 a 10 años de antigüedad?",
        "si_no": "Banco de Materiales 2.0 pide mínimo 10 años; DS 27 Cap. IV pide más de 5 años y hasta 140 m²."
      },
      {
        "pregunta": "¿Estás inscrito en el Registro Social de Hogares (RSH)?",
        "si_no": "Es obligatorio para todos los subsidios. Puedes inscribirte o actualizarlo en registrosocial.gob.cl o en tu municipalidad."
      },
      {
        "pregunta": "¿Puedes reunir entre 1 UF y 3 UF de ahorro mínimo?",
        "si_no": "Banco de Materiales pide 1 UF en techumbre/pisos; DS 27 Cap. IV pide 3 UF (o 1 UF si tienes 60 años o más)."
      }
    ]
  },
  "documentos_oficiales": [
    {
      "id": "manual_cev_2025",
      "categoria": "Normativa y Metodología Técnica · MINVU",
      "titulo": "Manual Técnico para la Calificación Energética de Viviendas (CEV) en Chile",
      "entidad": "Ministerio de Vivienda y Urbanismo (DITEC - MINVU) · Versión Agosto 2025",
      "descripcion": "Documento oficial que establece los procedimientos técnicos, tablas de transmitancia térmica (U) para vidrios, marcos y puertas, deterioro de muros antiguos, criterios de elementos adiabáticos, bombas de calor aire-aire (Anexo B.2.2), zonificación térmica nacional (Zona D para Santiago urbano y Zona H sobre 2.000 MSNM) y la escala de calificación A+ a G en que se inspira nuestra calculadora.",
      "links": [
        {
          "titulo": "Abrir Manual Técnico CEV (PDF Oficial)",
          "url": "https://www.calificacionenergetica.cl/media/2025.08.18-Manual-CEV.pdf",
          "primario": true
        },
        {
          "titulo": "Portal Material de Estudio CEV",
          "url": "https://www.calificacionenergetica.cl/material-de-estudio/",
          "primario": false
        }
      ]
    },
    {
      "id": "estrategia_calor_frio",
      "categoria": "Política Pública Energética · Ministerio de Energía",
      "titulo": "Estrategia Nacional de Calor y Frío",
      "entidad": "Ministerio de Energía de Chile",
      "descripcion": "Hoja de ruta nacional cuyo objetivo es que todas las personas en Chile puedan satisfacer sus necesidades térmicas de forma informada, eficiente y sostenible. La Iniciativa Envuelve tu Casa se alinea directamente con su eje de educación ciudadana y democratización de la información técnica residencial.",
      "links": [
        {
          "titulo": "Ir al Portal Oficial Estrategia Nacional de Calor y Frío",
          "url": "https://caloryfrio.minenergia.cl/",
          "primario": true
        }
      ]
    },
    {
      "id": "calendario_subsidios_2026",
      "categoria": "Respaldo de Subsidios Vigentes · MINVU 2026",
      "titulo": "Calendario de Llamados Habitacionales 2026 (Circular N° 5) y Bases D.S. N° 27",
      "entidad": "Ministerio de Vivienda y Urbanismo (MINVU)",
      "descripcion": "Documentos oficiales con el calendario nacional de postulaciones 2026 del Programa de Mejoramiento de Viviendas y Barrios (D.S. N° 27) y las resoluciones de llamados de Acondicionamiento Térmico y Banco de Materiales.",
      "links": [
        {
          "titulo": "Calendario de Llamados 2026 (PDF MINVU)",
          "url": "https://www.minvu.gob.cl/wp-content/uploads/2026/03/Calendario-de-Llamados-2026-Circular-N%C2%B05.pdf",
          "primario": true
        },
        {
          "titulo": "Resolución Llamado Cap. IV Acondicionamiento Térmico 2026 (PDF)",
          "url": "https://www.minvu.gob.cl/wp-content/uploads/2026/07/2026.07.13-Res.-Exta.-N%C2%B01048-Llamado-Cap-4-DS27_2026.pdf",
          "primario": false
        }
      ]
    }
  ]
};
