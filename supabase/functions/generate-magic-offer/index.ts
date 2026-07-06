import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "npm:@google/generative-ai"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { keywords, commerceName } = await req.json()

    if (!keywords) {
      return new Response(
        JSON.stringify({ error: 'Keywords are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    let apiKey = Deno.env.get('GEMINI_API_KEY')
    if (apiKey) {
      apiKey = apiKey.replace(/^["']|["']$/g, '').trim();
    }
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY no está configurada')
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // ¡Usar gemini-flash-latest! (El único modelo estable y rápido listado en tu consola)
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `Eres un experto copywriter de marketing. Escribe un texto corto, vendedor y persuasivo para una "Oferta Flash" del comercio "${commerceName || 'local'}". 
    Las palabras clave de la oferta son: "${keywords}".
    REGLAS ESTRICTAS:
    1. El texto DEBE tener como máximo 2 oraciones breves.
    2. DEBES incluir 2 o 3 emojis relevantes.
    3. NO incluyas saludos ni despedidas, ve directo al grano.
    4. El tono debe ser urgente y atractivo.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text();

    if (!generatedText) {
      throw new Error('No se pudo generar el texto');
    }

    return new Response(
      JSON.stringify({ text: generatedText.trim() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error procesando la solicitud:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Error interno del servidor' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
