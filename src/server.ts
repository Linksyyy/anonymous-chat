import { createServer } from "http";
import { parse } from "url";
import cookie from "cookie";
import next from "next";
import { Server } from "socket.io";
import { jwtVerify } from "jose";
import { findUser } from "./db/queries";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server);
  io.use(async (socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (cookies) {
        const token = cookie.parse(cookies)["auth-token"];
        if (token) {
          const secret = new TextEncoder().encode(process.env.JWT_SECRET);
          const { payload } = await jwtVerify(token, secret);
          (socket as any).userId = String(payload.userId);
        }
      }
    } catch (e) {}
    next();
  });

  io.on("connection", async (socket) => {
    const userId = (socket as any).userId;
    let user;
    if (userId) {
      user = await findUser(userId);
    }

    if (user) {
      console.log(`A user ${user.username} connected`);
    } else {
      console.log("An anonymous user connected");
    }

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
      if (user) {
        console.log(`A user ${user.username} disconnected`);
      } else {
        console.log("An anonymous user disconnected");
      }
    });
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
