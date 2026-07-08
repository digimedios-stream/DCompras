-- 1. Crear la tabla de Atractivos Turísticos
create table if not exists public.atractivos_turisticos (
  id uuid default gen_random_uuid() primary key,
  locality_id uuid references public.localidades(id) on delete cascade not null,
  historian_id uuid references auth.users(id) on delete set null,
  historian_name text,
  name text not null,
  description text,
  image_url text,
  maps_url text,
  whatsapp text,
  latitud numeric,
  longitud numeric,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Políticas de Seguridad (RLS) para evitar accesos no autorizados
alter table public.atractivos_turisticos enable row level security;

-- Permitir lectura a todo el público (ya que son atractivos turísticos)
create policy "Permitir lectura pública" on public.atractivos_turisticos for select using (true);

-- Permitir inserción solo a usuarios autenticados
create policy "Permitir inserción a autenticados" on public.atractivos_turisticos for insert to authenticated with check (true);

-- Permitir actualización y borrado solo a usuarios autenticados
create policy "Permitir actualización a autenticados" on public.atractivos_turisticos for update to authenticated using (true);
create policy "Permitir borrado a autenticados" on public.atractivos_turisticos for delete to authenticated using (true);
