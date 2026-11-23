// =========================================================================
// BANCO DE SOLUCIONES, TIPS COSTO $0, SUBSIDIOS 2026 Y DOCUMENTOS OFICIALES
// Iniciativa Envuelve tu Casa (Basado en catálogo verificado + MINVU 2026)
// =========================================================================

window.SOLUTIONS_CATALOG = {
  "meta": {
    "proyecto": "Iniciativa Envuelve tu Casa",
    "version": "1.1.0",
    "fecha_actualizacion": "2026-11-22",
    "moneda": "CLP",
    "zona_termica": "D (Santiago urbano)",
    "motor_compatible": "thermalEngine.js (WeaknessTag, 10 tags)",
    "fuente_precios": "Burletes, guardapolvos y selladores: verificados en Sodimac.cl (nov 2026). Todo lo demás: rango referencial estimado en Santiago.",
    "advertencia_precios": "Precios referenciales en CLP con IVA en Santiago. Pueden variar por tienda y temporada. En medidas de alto impacto, cotiza siempre con 2 o 3 maestros o empresas.",
    "proxima_revision_precios": "2027-05-01",
    "regla_bajo_costo": "categoria = bajo_costo cuando costo.max_clp <= 30000 por unidad (ventana, puerta, kit, rollo o paño).",
    "aviso_legal_ui": "Orientación preliminar. No reemplaza una evaluación profesional ni una Calificación Energética oficial. No determina si calificas a un subsidio."
  },
  "tags": [
    {
      "tag": "fuga_techo",
      "etiqueta_usuario": "Pierdes calor por el techo",
      "explicacion": "El techo es por donde más calor se escapa en invierno y por donde más calor entra en verano.",
      "elemento": "techo",
      "temporada_critica": "ambas"
    },
    {
      "tag": "muro_sin_aislacion",
      "etiqueta_usuario": "Tus muros no tienen aislación",
      "explicacion": "Los muros de ladrillo, hormigón, tabique o adobe sin aislación dejan pasar el frío de afuera y enfrían las piezas.",
      "elemento": "muros",
      "temporada_critica": "invierno"
    },
    {
      "tag": "puente_termico_muro",
      "etiqueta_usuario": "Puntos fríos en los muros",
      "explicacion": "Esquinas, pilares y vigas se enfrían más que el resto del muro y pueden juntar humedad u hongos, incluso si el muro tiene aislación por dentro.",
      "elemento": "muros",
      "temporada_critica": "invierno"
    },
    {
      "tag": "vidrio_simple",
      "etiqueta_usuario": "Ventanas con vidrio simple",
      "explicacion": "Un vidrio simple deja pasar mucho más calor que un termopanel: enfría la pieza en invierno y la recalienta en verano.",
      "elemento": "ventanas",
      "temporada_critica": "ambas"
    },
    {
      "tag": "marco_metalico_frio",
      "etiqueta_usuario": "Marcos de aluminio o fierro",
      "explicacion": "El metal conduce el frío y el calor con mucha facilidad. Por eso los marcos se sienten helados y se llenan de gotitas de agua en invierno.",
      "elemento": "ventanas",
      "temporada_critica": "invierno"
    },
    {
      "tag": "infiltracion_ventanas",
      "etiqueta_usuario": "Entra aire por las ventanas",
      "explicacion": "Ventanas correderas, antiguas o mal selladas dejan pasar chiflones aunque estén cerradas.",
      "elemento": "ventanas",
      "temporada_critica": "invierno"
    },
    {
      "tag": "infiltracion_puerta",
      "etiqueta_usuario": "Entra aire por la puerta de entrada",
      "explicacion": "Puertas huecas, con vidrio o con rendijas en el borde y bajo la hoja dejan entrar frío, polvo y ruido.",
      "elemento": "puertas",
      "temporada_critica": "invierno"
    },
    {
      "tag": "sobrecalentamiento_poniente",
      "etiqueta_usuario": "Calor fuerte en las tardes de verano",
      "explicacion": "El sol de la tarde pega directo en las ventanas que miran al poniente y calienta la casa justo cuando más cuesta enfriarla.",
      "elemento": "entorno_solar",
      "temporada_critica": "verano"
    },
    {
      "tag": "frio_orientacion_sur",
      "etiqueta_usuario": "Piezas del lado sur, frías y con poco sol",
      "explicacion": "La fachada sur casi no recibe sol en invierno, así que las piezas de ese lado se mantienen frías y húmedas.",
      "elemento": "entorno_solar",
      "temporada_critica": "invierno"
    },
    {
      "tag": "falta_sombra_solar",
      "etiqueta_usuario": "Sin sombra frente al sol de verano",
      "explicacion": "Sin aleros, toldos, árboles u otra sombra, el sol entra directo por los vidrios y sube la temperatura interior.",
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
        "caso_tipico": "Puerta de entrada estándar, unos 5 metros de burlete de espuma o goma"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Corta el aire frío que entra por las rendijas entre la puerta y su marco.",
      "tip_practico": "Limpia el marco con un paño seco antes de pegar. Pega el burlete por el marco, no por la hoja, y cierra la puerta con suavidad para que se asiente. Si al cerrar cuesta mucho, usa uno más delgado.",
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
        "caso_tipico": "Guardapolvo de cepillo o tira de goma de 1 metro"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Tapa el espacio entre el borde inferior de la puerta y el piso, por donde entra el chiflón más fuerte.",
      "tip_practico": "Mide el ancho de la hoja y corta la tira con tijera o sierra. Elige el tipo de cepillo si el piso es irregular y el de goma si es liso.",
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
        "infiltracion_ventanas"
      ],
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
        "caso_tipico": "Ventana mediana de 1,2 x 1,2 m, 2 o 3 rollos de burlete"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Reduce el aire que se cuela por los bordes de ventanas correderas, de guillotina o con el burlete gastado.",
      "tip_practico": "En ventanas correderas usa burlete de felpa (cepillo) en los rieles. En ventanas que se abren hacia adentro usa espuma adhesiva en el marco. Prueba con la mano mojada en un día de viento para encontrar las rendijas.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B04_sellador_silicona_perimetral",
      "nombre": "Sellado con silicona o sellador acrílico alrededor del marco",
      "descripcion_corta": "Silicona o sellador acrílico alrededor del marco. Cierra la grieta entre el marco metálico y el muro.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_ventanas",
        "marco_metalico_frio",
        "infiltracion_puerta"
      ],
      "elemento": "ventanas",
      "impacto": "medio",
      "impacto_termico_1_10": 4,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 3000,
        "max_clp": 7000,
        "tipico_clp": 4500,
        "unidad": "por cartucho (2 a 3 ventanas)",
        "caso_tipico": "Cartucho de silicona o sellador acrílico pintable"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Cierra la grieta entre el marco metálico y el muro, que deja pasar aire y humedad.",
      "tip_practico": "Raspa el sellador viejo, limpia y seca bien. Aplica un cordón parejo por el exterior del marco y alisa con el dedo mojado en agua con jabón. Usa acrílico si vas a pintar encima y silicona en zonas con agua.",
      "precaucion": "No selles los orificios de drenaje del riel de la ventana ni las rejillas de ventilación de la cocina o el baño.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B05_espuma_pu_rendijas",
      "nombre": "Espuma de poliuretano para rendijas y cajón de persiana",
      "descripcion_corta": "Espuma de poliuretano para huecos grandes (cajón de persiana, pasadas, uniones). Sella lo que el burlete no alcanza.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_ventanas",
        "infiltracion_puerta",
        "puente_termico_muro"
      ],
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
        "caso_tipico": "Una lata de espuma expansiva para sellar cajón de persiana y uniones marco-muro"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Rellena huecos grandes que el burlete no alcanza: cajones de persiana, pasadas de cañerías y uniones entre marco y muro.",
      "tip_practico": "Aplica en poca cantidad, porque la espuma crece. Espera que seque completo (unas horas) y recorta el sobrante con cuchillo. Cúbrela con sellador o pintura, ya que el sol la deteriora.",
      "precaucion": "Usa guantes y ventila: la espuma fresca es irritante y pega mucho en la piel.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B06_sellar_escotilla_y_pasadas_cielo",
      "nombre": "Sellar la escotilla del entretecho y las pasadas del cielo",
      "descripcion_corta": "Burlete y plancha de poliestireno sobre la escotilla, y espuma en las pasadas del cielo. Evita que el calor suba al entretecho.",
      "categoria": "bajo_costo",
      "tags": [
        "fuga_techo"
      ],
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
        "caso_tipico": "Burlete en el borde de la escotilla, plancha de poliestireno sobre ella y espuma en pasadas de cañerías y cables"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso"
      ],
      "problema_que_ataca": "Evita que el aire caliente suba al entretecho en invierno por la tapa de la escotilla y por los huecos del cielo.",
      "tip_practico": "Pega burlete en el marco de la escotilla y apoya encima una plancha de poliestireno del mismo tamaño que la tapa. Sella con espuma el contorno de cañerías y cables que atraviesan el cielo.",
      "precaucion": "No cubras con aislante focos embutidos ni cajas eléctricas que no estén preparados para eso: se pueden recalentar. Si dudas, déjalos libres.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B07_film_termico_ventana",
      "nombre": "Kit de film aislante termorretráctil para ventanas",
      "descripcion_corta": "Film plástico termorretráctil pegado al marco, que deja una capa de aire quieto frente al vidrio. Se instala en otoño.",
      "categoria": "bajo_costo",
      "tags": [
        "vidrio_simple",
        "marco_metalico_frio",
        "infiltracion_ventanas",
        "frio_orientacion_sur"
      ],
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
        "caso_tipico": "Kit de film plástico con cinta doble contacto, para ventana de 1,2 x 1,2 m"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Crea una capa de aire quieto frente al vidrio simple y el marco, que frena el frío y el chiflón sin cambiar la ventana.",
      "tip_practico": "Pega la cinta por el interior del marco, estira el film y dale calor con secador de pelo para que quede tenso y transparente. Se instala en otoño y se retira en primavera.",
      "precaucion": "No cubras ventanas que sean salida de emergencia o que necesites abrir seguido. Antes de retirar, despega la cinta despacio para no dañar la pintura.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B08_cortinas_termicas",
      "nombre": "Cortinas térmicas o con forro blackout",
      "descripcion_corta": "Cortinas con forro térmico o blackout. Guardan el calor de noche en invierno y frenan el sol de la tarde en verano.",
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
        "caso_tipico": "Cortina con forro térmico o blackout, de largo hasta el piso"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Pone una barrera extra frente al vidrio: guarda el calor de noche en invierno y frena el sol de la tarde en verano.",
      "tip_practico": "Elige una cortina más ancha que la ventana (unos 15 cm por lado) y que llegue casi al piso. En invierno ciérrala al atardecer. En verano ciérrala desde el mediodía en ventanas al poniente, con el lado claro hacia afuera.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, tiendas de telas y hogar",
      "subsidio_ds27": "no"
    },
    {
      "id": "B09_film_control_solar",
      "nombre": "Film reflectante de control solar",
      "descripcion_corta": "Film reflectante en el vidrio que rebota parte del sol de la tarde. Ideal para ventanas al poniente.",
      "categoria": "bajo_costo",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar",
        "vidrio_simple"
      ],
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
        "caso_tipico": "Film adhesivo reflectante o electrostático, ventana de 1,2 x 1,2 m"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Rebota parte del sol de la tarde antes de que atraviese el vidrio y caliente la pieza.",
      "tip_practico": "Aplícalo con agua jabonosa y una espátula blanda para evitar burbujas. Parte por las ventanas al poniente. Elige film removible si arriendas.",
      "precaucion": "Un film oscuro o muy reflectante resta luz natural y en invierno quita calor del sol. Si esa pieza necesita sol en invierno, prefiere cortina o malla que puedas sacar.",
      "donde_comprar": "Sodimac, Easy, tiendas de vidrios y ferreterías",
      "subsidio_ds27": "no"
    },
    {
      "id": "B10_malla_raschel_sombra",
      "nombre": "Malla raschel o toldo liviano por fuera de la ventana",
      "descripcion_corta": "Malla raschel puesta por fuera de la ventana. Da sombra antes de que el sol toque el vidrio y se puede sacar en invierno.",
      "categoria": "bajo_costo",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
      "elemento": "entorno_solar",
      "impacto": "alto",
      "impacto_termico_1_10": 6,
      "temporada": "verano",
      "costo": {
        "simbolo": "$",
        "min_clp": 6000,
        "max_clp": 25000,
        "tipico_clp": 12000,
        "unidad": "por ventana o paño 2x2 m",
        "caso_tipico": "Malla raschel de 80% de sombra con ganchos o argollas, fijada sobre la ventana poniente"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Sombrea el vidrio desde afuera, que es la forma más efectiva de evitar que el sol caliente la pieza.",
      "tip_practico": "Instálala con inclinación y a unos 20 cm del vidrio para que circule el aire. Se puede sacar en invierno para dejar entrar el sol.",
      "precaucion": "En balcones de edificio pide permiso a la administración y fija bien la malla: el viento de la tarde la puede soltar.",
      "donde_comprar": "Sodimac, Easy, ferreterías y viveros",
      "subsidio_ds27": "no"
    },
    {
      "id": "B11_eps_tras_muebles",
      "nombre": "Planchas de poliestireno tras muebles en muros fríos",
      "descripcion_corta": "Planchas de poliestireno pegadas al muro tras closets o cabeceras. Aíslan los tramos de muro más fríos.",
      "categoria": "bajo_costo",
      "tags": [
        "muro_sin_aislacion",
        "puente_termico_muro",
        "frio_orientacion_sur"
      ],
      "elemento": "muros",
      "impacto": "bajo",
      "impacto_termico_1_10": 3,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$",
        "min_clp": 8000,
        "max_clp": 25000,
        "tipico_clp": 15000,
        "unidad": "por mueble o paño de muro",
        "caso_tipico": "5 o 6 planchas de poliestireno expandido de 20 mm, pegadas al muro tras un closet o cabecera"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Agrega una capa aislante en los tramos de muro exterior donde duermes o te sientas, que son los que más sientes fríos.",
      "tip_practico": "Corta las planchas a la medida del mueble y pégalas con adhesivo de montaje. Deja un espacio de 2 a 3 cm entre el mueble y la plancha para que circule el aire.",
      "precaucion": "El poliestireno es inflamable: no lo dejes a la vista ni cerca de estufas. Tápalo siempre con el mueble, una tela gruesa o una plancha de yeso-cartón.",
      "donde_comprar": "Sodimac, Easy, ferreterías con planchas de poliestireno",
      "subsidio_ds27": "no"
    },
    {
      "id": "B12_antihongos_y_ventilacion",
      "nombre": "Limpieza antihongos y pintura antihongos en puntos fríos",
      "descripcion_corta": "Limpieza y pintura antihongos en esquinas y muros fríos. Cuida la salud, pero no aísla: es un paliativo.",
      "categoria": "bajo_costo",
      "tags": [
        "puente_termico_muro",
        "frio_orientacion_sur"
      ],
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
        "caso_tipico": "Producto antihongos y un galón de pintura antihongos para una esquina o pared"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Trata la humedad y el moho que aparecen en esquinas y muros fríos. Cuida tu salud, pero no aísla: es un paliativo.",
      "tip_practico": "Limpia primero con el producto antihongos, deja secar bien y recién pinta. Combínalo siempre con ventilar unos 10 minutos al día para bajar la humedad.",
      "precaucion": "Usa guantes y mascarilla, y ventila al aplicar. Si el moho vuelve rápido o cubre mucha superficie, hay un problema de aislación o de filtración que conviene revisar con un maestro.",
      "donde_comprar": "Sodimac, Easy, ferreterías de barrio",
      "subsidio_ds27": "no"
    },
    {
      "id": "B13_lana_mineral_parcial_cielo",
      "nombre": "Rollos de lana mineral sobre el cielo de la pieza más usada",
      "descripcion_corta": "Rollos de lana mineral sobre el cielo de la pieza más usada. Permite partir la aislación del techo de a poco.",
      "categoria": "bajo_costo",
      "tags": [
        "fuga_techo"
      ],
      "elemento": "techo",
      "impacto": "medio",
      "impacto_termico_1_10": 5,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$",
        "min_clp": 15000,
        "max_clp": 29000,
        "tipico_clp": 22000,
        "unidad": "por rollo (revisar m²)",
        "caso_tipico": "1 o 2 rollos de lana mineral o de vidrio sin papel, tendidos sobre un dormitorio"
      },
      "dificultad": "media",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso"
      ],
      "problema_que_ataca": "Es una forma de partir con la aislación del techo en la pieza que más usas, mientras juntas presupuesto para cubrir toda la casa.",
      "tip_practico": "Tiende los rollos sin comprimirlos y sin dejar huecos entre ellos. Si el entretecho ya tiene aislación, agrega una segunda capa cruzada. Revisa en la etiqueta cuántos m² cubre cada rollo.",
      "precaucion": "Usa guantes, mascarilla, lentes y ropa que cubra la piel. Camina solo sobre las vigas, nunca sobre el cielo falso. No tapes luminarias embutidas ni cajas de conexión eléctrica.",
      "donde_comprar": "Sodimac, Easy",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "B14_enredadera_o_planta_caducifolia",
      "nombre": "Enredadera o planta de hoja caduca frente a la ventana poniente",
      "descripcion_corta": "Enredadera de hoja caduca frente a la ventana poniente. Da sombra en verano y deja pasar el sol en invierno.",
      "categoria": "bajo_costo",
      "tags": [
        "falta_sombra_solar",
        "sobrecalentamiento_poniente"
      ],
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
        "caso_tipico": "Parra, jazmín del cabo u otra enredadera caducifolia con tutor o malla"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Da sombra natural en verano y pierde las hojas en invierno, dejando pasar el sol cuando se necesita.",
      "tip_practico": "Elige una especie de hoja caduca (que bote las hojas en invierno) y de bajo consumo de agua. Pon la maceta cerca de la ventana poniente y guíala con una malla. Demora una o dos temporadas en cubrir.",
      "precaucion": "Evita especies de hoja perenne frente a ventanas del norte: taparían el sol que necesitas en invierno.",
      "donde_comprar": "Viveros, Sodimac, Easy",
      "subsidio_ds27": "no"
    },
    {
      "id": "B15_cortina_gruesa_puerta",
      "nombre": "Cortina gruesa sobre la puerta de entrada",
      "descripcion_corta": "Cortina de tela gruesa sobre la puerta de entrada. Frena parte del chiflón sin tocar la puerta.",
      "categoria": "bajo_costo",
      "tags": [
        "infiltracion_puerta"
      ],
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
        "caso_tipico": "Cortina de tela gruesa o con forro, con riel o tensor de resorte"
      },
      "dificultad": "facil",
      "hazlo_tu_mismo": true,
      "apto_arrendatario": "si",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Frena parte del chiflón y del frío de una puerta delgada, hueca o con vidrio, sin tocar la puerta.",
      "tip_practico": "Cuélgala unos 10 cm sobre el marco y deja que llegue casi al piso. Ábrela de día si hay sol cerca de la puerta.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, tiendas de hogar",
      "subsidio_ds27": "no"
    },
    {
      "id": "A01_aislacion_cielo_lana_mineral",
      "nombre": "Aislación del techo con lana mineral de 10 a 14 cm",
      "descripcion_corta": "Lana mineral de 10 a 14 cm en el cielo, instalada por un maestro. Es la medida más efectiva para techos sin aislación.",
      "categoria": "alto_impacto",
      "tags": [
        "fuga_techo"
      ],
      "elemento": "techo",
      "impacto": "alto",
      "impacto_termico_1_10": 10,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 7000,
        "max_clp": 15000,
        "tipico_clp": 400000,
        "unidad": "por m² (ejemplo total ~$400.000)",
        "caso_tipico": "40 m² de cielo, lana mineral de 100 a 140 mm con instalación"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso"
      ],
      "problema_que_ataca": "Es la medida más efectiva para casas y departamentos de último piso: frena la pérdida de calor en invierno y el calor del techo en verano.",
      "tip_practico": "Pide cotizar con aislación de 10 a 14 cm tendida sin huecos, con barrera de vapor hacia el lado interior y sin tapar la ventilación del entretecho. Un cielo bien aislado se nota desde la primera noche fría.",
      "precaucion": "Pide al maestro que revise antes la instalación eléctrica y los focos embutidos del cielo.",
      "donde_comprar": "Maestros e instaladores; materiales en Sodimac, Easy y distribuidores",
      "subsidio_ds27": "si"
    },
    {
      "id": "A02_aislacion_losa_techo_plano",
      "nombre": "Aislación sobre losa o techo plano con planchas aislantes",
      "descripcion_corta": "Planchas aislantes sobre losa o techo plano, con impermeabilización. Corrige el calor y el frío de techos de hormigón.",
      "categoria": "alto_impacto",
      "tags": [
        "fuga_techo"
      ],
      "elemento": "techo",
      "impacto": "alto",
      "impacto_termico_1_10": 9,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 20000,
        "max_clp": 45000,
        "tipico_clp": 900000,
        "unidad": "por m² (ejemplo total ~$900.000)",
        "caso_tipico": "30 m² de losa expuesta con aislación e impermeabilización"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso"
      ],
      "problema_que_ataca": "Corrige el calor y el frío que pasan por una losa de hormigón o un techo plano sin aislación, típico de departamentos de último piso.",
      "tip_practico": "En un edificio, la azotea es parte de las áreas comunes: necesitas el acuerdo de la comunidad. Pide cotización a una empresa con experiencia en impermeabilización y aislación.",
      "precaucion": "Una aislación mal puesta sobre una losa con filtraciones atrapa humedad. Corrige primero las filtraciones.",
      "donde_comprar": "Empresas de aislación e impermeabilización",
      "subsidio_ds27": "si"
    },
    {
      "id": "A03_aislacion_termica_exterior_muros",
      "nombre": "Aislación exterior de muros (sistema EIFS o similar)",
      "descripcion_corta": "Capa aislante continua por fuera del muro (EIFS). Corrige el muro frío y también los puntos fríos de pilares y vigas.",
      "categoria": "alto_impacto",
      "tags": [
        "muro_sin_aislacion",
        "puente_termico_muro",
        "frio_orientacion_sur"
      ],
      "elemento": "muros",
      "impacto": "alto",
      "impacto_termico_1_10": 9,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 35000,
        "max_clp": 65000,
        "tipico_clp": 2000000,
        "unidad": "por m² (ejemplo total ~$2.000.000)",
        "caso_tipico": "40 m² de fachada con poliestireno de 40 a 50 mm y revoque"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Envuelve el muro por fuera con una capa aislante continua, lo que también corrige los puntos fríos de pilares, vigas y esquinas.",
      "tip_practico": "Es la mejor opción técnica para muros sin aislación, pero también la más cara. Conviene hacerla junto con otras obras de fachada. En departamentos se decide entre la comunidad.",
      "precaucion": "Exige un maestro con experiencia comprobada en el sistema: una mala instalación se agrieta y filtra.",
      "donde_comprar": "Empresas constructoras y maestros especializados",
      "subsidio_ds27": "si"
    },
    {
      "id": "A04_trasdosado_interior_muros",
      "nombre": "Aislación interior de muros (trasdosado con lana o poliestireno y yeso-cartón)",
      "descripcion_corta": "Aislación y yeso-cartón por dentro del muro. Sirve cuando no se puede intervenir la fachada; resta unos 5 a 8 cm.",
      "categoria": "alto_impacto",
      "tags": [
        "muro_sin_aislacion",
        "frio_orientacion_sur"
      ],
      "elemento": "muros",
      "impacto": "alto",
      "impacto_termico_1_10": 7,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 22000,
        "max_clp": 40000,
        "tipico_clp": 1200000,
        "unidad": "por m² (ejemplo total ~$1.200.000)",
        "caso_tipico": "40 m² de muros exteriores en 2 o 3 piezas, con aislación y volcanita"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Mejora el muro desde adentro cuando no se puede intervenir la fachada, por ejemplo en edificios o en casas pareadas.",
      "tip_practico": "Parte por la pieza más fría (dormitorio o living al sur). Se pierde algo de espacio, unos 5 a 8 cm por muro.",
      "precaucion": "Puede dejar puntos fríos en esquinas y encuentros con la losa, donde puede aparecer humedad. Por eso conviene combinarla con buena ventilación.",
      "donde_comprar": "Maestros e instaladores; materiales en Sodimac y Easy",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "A05_termopanel_ventanas_pvc",
      "nombre": "Ventanas nuevas de PVC con termopanel (doble vidriado hermético)",
      "descripcion_corta": "Ventanas nuevas de PVC con termopanel. Cambian de una vez el vidrio simple, el marco metálico y las rendijas.",
      "categoria": "alto_impacto",
      "tags": [
        "vidrio_simple",
        "marco_metalico_frio",
        "infiltracion_ventanas",
        "frio_orientacion_sur"
      ],
      "elemento": "ventanas",
      "impacto": "alto",
      "impacto_termico_1_10": 9,
      "temporada": "ambas",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 140000,
        "max_clp": 280000,
        "tipico_clp": 1000000,
        "unidad": "por m² instalado (ejemplo total ~$1.000.000)",
        "caso_tipico": "3 ventanas, unos 5 m² en total, marco PVC y termopanel con instalación"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Cambia de una vez el vidrio simple, el marco metálico y las rendijas. Según el Manual CEV, el vidrio simple tiene U de 5,80 y el termopanel entre 2,80 y 3,58.",
      "tip_practico": "Parte por las ventanas del dormitorio y del lado sur, y por las de mayor tamaño. Pide ventanas proyectantes o abatibles, que sellan mejor que las correderas. Cotiza con 3 empresas.",
      "precaucion": "En departamentos, el cambio de ventanas que dan a la fachada requiere permiso de la comunidad.",
      "donde_comprar": "Empresas de ventanas PVC; cotizar en Sodimac y fabricantes",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "A06_sobreventana_doble_ventana",
      "nombre": "Sobreventana interior (doble ventana)",
      "descripcion_corta": "Segunda ventana por dentro, sin sacar la actual. Baja el U de 5,80 a unos 3,30: alternativa más barata al termopanel.",
      "categoria": "alto_impacto",
      "tags": [
        "vidrio_simple",
        "marco_metalico_frio",
        "infiltracion_ventanas"
      ],
      "elemento": "ventanas",
      "impacto": "alto",
      "impacto_termico_1_10": 7,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$",
        "min_clp": 60000,
        "max_clp": 130000,
        "tipico_clp": 450000,
        "unidad": "por m² (ejemplo total ~$450.000)",
        "caso_tipico": "5 m² de ventanas con una segunda ventana por dentro, con perfil y vidrio simple"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Agrega una segunda ventana por dentro, sin sacar la actual. Según el Manual CEV, una doble ventana baja el U de 5,80 a unos 3,30. Es una alternativa más barata que el termopanel.",
      "tip_practico": "Funciona bien cuando no puedes cambiar las ventanas de fachada. Pide que el cierre sea hermético y que se pueda abrir para limpiar.",
      "precaucion": null,
      "donde_comprar": "Talleres de aluminio y PVC; cotizar con 2 o 3 empresas",
      "subsidio_ds27": "consultar_ep"
    },
    {
      "id": "A07_ajuste_y_mantencion_ventanas",
      "nombre": "Ajuste de herrajes y cambio de burletes por un maestro",
      "descripcion_corta": "Un maestro ajusta herrajes y repone burletes. Mejora el cierre de ventanas que aún están en buen estado.",
      "categoria": "alto_impacto",
      "tags": [
        "infiltracion_ventanas"
      ],
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
        "caso_tipico": "Ajuste de ruedas y cierres, nuevo burlete y sellado, por un carpintero o técnico de ventanas"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Arregla ventanas correderas o de guillotina que ya no cierran bien. Mejora el sello sin cambiar todo el conjunto.",
      "tip_practico": "Conviene si los marcos están en buen estado y solo falla el cierre. Si el marco está torcido u oxidado, mejor evalúa el cambio completo.",
      "precaucion": null,
      "donde_comprar": "Carpinteros, técnicos de ventanas y talleres de aluminio",
      "subsidio_ds27": "no"
    },
    {
      "id": "A08_puerta_exterior_nueva",
      "nombre": "Puerta exterior de madera sólida o aislada, con marco sellado",
      "descripcion_corta": "Puerta de madera sólida o aislada con marco sellado. Reemplaza puertas huecas, delgadas o con vidrio.",
      "categoria": "alto_impacto",
      "tags": [
        "infiltracion_puerta"
      ],
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
        "caso_tipico": "Puerta maciza o con relleno aislante, con marco y burletes"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Reemplaza una puerta hueca, delgada o con vidrio. Según el Manual CEV, una puerta de madera sólida tiene U de 1,70 frente a 2,63 de una entablerada o hueca.",
      "tip_practico": "Haz primero la prueba de las medidas baratas (burletes). Si la puerta está muy dañada o es muy delgada, cambia la hoja y el marco juntos.",
      "precaucion": null,
      "donde_comprar": "Sodimac, Easy, carpinterías",
      "subsidio_ds27": "no"
    },
    {
      "id": "A09_proteccion_solar_exterior",
      "nombre": "Protección solar exterior fija o móvil (persianas, lamas o toldo)",
      "descripcion_corta": "Persianas exteriores, lamas o toldo que frenan el sol antes del vidrio. Mucho más efectivo que una cortina interior.",
      "categoria": "alto_impacto",
      "tags": [
        "sobrecalentamiento_poniente",
        "falta_sombra_solar"
      ],
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
        "caso_tipico": "Persiana exterior, toldo retráctil o lamas en una ventana al poniente"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "con_permiso",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Frena el sol de la tarde antes de que llegue al vidrio. Es mucho más efectivo que una cortina por dentro.",
      "tip_practico": "Prefiere una protección que puedas recoger en invierno para aprovechar el sol. Parte por la ventana del dormitorio o del living al poniente.",
      "precaucion": "En edificios, la fachada es área común: pide autorización a la administración.",
      "donde_comprar": "Empresas de toldos y persianas; cotizar con 2 o 3 proveedores",
      "subsidio_ds27": "no"
    },
    {
      "id": "A10_alero_pergola_vegetacion",
      "nombre": "Alero, pérgola o árbol de hoja caduca para dar sombra",
      "descripcion_corta": "Alero, pérgola o árboles de hoja caduca en el lado poniente. Dan sombra fija en verano y dejan pasar el sol en invierno.",
      "categoria": "alto_impacto",
      "tags": [
        "falta_sombra_solar",
        "sobrecalentamiento_poniente"
      ],
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
        "caso_tipico": "Pérgola de madera o metal con enredadera, o 1 o 2 árboles caducifolios en el lado poniente"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada"
      ],
      "problema_que_ataca": "Da sombra fija a la fachada poniente en verano y deja pasar el sol cuando pierde las hojas en invierno.",
      "tip_practico": "Un árbol demora años en dar buena sombra, así que combínalo con una malla o pérgola mientras crece. Consulta en tu municipalidad si necesitas permiso para plantar o construir.",
      "precaucion": "Planta lejos de cañerías, cimientos y cables. Para una pérgola, revisa los permisos de edificación de tu comuna.",
      "donde_comprar": "Viveros y maestros de carpintería o metalmecánica",
      "subsidio_ds27": "no"
    },
    {
      "id": "A11_correccion_puentes_termicos_puntuales",
      "nombre": "Aislación exterior parcial en pilares, vigas y esquinas frías",
      "descripcion_corta": "Aislación exterior solo en pilares, vigas y esquinas con humedad. Alternativa acotada a aislar todo el muro.",
      "categoria": "alto_impacto",
      "tags": [
        "puente_termico_muro"
      ],
      "elemento": "muros",
      "impacto": "medio",
      "impacto_termico_1_10": 6,
      "temporada": "invierno",
      "costo": {
        "simbolo": "$$$",
        "min_clp": 30000,
        "max_clp": 60000,
        "tipico_clp": 400000,
        "unidad": "por m² (ejemplo total ~$400.000)",
        "caso_tipico": "8 m² de aislación exterior en esquinas y pilares con humedad"
      },
      "dificultad": "profesional",
      "hazlo_tu_mismo": false,
      "apto_arrendatario": "no",
      "aplica_a": [
        "casa_aislada",
        "casa_pareada",
        "depto_ultimo_piso",
        "depto_intermedio",
        "depto_primer_piso"
      ],
      "problema_que_ataca": "Trata solo los puntos más fríos del muro (esquinas, pilares, vigas), donde aparece humedad y hongos aunque el resto del muro tenga aislación.",
      "tip_practico": "Es una alternativa más acotada que aislar todo el muro. Pide a un maestro que identifique los puntos con humedad antes de cotizar.",
      "precaucion": null,
      "donde_comprar": "Maestros e instaladores de aislación",
      "subsidio_ds27": "consultar_ep"
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
      "temporada": "ambas",
      "momento_del_dia": "Todo el día",
      "tags_generales": false,
      "descripcion": "Cierra siempre la tapa del entretecho. Si ya hay aislación arriba, no la aplastes ni guardes cosas pesadas encima: comprimida, aísla mucho menos."
    },
    {
      "id": "T09_secar_ropa_con_ventilacion",
      "titulo": "Evita secar ropa dentro de las piezas cerradas",
      "tags": [
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
        "infiltracion_ventanas"
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
        "falta_sombra_solar",
        "vidrio_simple"
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
        "puente_termico_muro",
        "frio_orientacion_sur",
        "vidrio_simple"
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
        "muro_sin_aislacion",
        "frio_orientacion_sur",
        "infiltracion_puerta"
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
        "quienes_no_pueden": "Quienes arriendan no pueden postular directamente porque exige propiedad; pueden compartir su diagnóstico con el dueño y usar las medidas de bajo costo.",
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
        "si_no": "Si eres arrendatario, los subsidios MINVU de mejoramiento no aplican directamente. Usa las medidas de bajo costo removibles o comparte tu reporte con el dueño."
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
      "descripcion": "Documento oficial que establece los procedimientos técnicos, tablas de transmitancia térmica (U) para vidrios, marcos y puertas, deterioro de muros antiguos, criterios de elementos adiabáticos, zonificación térmica nacional (Zona D para Santiago urbano) y la escala de calificación A+ a G en que se basa nuestra calculadora.",
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
