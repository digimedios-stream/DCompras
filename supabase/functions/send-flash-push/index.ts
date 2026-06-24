import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3"
import webpush from "npm:web-push"

// Configurar Web Push con las VAPID keys de las variables de entorno
// Estas variables deberán agregarse a Supabase usando:
// npx supabase secrets set VAPID_PUBLIC_KEY="..." VAPID_PRIVATE_KEY="..."
webpush.setVapidDetails(
  'mailto:soporte@dcompras.com',
  Deno.env.get('VAPID_PUBLIC_KEY') ?? '',
  Deno.env.get('VAPID_PRIVATE_KEY') ?? ''
);

serve(async (req) => {
  try {
    // 1. Validar el body (esperamos que el Trigger envíe el record)
    const body = await req.json();
    const record = body.record;

    if (!record) {
      return new Response(JSON.stringify({ error: "No record found" }), { status: 400 });
    }

    // 2. Conectar a Supabase usando la clave de servicio
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 3. Obtener todas las suscripciones
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (error) {
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: "No active subscriptions" }), { status: 200 });
    }

    // 4. Preparar el Payload del mensaje
    const payload = JSON.stringify({
      title: "⚡ ¡Nueva Oferta Flash!",
      body: record.description || "¡Aprovecha esta oportunidad por tiempo limitado!",
      url: "/?tab=ofertas" // Redirige a la pestaña de ofertas
    });

    // 5. Enviar las notificaciones en paralelo
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          payload
        );
      } catch (err) {
        console.error(`Error sending to endpoint ${sub.endpoint}:`, err);
        // Si el error es de suscripción inválida/expirada (410), podríamos borrarla de la DB
        if (err.statusCode === 410 || err.statusCode === 404) {
          await supabase.from('push_subscriptions').delete().eq('id', sub.id);
        }
      }
    });

    await Promise.all(sendPromises);

    return new Response(JSON.stringify({ message: `Sent push to ${subscriptions.length} devices` }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
