import { createClient } from '@supabase/supabase-js';

// Reemplaza con tus credenciales de Supabase
const supabaseUrl = 'TU_SUPABASE_URL';
const supabaseKey = 'TU_SUPABASE_SERVICE_ROLE_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateLocations() {
  console.log("Obteniendo comercios...");
  const { data: comercios, error } = await supabase.from('comercios').select('id, maps_url');
  
  if (error) {
    console.error("Error obteniendo comercios:", error);
    return;
  }

  let actualizados = 0;

  for (const comercio of comercios) {
    if (comercio.maps_url) {
      const match = comercio.maps_url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/) || comercio.maps_url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (match) {
        const latitud = parseFloat(match[1]);
        const longitud = parseFloat(match[2]);

        const { error: updateError } = await supabase
          .from('comercios')
          .update({ latitud, longitud })
          .eq('id', comercio.id);

        if (updateError) {
          console.error(`Error actualizando comercio ${comercio.id}:`, updateError);
        } else {
          actualizados++;
          console.log(`Actualizado comercio ${comercio.id} con lat: ${latitud}, lon: ${longitud}`);
        }
      }
    }
  }

  console.log(`Migración completada. Se actualizaron ${actualizados} comercios.`);
}

migrateLocations();
