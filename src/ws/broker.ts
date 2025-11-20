import WebSocket, { WebSocketServer } from "ws";
import { Server as HttpServer } from "http";
import { v4 as uuid } from "uuid";
import { MESSAGES, USERS } from "../mock/data";
import type { Message } from "../types";

/**
 * Simple JSON msg protocol:
 * Client -> server:
 *   { type: "presence:set", payload: { userId, status } }
 *   { type: "message:create", payload: { channelId, content, authorId, tempId? } }
 *
 * Server broadcasts:
 *   { type: "presence:update", payload: { userId, status } }
 *   { type: "message:created", payload: Message }
 * Server -> client (on connect):
 *   { type: "connection:ready" }
 */

// Allowed origins for WebSocket connections
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
];

function isOriginAllowed(origin: string | undefined): boolean {
  if (!origin) return true; // Allow connections without origin (e.g., Postman, native apps)
  return ALLOWED_ORIGINS.some((allowed) => origin.startsWith(allowed));
}

export function createWSServer(server: HttpServer) {
  const wss = new WebSocketServer({ 
    server, 
    path: "/ws",
    verifyClient: (info: { origin: string; secure: boolean; req: any }) => {
      const origin = info.origin;
      if (!isOriginAllowed(origin)) {
        console.warn(`[WS] Rejected connection from origin: ${origin}`);
        return false;
      }
      return true;
    }
  });

  function broadcast(obj: any) {
    const str = JSON.stringify(obj);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(str);
        } catch (err) {
          console.error("[WS] Error broadcasting to client:", err);
        }
      }
    }
  }

  wss.on("connection", (ws, req) => {
    const origin = req.headers.origin;
    console.log(`[WS] New connection from ${origin || "unknown origin"}`);

    // Send connection confirmation
    try {
      ws.send(JSON.stringify({ type: "connection:ready" }));
    } catch (err) {
      console.error("[WS] Error sending connection ready:", err);
    }

    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        
        if (data?.type === "presence:set") {
          broadcast({ type: "presence:update", payload: data.payload });
          return;
        }

        if (data?.type === "message:create") {
          const { payload } = data;
          
          // Validate required fields
          if (!payload?.channelId || !payload?.content) {
            console.warn("[WS] Invalid message:create payload:", payload);
            return;
          }

          // create server message
          const msg: Message = {
            id: uuid(),
            channelId: payload.channelId,
            author: USERS[payload.authorId] ?? Object.values(USERS)[0],
            content: payload.content,
            createdAt: new Date().toISOString(),
            attachments: payload.attachments ?? [],
          };

          // push to store
          MESSAGES[msg.channelId] = MESSAGES[msg.channelId] || [];
          MESSAGES[msg.channelId].push(msg);

          // broadcast "created" event
          broadcast({
            type: "message:created",
            payload: msg,
            tempId: payload.tempId ?? null,
          });
          return;
        }

        console.warn("[WS] Unknown message type:", data?.type);
      } catch (err) {
        console.error("[WS] Error parsing message:", err);
        // Send error back to client
        try {
          ws.send(JSON.stringify({ 
            type: "error", 
            payload: { message: "Invalid message format" } 
          }));
        } catch (sendErr) {
          console.error("[WS] Error sending error response:", sendErr);
        }
      }
    });

    ws.on("error", (error) => {
      console.error("[WS] WebSocket error:", error);
    });

    ws.on("close", (code, reason) => {
      console.log(`[WS] Connection closed: ${code} ${reason.toString()}`);
    });

    // optional ping/pong
    ws.on("pong", () => {
      // Connection is alive
    });
  });

  wss.on("error", (error) => {
    console.error("[WS] WebSocketServer error:", error);
  });

  // heartbeat ping
  const heartbeatInterval = setInterval(() => {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.ping();
        } catch (err) {
          console.error("[WS] Error sending ping:", err);
        }
      }
    }
  }, 30000);

  // Cleanup on server close
  server.on("close", () => {
    clearInterval(heartbeatInterval);
  });

  console.log("[WS] WebSocket server initialized on /ws");
  return wss;
}
