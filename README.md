# chat-vue (Frontend)

Vue SPA for the chat application. It talks to the backend via REST and WebSocket (SockJS + STOMP).

See also:
- Backend: `github.com/Ruclo/chat-app`

## Features
- Authenticated chat sessions
- Live message updates via WebSockets
- Profile image uploads (Cloudinary)
- Mobile + desktop layouts

## Config
Environment variables (Vite):
- `VITE_API_URL` (base URL for REST, leave empty for same-origin)
- `VITE_WEBSOCKET_URL` (SockJS endpoint, typically `/api/ws`)

In the Docker Compose proxy setup, these are set to **relative** paths so the SPA and API share the same origin.


## Dev Mode
If you want hot reload without Compose:
```
npm install
npm run dev
```
