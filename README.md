# Proyecto M3 - Chat con personajes

## Descripción del personaje elegido

La aplicación permite conversar con tres personajes distintos: Vegeta, Cristiano Ronaldo 2026 y Goku Black. Cada uno tiene un estilo de respuesta propio para hacer la experiencia más interesante.

## Requisitos

- Node.js 18+
- npm
- Una clave de API de Google Gemini (se obtiene en Google AI Studio)

## Ejecución local

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Crea un archivo `.env` en la raíz del proyecto con tu clave:
   ```bash
   GEMINI_API_KEY=tu_api_key_aqui
   ```
3. Inicia el proyecto localmente:
   ```bash
   npm run dev
   ```
4. Abre la URL que muestre Vercel Dev, normalmente http://localhost:3000/.

## Tests

```bash
npm test
```

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Conecta el repositorio en Vercel.
3. Añade la variable de entorno `GEMINI_API_KEY` en el dashboard de Vercel.
4. Despliega el proyecto.

## Uso de IA

Se utilizó prompting para definir la personalidad de cada personaje y se integró una función serverless para proteger la API key de Gemini.

## Capturas de pantalla

Agrega capturas del proyecto una vez lo ejecutes visualmente.
