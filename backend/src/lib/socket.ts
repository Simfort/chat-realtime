import { Server } from "socket.io";
import http from "http";
import express from "express";

export const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId: number) {
  return userSocketMap[userId];
}

const userSocketMap: { [id: number]: string } = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);
  const userId = socket.handshake.query.userId as unknown as number;
  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
