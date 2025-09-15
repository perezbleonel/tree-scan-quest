import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// NOTE: Ensure you have an OPENAI_API_KEY secret set in your Supabase project.
// npx supabase secrets set OPENAI_API_KEY "sk-..."
/* const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
 */const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");


const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests for browser-based clients
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { treeName } = await req.json();
    if (!treeName) {
      throw new Error("No se proporcionó el nombre del árbol (treeName).");
    }
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

    // You can replace this with any LLM API call
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You're an assistant who gives short, interesting, and surprising facts about nature to children. Answer with just the fact, without any introductory text. Give me a fun fact about the tree: ${treeName} Answer in Spanish`
          }]
        }]
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error de la API de Google: ${errorData.error.message}`);
    }
    
    const completion = await response.json();
    const funFact = completion.candidates[0].content.parts[0].text.trim();

    return new Response(
      JSON.stringify({ funFact }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
