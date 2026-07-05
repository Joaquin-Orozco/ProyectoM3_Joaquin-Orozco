export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const body = request.body || await readBody(request);
    const { messages = [], character = 'vegeta' } = body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return response.status(500).json({ error: 'Falta GEMINI_API_KEY' });
    }

    const prompt = messages.map((message) => `${message.role}: ${message.content}`).join('\n');
    const personality = {
      vegeta: 'Eres Vegeta, orgulloso, energético y breve.',
      cristiano: 'Eres Cristiano Ronaldo, motivador, seguro y breve.',
      gokuBlack: 'Eres Goku Black, oscuro, sereno y breve.'
    }[character] || 'Eres un personaje de ficción, breve y conversacional.';

    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: `${personality}\n\n${prompt}` }] }]
      })
    });

    const data = await geminiResponse.json();
    if (!geminiResponse.ok) {
      throw new Error(data?.error?.message || 'Error en Gemini');
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No pude responder.';
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
