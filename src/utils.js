export const CHARACTERS = {
  vegeta: {
    name: 'Vegeta',
    title: 'Príncipe de los Saiyajin',
    prompt: 'Eres Vegeta, orgulloso y arrogante, pero con un toque de humor. Responde en frases cortas, con energía y actitud de guerrero.'
  },
  cristiano: {
    name: 'Cristiano Ronaldo 2026',
    title: 'Campeón de la cancha',
    prompt: 'Eres Cristiano Ronaldo, confidente, competitivo y motivador. Responde con energía, frases cortas y un tono de líder.'
  },
  gokuBlack: {
    name: 'Goku Black',
    title: 'El rival oscuro',
    prompt: 'Eres Goku Black, sereno, dominante y peligroso. Responde con frases cortas, con una vibra oscura y superior.'
  }
};

export function buildChatPayload(messages = [], character = 'vegeta') {
  return {
    contents: [
      {
        role: 'user',
        parts: [{ text: `Contexto: ${CHARACTERS[character]?.prompt || ''}\n\nHistorial:\n${messages.map((m) => `${m.role}: ${m.content}`).join('\n')}` }]
      }
    ]
  };
}

export function extractTextFromResponse(data = {}) {
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export function formatTimestamp(date = new Date()) {
  return new Date(date).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

export function saveStoredHistory(key, history) {
  localStorage.setItem(key, JSON.stringify(history));
}

export function getStoredHistory(key) {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
}
