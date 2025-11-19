import http from "http";
import app from "./app";
import { createWSServer } from "./ws/broker";

const PORT = Number(process.env.PORT || 4000);

const server = http.createServer(app);

// create WS server and attach to same http server
createWSServer(server);

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Mock server listening on http://localhost:${PORT}`);
  console.log(`WS endpoint: ws://localhost:${PORT}`);
});
