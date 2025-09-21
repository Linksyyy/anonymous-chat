import { createServer } from "http";
import { parse } from "url";
import cookie from "cookie";
import next from "next";
import { Server } from "socket.io";
import { jwtVerify } from "jose";
import {
  createChat,
  createInvite,
  createParticipant,
  deleteNotification,
  findChat,
  findUser,
  findUserByUsername,
} from "./db/queries";
import { notifications } from "./db/schemas";

const socketsMap = new Map();

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
    const user = await findUser((socket as any).userId);
    socketsMap.set(user.id, socket.id);

    console.log(`The user ${user.username} connected`);

    socket.on("new_chat", async (title) => {
      if (title.trim() !== "") {
        const [chatCreated] = await createChat(title);
        await createParticipant(user.id, chatCreated.id, "admin");
        const chatData = await findChat(chatCreated.id);

        socket.emit("added_chat", chatData);
      }
    });

    socket.on("new_invite", async (username, chatId) => {
      const userInvited = await findUserByUsername(username);
      if (!userInvited) return;
      const result = await createInvite(
        user.id,
        userInvited.id,
        chatId,
        "chat_invite"
      );

      socket
        .to(socketsMap.get(userInvited.id))
        .emit("created_notification", result);
    });

    socket.on("accept_invite", async (notification) => {
      await deleteNotification(notification.id);
      await createParticipant(user.id, notification.chat_id, "guest");
      const chatData = await findChat(notification.chat.id);

      socket.emit("added_chat", chatData);
      socket.emit("delete_notification", notification.id);
    });

    socket.on("deny_invite", async (notification) => {
      await deleteNotification(notification.id);

      socket.emit("delete_notification", notification.id);
    });

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
