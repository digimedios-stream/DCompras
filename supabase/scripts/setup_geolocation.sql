-- 1. Activar la extensión de PostGIS para poder calcular distancias
create extension if not exists postgis;

-- 2. Agregar columnas de latitud y longitud a la tabla comercios
alter table public.comercios add column if not exists latitud numeric;
alter table public.comercios add column if not exists longitud numeric;

-- 3. (Opcional) Si en el futuro quieres una función RPC avanzada de Supabase, 
-- la agregaremos. Por ahora, calcularemos la distancia directamente en la aplicación
-- para mayor flexibilidad y velocidad, ya que todos los comercios se cargan en memoria.
