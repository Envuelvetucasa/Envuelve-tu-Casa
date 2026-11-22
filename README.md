# Envuelve tu Casa — Plataforma de Diagnóstico Térmico Residencial

Plataforma web gratuita y mobile-first para viviendas (casas y departamentos) de Santiago, Chile (Zona Térmica D). Basada en parámetros del Manual Técnico CEV del MINVU.

## Archivos incluidos
- `index.html`: Página principal y estructura visual.
- `thermalEngine.js`: Motor lógico CEV (cálculo de U ventana, elementos adiabáticos, modulador solar y escala A+ a G).
- `questionsData.js`: Las 15 preguntas, textos de ayuda `?` y Asistente Interactivo Guiado.
- `solutionsCatalog.js`: Banco de soluciones (Mayor Impacto, Bajo Costo < $30.000 CLP), Subsidio DS 27 y tips costo $0.
- `supabaseConfig.js`: Credenciales de conexión a Supabase.
- `app.js`: Navegación, lógica de encuesta, reporte PDF/WhatsApp y panel `/estadisticas`.
- `vercel.json`: Configuración para evitar errores 404 al recargar rutas en Vercel.

## Cómo publicar en GitHub y Vercel (5 minutos)
1. Crea un repositorio nuevo en GitHub (ej. `envuelve-tu-casa`).
2. Sube todos estos archivos a la raíz del repositorio (puedes arrastrarlos en "Upload files").
3. Entra a `vercel.com` -> Add New Project -> Importa el repositorio -> Presiona **Deploy**.

## Cómo conectar la base de datos (Supabase)
1. En `supabase.com`, crea un proyecto nuevo y ejecuta este SQL en **SQL Editor**:

```sql
CREATE TABLE diagnosticos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  comuna TEXT NOT NULL,
  tipo_vivienda TEXT NOT NULL,
  antiguedad TEXT NOT NULL,
  respuestas_json JSONB NOT NULL,
  letra_estimada TEXT NOT NULL,
  ahorro_estimado_pct INTEGER NOT NULL,
  puntaje_invierno INTEGER NOT NULL,
  puntaje_verano INTEGER NOT NULL,
  debilidades TEXT[] NOT NULL
);

ALTER TABLE diagnosticos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir insertar diagnosticos anonimos" ON diagnosticos FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura agregada" ON diagnosticos FOR SELECT USING (true);
```

2. En Supabase ve a **Project Settings -> API** y copia tu **Project URL** y **anon public key**.
3. Edita `supabaseConfig.js` en GitHub pegando esos dos textos y haz commit. Vercel actualizará la web automáticamente.
4. Abre `https://tu-web.vercel.app/estadisticas` para ver los diagnósticos guardados en tiempo real y exportar CSV.
