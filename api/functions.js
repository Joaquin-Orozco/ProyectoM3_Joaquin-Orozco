export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = request.body || await readBody(request);
    const { messages = [], character = 'vegeta' } = body;
    const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '').trim();

    if (!apiKey) {
      return response.status(500).json({ error: 'Falta GEMINI_API_KEY. Añádela en Vercel como variable de entorno.' });
    }

    const prompt = messages.map((message) => `${message.role}: ${message.content}`).join('\n');
    const personality = {
      vegeta: 'Eres Vegeta, orgulloso, energético y breve.',
      cristiano: 'Eres Cristiano Ronaldo, motivador, seguro y breve.',
      gokuBlack: 'Eres Goku Black, oscuro, sereno y breve.'
    }[character] || 'Eres un personaje de ficción, breve y conversacional.';

    const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateText?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: {
          text: `${personality}\n\n${prompt}`
        },
        temperature: 0.55,
        maxOutputTokens: 250,
        topP: 0.9
      })
    });

    const rawText = await geminiResponse.text();
    let data;
    try {
      data = rawText ? JSON.parse(rawText) : {};
    } catch {
      throw new Error(`Respuesta inválida de Gemini: ${rawText}`);
    }

    if (!geminiResponse.ok) {
      const message = data?.error?.message || data?.error?.status || 'Error en Gemini';
      throw new Error(`Gemini: ${message}`);
    }

    const text = data?.candidates?.[0]?.output || data?.candidates?.[0]?.content?.parts?.[0]?.text || data?.output?.text || 'No pude responder.';
    return response.status(200).json({ text });
  } catch (error) {
    return response.status(500).json({ error: error.message || 'Error inesperado' });
  }
}

async function readBody(request) {
  if (request.body) return request.body;

  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.from(chunk));
  }

  const raw = Buffer.concat(chunks).toString();
  if (!raw) return {};

  try {
    return JSON.parse(raw);
  } catch {
    return { raw };
  }
}
