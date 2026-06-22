-- Copia y pega esto en el Editor SQL de Supabase y dale a "Run"
ALTER TABLE public.comercios ADD COLUMN IF NOT EXISTS keywords text[] DEFAULT '{}';
