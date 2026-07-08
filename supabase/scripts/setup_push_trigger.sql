-- ============================================================
-- CORRECCIÓN: Trigger que llama a la Edge Function con Authorization
-- Copia y pega esto en el Editor SQL de Supabase y dale a "Run"
-- ============================================================

-- 1. Reemplazar la función del trigger con la versión corregida
CREATE OR REPLACE FUNCTION public.trigger_flash_offer_push()
RETURNS TRIGGER AS $$
DECLARE
  edge_function_url TEXT := 'https://pmsmtfknhvpfyjjdsiqq.supabase.co/functions/v1/send-flash-push';
  anon_key TEXT := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtc210ZmtuaHZwZnlqamRzaXFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMzI2NTQsImV4cCI6MjA5MjkwODY1NH0.KmHJT5RbAwq1dXM3Z7iEgj8K2LmYWABnK1lwxu8VIz0';
  request_body JSONB;
BEGIN
  -- Construir el JSON que enviaremos a la Edge Function
  request_body := jsonb_build_object(
    'type', TG_OP,
    'table', TG_TABLE_NAME,
    'schema', TG_TABLE_SCHEMA,
    'record', to_jsonb(NEW)
  );

  -- Llamar a la Edge Function con el header Authorization incluido
  PERFORM net.http_post(
      url := edge_function_url,
      body := request_body,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || anon_key
      )
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Recrear el trigger en la tabla ofertas
DROP TRIGGER IF EXISTS on_oferta_created_push ON public.ofertas;
CREATE TRIGGER on_oferta_created_push
  AFTER INSERT
  ON public.ofertas
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_flash_offer_push();
