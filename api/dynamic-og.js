import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

export default async function handler(req, res) {
  const { comercio, oferta, atractivo } = req.query;

  // 1. Fetch base HTML
  const protocol = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers.host || 'www.dcomprasweb.com.ar';
  const baseUrl = `${protocol}://${host}`;
  
  let html = '';
  try {
    // Al pedir la URL base sin parámetros, Vercel devolverá el index.html
    const response = await fetch(`${baseUrl}/`);
    html = await response.text();
  } catch (e) {
    console.error("Error fetching base HTML:", e);
    return res.status(500).send('Error loading base HTML');
  }

  let ogTitle = "D'Compras | Tu guía local";
  let ogDescription = "Encuentra los mejores comercios, servicios y ofertas en tu localidad.";
  let ogImage = `${baseUrl}/icon-512.png`;

  // 2. Fetch dynamic data from Supabase
  try {
    if (comercio) {
      let isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(comercio);
      let isNumeric = !isNaN(comercio) && !isNaN(parseFloat(comercio));
      
      let query = supabase.from('comercios').select('name, main_image, description');
      if (isUuid || isNumeric) {
        query = query.or(`id.eq.${comercio},slug.eq.${comercio}`);
      } else {
        query = query.eq('slug', comercio);
      }
      
      const { data, error } = await query.single();
      
      if (error) {
        console.error("Supabase query error:", error);
      } else if (data) {
        ogTitle = `${data.name} | D'Compras`;
        if (data.description) ogDescription = data.description;
        if (data.main_image) ogImage = data.main_image;
      }
    } else if (oferta) {
      const { data, error } = await supabase
        .from('ofertas')
        .select('description, image_url, comercios(name)')
        .eq('id', oferta)
        .single();
        
      if (data) {
        ogTitle = `Oferta Flash de ${data.comercios?.name || "D'Compras"}`;
        ogDescription = data.description || "¡Aprovecha esta oferta flash por tiempo limitado!";
        // El usuario solicitó explícitamente que la oferta muestre el logo de DCompras (la imagen por defecto)
        // en lugar de la imagen de la oferta.
      }
    } else if (atractivo) {
      const { data, error } = await supabase
        .from('atractivos_turisticos')
        .select('name, description, image_url')
        .eq('id', atractivo)
        .single();
        
      if (data) {
        ogTitle = `${data.name} | Turismo en D'Compras`;
        if (data.description) ogDescription = data.description;
        if (data.image_url) ogImage = data.image_url;
      }
    }
  } catch (err) {
    console.error("Error querying Supabase for OG tags:", err);
    // En caso de error, dejamos los valores por defecto
  }

  // 3. Reemplazar las etiquetas Meta en el HTML
  // Esto asume que index.html tiene las etiquetas predeterminadas exactas (o muy similares)
  html = html.replace(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(ogTitle)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(ogDescription)}" />`
  );
  html = html.replace(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`
  );

  // También actualizar el tag <title>
  html = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${escapeHtml(ogTitle)}</title>`
  );

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Evitamos el caché en redes sociales para que puedan reflejar cambios si los hay
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
  res.status(200).send(html);
}
