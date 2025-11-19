# Discord Mock Server (Eoncord mock)

## Run locally (dev)

1. `npm ci`
2. `npm run dev`

Server runs: `http://localhost:4000`  
WS endpoint: `ws://localhost:4000/ws`

## Environment

- `PORT` default 4000
- `FRONTEND_ORIGIN` default `http://localhost:3000` (CORS)

## Frontend usage

- set `NEXT_PUBLIC_API_BASE_URL=http://localhost:4000`
- set `NEXT_PUBLIC_WS_URL=ws://localhost:4000/ws`
- Frontend can call REST endpoints and subscribe to WS events.

## Endpoints

- `POST /api/auth/login` body `{ username }` -> returns `{ token, user }`
- `GET  /api/guilds`
- `GET  /api/channels?guildId=...`
- `GET  /api/messages?channelId=...&limit=50&cursor=...`
- `POST /api/messages` create message (fallback)
- `POST /api/uploads` file multipart

## WS protocol

- send JSON messages:
  - `{ type: "presence:set", payload: { userId, status } }`
  - `{ type: "message:create", payload: { channelId, authorId, content, tempId? } }`
- server broadcasts:
  - `{ type: "presence:update", payload: {...} }`
  - `{ type: "message:created", payload: message, tempId?: string }`
