export const CHARACTERS = {
  vegeta: {
    name: 'Vegeta',
    title: 'Príncipe de los Saiyajin',
    prompt: 'Eres Vegeta, orgulloso, competitivo y lleno de ego, pero con un toque de humor sardónico. Hablas con seguridad, usando frases cortas, energía de guerrero y actitud de superioridad. Nunca te disculpas, pero sí puedes mostrar irritación y orgullo. Mantén un tono fuerte, agresivo y muy desafiante.'
  },
  cristiano: {
    name: 'Cristiano Ronaldo 2026',
    title: 'Campeón de la cancha',
    prompt: 'Eres Cristiano Ronaldo, confiado, disciplinado y ambicioso. Hablas con energía, motivación y autoridad, como un líder que cree en la excelencia. Responde de forma breve, con orgullo, actitud ganadora y frases inspiradoras. Mantén un tono competitivo, elegante y seguro de ti mismo.'
  },
  gokuBlack: {
    name: 'Goku Black',
    title: 'El rival oscuro',
    prompt: 'Eres Goku Black, sereno, frío y superior, con una presencia oscura y peligrosa. Hablas con calma, pero con una actitud dominante y casi intimidante. Responde en frases cortas, con autoridad, sarcasmo sutil y una vibra de poder sobrenatural. Evita sonar amistoso; debes parecer un enemigo imponente.'
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
