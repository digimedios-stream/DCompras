import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno desde .env manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let envPath = path.resolve(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  envPath = path.resolve(__dirname, '.env');
}

if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY; // Usar el ROLE KEY si ANON KEY no tiene permisos para borrar sin autenticación, pero por las políticas públicas puede que funcione.

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no encontradas en el archivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getAllStorageFiles(folder) {
  const { data, error } = await supabase.storage.from('comercios').list(folder, {
    limit: 1000, // Ajusta esto si tienes más de 1000 imágenes por carpeta
    offset: 0,
    sortBy: { column: 'name', order: 'asc' },
  });

  if (error) {
    console.error(`Error listando archivos en la carpeta ${folder}:`, error);
    return [];
  }
  
  // Filtrar el archivo invisible de placeholder que crea supabase a veces
  return data.filter(file => file.name !== '.emptyFolderPlaceholder' && file.id).map(f => `${folder}/${f.name}`);
}

async function runCleanup() {
  console.log('Iniciando script de limpieza de imágenes huérfanas...');
  
  // 1. Obtener todas las imágenes referenciadas en la base de datos
  const { data: comercios, error: comError } = await supabase.from('comercios').select('main_image, gallery_images');
  if (comError) throw comError;

  const { data: ofertas, error: ofError } = await supabase.from('ofertas').select('image_url');
  if (ofError) throw ofError;

  const dbImages = new Set();
  
  // Función para extraer el path relativo (ej: principales/foto.jpg) desde la URL completa
  const getPathFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    const marker = '/public/comercios/';
    const index = url.indexOf(marker);
    if (index !== -1) {
      return decodeURI(url.substring(index + marker.length));
    }
    return null;
  };

  comercios.forEach(c => {
    if (c.main_image) {
      const p = getPathFromUrl(c.main_image);
      if (p) dbImages.add(p);
    }
    if (c.gallery_images && Array.isArray(c.gallery_images)) {
      c.gallery_images.forEach(img => {
        const p = getPathFromUrl(img);
        if (p) dbImages.add(p);
      });
    }
  });

  ofertas.forEach(o => {
    if (o.image_url) {
      const p = getPathFromUrl(o.image_url);
      if (p) dbImages.add(p);
    }
  });

  console.log(`-> Se encontraron ${dbImages.size} imágenes activas en la base de datos.`);

  // 2. Obtener todas las imágenes físicas guardadas en el Storage (en sus 3 carpetas)
  const folders = ['galeria', 'principales', 'ofertas'];
  let storageFiles = [];
  
  for (const folder of folders) {
    const files = await getAllStorageFiles(folder);
    storageFiles = storageFiles.concat(files);
  }

  console.log(`-> Se encontraron ${storageFiles.length} imágenes físicas en el Storage.`);

  // 3. Comparar ambas listas para encontrar las huérfanas
  const orphanFiles = storageFiles.filter(file => !dbImages.has(file));
  
  if (orphanFiles.length === 0) {
    console.log('✅ No se encontraron imágenes huérfanas. El almacenamiento está limpio.');
    return;
  }

  console.log(`⚠️  ¡Se detectaron ${orphanFiles.length} imágenes huérfanas!`);
  
  // Mostrar algunos ejemplos de imágenes a borrar
  console.log('Archivos a eliminar (ejemplos):', orphanFiles.slice(0, 5));

  // 4. Proceder a eliminar
  console.log('Procediendo a eliminar las imágenes huérfanas del Storage...');
  
  const { data, error: rmError } = await supabase.storage.from('comercios').remove(orphanFiles);
  
  if (rmError) {
    console.error('❌ Error al intentar eliminar las imágenes:', rmError);
  } else {
    console.log(`✅ ¡Éxito! Se han eliminado correctamente ${data.length} imágenes basura.`);
  }
}

runCleanup().catch(console.error);
