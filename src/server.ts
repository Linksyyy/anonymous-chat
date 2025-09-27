import { createServer } from "http";
import cookie from "cookie";
import next from "next";
import { Server } from "socket.io";
import { jwtVerify } from "jose";
import {
  createChat,
  createInvite,
  createMessage,
  createParticipant,
  deleteChat,
  deleteNotification,
  deleteParticipation,
  findChat,
  findParticipationData,
  findUser,
  findUserByUsername,
} from "./db/queries";

const socketsMap = new Map();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = createServer((req, res) => {
    handle(req, res);
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

    socket.on("new_chat", async (title, encryptedGroupKey) => {
      if (title.trim() !== "") {
        const [chatCreated] = await createChat(title);
        await createParticipant(user.id, chatCreated.id, "admin");
        const chatData = await findChat(chatCreated.id);

        socket.emit("added_chat", chatData, encryptedGroupKey);
      }
    });

    socket.on("new_invite", async (username, chatId, hexEncryptedGroupKey) => {
      const userInvited = await findUserByUsername(username);
      if (!userInvited) return;
      const result = await createInvite(
        user.id,
        userInvited.id,
        chatId,
        "chat_invite",
        hexEncryptedGroupKey
      );

      socket
        .to(socketsMap.get(userInvited.id))
        .emit("created_notification", result);
    });

    socket.on("accept_invite", async (notification) => {
      await deleteNotification(notification.id);
      const newParticipation = await createParticipant(
        user.id,
        notification.chat_id,
        "guest"
      );
      const participationData = await findParticipationData(
        newParticipation.id
      );
      const chatData = await findChat(notification.chat.id);

      socket.emit("added_chat", chatData, notification.encrypted_group_key);
      socket.emit("notification_deleted", notification.id);
      for (let participant of chatData.participants) {
        socket
          .to(socketsMap.get(participant.user_id))
          .emit("participant_added", participationData);
      }
    });

    socket.on("deny_invite", async (notification) => {
      await deleteNotification(notification.id);

      socket.emit("notification_deleted", notification.id);
    });

    socket.on("delete_chat", async (chatId) => {
      const chatData = await findChat(chatId);
      const userParticipation = chatData.participants.filter(
        (participation) => participation.user_id === user.id
      )[0];

      if (userParticipation.role !== "admin") return;

      for (let participation of chatData.participants) {
        deleteParticipation(participation.id);
        const targetSocketId = socketsMap.get(participation.user.id);
        if (targetSocketId) {
          io.to(targetSocketId).emit("chat_deleted", chatData.id);
        }
      }
      deleteChat(chatData.id);
    });

    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${user.username} joined chat ${chatId}`);
    });

    socket.on("leave_chat", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${user.username} left chat ${chatId}`);
    });

    socket.on("send_message", async (chatId, encryptedMessage) => {
      const message = await createMessage(user.id, chatId, encryptedMessage);
      io.to(chatId).emit("message_sended", message);
    });

    socket.on("disconnect", () => {
      console.log(`A user ${user.username} disconnected`);
    });
  });

  const port = process.env.PORT || 3000;
  const host = "0.0.0.0"; // Escuta em todas as interfaces de rede disponíveis

  server.listen({ port, host }, () => {
    console.log(`> Server listening on port ${port}`);
  });
});
