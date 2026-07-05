import { CHARACTERS, formatTimestamp, getStoredHistory, saveStoredHistory } from './utils.js';

const app = document.getElementById('app');
const STORAGE_KEY = 'personaje-chat-history';

let currentCharacter = 'vegeta';
let messages = [];

function render() {
  const route = window.location.pathname.replace(/\/$/, '') || '/home';
  const normalized = route === '' ? '/home' : route;
  if (normalized === '/chat') {
    renderChat();
  } else if (normalized === '/about') {
    renderAbout();
  } else {
    renderHome();
  }
}

function renderShell(content) {
  app.innerHTML = `
    <nav>
      <a href="/home" data-link class="${window.location.pathname === '/home' ? 'active' : ''}">Home</a>
      <a href="/chat" data-link class="${window.location.pathname === '/chat' ? 'active' : ''}">Chat</a>
      <a href="/about" data-link class="${window.location.pathname === '/about' ? 'active' : ''}">About</a>
    </nav>
    <main class="container">${content}</main>
  `;
  document.querySelectorAll('[data-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(link.getAttribute('href'));
    });
  });
}

function renderHome() {
  renderShell(`
    <section class="home">
      <div class="card">
        <h1>Habla con un personaje inolvidable</h1>
        <p>Elige un personaje y vive una conversación épica con inteligencia artificial de forma segura.</p>
        <a href="/chat" data-link><button>Comenzar a chatear</button></a>
      </div>
      <div class="character-grid">
        ${Object.entries(CHARACTERS).map(([key, character]) => `
          <div class="character-card ${key === currentCharacter ? 'active' : ''}" data-character="${key}">
            <h3>${character.name}</h3>
            <p>${character.title}</p>
          </div>
        `).join('')}
      </div>
    </section>
  `);
  document.querySelectorAll('[data-character]').forEach((card) => {
    card.addEventListener('click', () => {
      currentCharacter = card.dataset.character;
      render();
    });
  });
}

function renderAbout() {
  renderShell(`
    <section class="about">
      <div class="card">
        <h2>Sobre este proyecto</h2>
        <p>Esta SPA permite conversar con personajes distintos usando una función serverless que protege la API key de Gemini.</p>
      </div>
    </section>
  `);
}

function renderChat() {
  const safeMessages = messages.length ? messages : getStoredHistory(STORAGE_KEY);
  if (safeMessages.length && messages.length === 0) messages = safeMessages;
  renderShell(`
    <section class="chat">
      <div class="card">
        <h2>Chat con ${CHARACTERS[currentCharacter].name}</h2>
        <p>${CHARACTERS[currentCharacter].title}</p>
        <div class="chat-shell">
          <div class="messages" id="messages"></div>
          <div class="input-row">
            <input id="message-input" placeholder="Escribe tu mensaje..." />
            <button id="send-btn">Enviar</button>
            <button id="clear-btn" class="secondary">Borrar historial</button>
          </div>
          <div class="status" id="chat-status">Listo para conversar.</div>
        </div>
      </div>
    </section>
  `);

  const messagesEl = document.getElementById('messages');
  const input = document.getElementById('message-input');
  const sendBtn = document.getElementById('send-btn');
  const clearBtn = document.getElementById('clear-btn');
  const statusEl = document.getElementById('chat-status');

  renderMessages(messagesEl);

  const sendMessage = async () => {
    const content = input.value.trim();
    if (!content) return;
    const userMessage = { role: 'user', content, timestamp: new Date().toISOString() };
    messages = [...messages, userMessage];
    saveStoredHistory(STORAGE_KEY, messages);
    renderMessages(messagesEl);
    input.value = '';
    statusEl.textContent = 'Escribiendo...';

    try {
      const response = await fetch('/api/functions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages, character: currentCharacter })
      });
      const rawText = await response.text();
      let data;
      try {
        data = rawText ? JSON.parse(rawText) : {};
      } catch (jsonError) {
        throw new Error(`Respuesta inválida de la API: ${rawText}`);
      }

      if (!response.ok) throw new Error(data.error || `Error al contactar con la IA: ${rawText}`);

      const assistantMessage = {
        role: 'assistant',
        content: data.text || 'No pude generar una respuesta.',
        timestamp: new Date().toISOString()
      };
      messages = [...messages, assistantMessage];
      saveStoredHistory(STORAGE_KEY, messages);
      renderMessages(messagesEl);
      statusEl.textContent = 'Respuesta enviada.';
    } catch (error) {
      statusEl.textContent = error.message;
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      sendMessage();
    }
  });
  clearBtn.addEventListener('click', () => {
    messages = [];
    saveStoredHistory(STORAGE_KEY, []);
    renderMessages(messagesEl);
    statusEl.textContent = 'Historial borrado.';
  });
}

function renderMessages(messagesEl) {
  messagesEl.innerHTML = messages.map((message) => `
    <div class="message ${message.role === 'user' ? 'user' : 'assistant'}">
      <div>${message.content}</div>
      <div class="message-meta">${formatTimestamp(message.timestamp)}</div>
    </div>
  `).join('');
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function navigate(path) {
  window.history.pushState({}, '', path);
  render();
}

window.addEventListener('popstate', render);
window.addEventListener('DOMContentLoaded', () => {
  const stored = getStoredHistory(STORAGE_KEY);
  if (stored.length) messages = stored;
  render();
});

export { render };
