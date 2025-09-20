import { createServer } from "http";
import { parse } from "url";
import cookie from "cookie";
import next from "next";
import { Server } from "socket.io";
import { jwtVerify } from "jose";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);
  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      const token = cookie.parse(cookies)["auth-token"];
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      jwtVerify(token, secret);
      next();
    } catch (e) {
      console.log(e)
    }
  });
  io.on("connection", (socket) => {
    console.log("A user connected");
    socket.on("new_chat", (title) => {});
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.id} joined chat ${chatId}`);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} left chat ${chatId}`);
    });

    socket.on("new_message", ({ chatId, message }) => {
      io.to(chatId).emit("new_message", {
        senderId: socket.id,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
