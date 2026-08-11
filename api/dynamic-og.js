import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function escapeHtml(unsafe) {
  if (!unsafe) return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req, res) {
  const { comercio, oferta, atractivo } = req.query;

  // 1. Leer el index.html directamente del sistema de archivos (no vía HTTP)
  // Vercel despliega el proyecto build en el directorio raíz de la función
  let html = '';
  try {
    const possiblePaths = [
      path.join(process.cwd(), 'dist', 'index.html'),
      path.join(process.cwd(), 'index.html'),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        html = fs.readFileSync(p, 'utf-8');
        console.log('Leyendo HTML desde:', p);
        break;
      }
    }

    if (!html) {
      // Fallback: generar HTML mínimo con las OG tags
      html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta property="og:title" content="D'Compras | Tu guía local" />
    <meta property="og:description" content="Encuentra los mejores comercios, servicios y ofertas en tu localidad." />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://www.dcomprasweb.com.ar/icon-512.png" />
  </head>
  <body>
    <script>window.location.href = "/";</script>
  </body>
</html>`;
    }
  } catch (e) {
    console.error('Error leyendo index.html:', e);
    return res.status(500).send('Error interno');
  }

  // 2. Valores por defecto de Open Graph
  const baseUrl = 'https://www.dcomprasweb.com.ar';
  let ogTitle = "D'Compras | Tu guía local";
  let ogDescription = 'Encuentra los mejores comercios, servicios y ofertas en tu localidad.';
  let ogImage = `${baseUrl}/icon-512.png`;
  let ogUrl = `${baseUrl}/?`;

  // 3. Buscar datos dinámicos en Supabase
  try {
    if (comercio) {
      ogUrl += `comercio=${comercio}`;
      
      // Detectar si es un slug de texto (no numérico)
      const isNumeric = /^\d+$/.test(comercio);
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(comercio);
      
      let query = supabase.from('comercios').select('name, main_image, description');
      if (isNumeric || isUuid) {
        query = query.or(`id.eq.${comercio},slug.eq.${comercio}`);
      } else {
        query = query.eq('slug', comercio);
      }
      
      const { data, error } = await query.maybeSingle();
      
      if (error) {
        console.error('Supabase error:', JSON.stringify(error));
      } else if (data) {
        ogTitle = `${data.name} | D'Compras`;
        if (data.description) ogDescription = data.description.substring(0, 200);
        if (data.main_image) ogImage = data.main_image;
        console.log('Comercio encontrado:', data.name, '| Imagen:', data.main_image);
      } else {
        console.log('Comercio no encontrado para slug:', comercio);
      }
    } else if (oferta) {
      ogUrl += `oferta=${oferta}`;
      const { data } = await supabase
        .from('ofertas')
        .select('description, comercios(name)')
        .eq('id', oferta)
        .maybeSingle();
      if (data) {
        ogTitle = `Oferta Flash de ${data.comercios?.name || "D'Compras"}`;
        ogDescription = data.description || '¡Aprovecha esta oferta flash por tiempo limitado!';
      }
    } else if (atractivo) {
      ogUrl += `atractivo=${atractivo}`;
      const { data } = await supabase
        .from('atractivos_turisticos')
        .select('name, description, image_url')
        .eq('id', atractivo)
        .maybeSingle();
      if (data) {
        ogTitle = `${data.name} | Turismo en D'Compras`;
        if (data.description) ogDescription = data.description.substring(0, 200);
        if (data.image_url) ogImage = data.image_url;
      }
    }
  } catch (err) {
    console.error('Error consultando Supabase:', err);
  }

  // 4. Inyectar las etiquetas OG en el HTML
  // Reemplazar tags existentes
  html = html.replace(
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"[^>]*>/i,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`
  );
  html = html.replace(
    /<title>[^<]*<\/title>/i,
    `<title>${escapeHtml(ogTitle)}</title>`
  );

  // Si no existían las etiquetas en el HTML (el build las borró), insertar en el <head>
  if (!html.includes('property="og:title"')) {
    const ogTags = `
    <meta property="og:title" content="${escapeHtml(ogTitle)}" />
    <meta property="og:description" content="${escapeHtml(ogDescription)}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${escapeHtml(ogImage)}" />
    <meta property="og:url" content="${escapeHtml(ogUrl)}" />`;
    html = html.replace('</head>', ogTags + '\n  </head>');
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, no-cache');
  return res.status(200).send(html);
}
