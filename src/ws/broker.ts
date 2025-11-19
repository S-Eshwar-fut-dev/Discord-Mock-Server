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
 */

export function createWSServer(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: "/ws" });

  function broadcast(obj: any) {
    const str = JSON.stringify(obj);
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) client.send(str);
    }
  }

  wss.on("connection", (ws) => {
    // on connect we can optionally send presence snapshot
    ws.on("message", (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data?.type === "presence:set") {
          broadcast({ type: "presence:update", payload: data.payload });
          return;
        }

        if (data?.type === "message:create") {
          const { payload } = data;
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
      } catch (err) {
        // ignore
      }
    });

    // optional ping/pong
    ws.on("pong", () => {});
  });

  // heartbeat ping
  setInterval(() => {
    for (const client of wss.clients) {
      if (client.readyState === WebSocket.OPEN) {
        client.ping();
      }
    }
  }, 30000);

  return wss;
}
