import { describe, expect, it } from 'vitest';
import { buildChatPayload, extractTextFromResponse, formatTimestamp, getStoredHistory, saveStoredHistory } from '../src/utils.js';

describe('utilidades del chat', () => {
  it('construye el payload con el historial y el personaje', () => {
    const payload = buildChatPayload([
      { role: 'user', content: 'Hola' },
      { role: 'assistant', content: 'Hola, ¿cómo te va?' }
    ], 'vegeta');

    expect(payload.contents).toHaveLength(1);
    expect(payload.contents[0].parts[0].text).toContain('Vegeta');
    expect(payload.contents[0].parts[0].text).toContain('Hola');
  });

  it('extrae el texto de una respuesta de Gemini', () => {
    const text = extractTextFromResponse({ candidates: [{ content: { parts: [{ text: 'Respuesta de prueba' }] } }] });
    expect(text).toBe('Respuesta de prueba');
  });

  it('formatea la hora correctamente', () => {
    const date = new Date('2024-01-01T09:05:00');
    expect(formatTimestamp(date)).toBe('09:05');
  });

  it('guarda y recupera el historial en localStorage', () => {
    const key = 'chat-history-test';
    const history = [{ role: 'user', content: 'Prueba' }];

    saveStoredHistory(key, history);
    expect(getStoredHistory(key)).toEqual(history);
  });
});
