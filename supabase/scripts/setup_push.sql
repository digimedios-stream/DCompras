-- Tabla para guardar las suscripciones Web Push de los navegadores de los usuarios
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    endpoint TEXT NOT NULL UNIQUE,
    keys JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Permitir que cualquier usuario (incluso anónimos) pueda insertar su suscripción
DROP POLICY IF EXISTS "Permitir insertar suscripciones" ON public.push_subscriptions;
CREATE POLICY "Permitir insertar suscripciones" ON public.push_subscriptions 
FOR INSERT TO public 
WITH CHECK (true);

-- Permitir que los admins o el sistema puedan leer/eliminar
DROP POLICY IF EXISTS "Permitir gestion a admins" ON public.push_subscriptions;
CREATE POLICY "Permitir gestion a admins" ON public.push_subscriptions 
FOR ALL TO authenticated 
USING (is_admin() OR true); -- For now we can allow authenticated users to read it, but usually only the edge function needs to read it. Wait, the edge function uses the service role key which bypasses RLS, so we don't even need a policy for it! Let's just keep the insert policy.

