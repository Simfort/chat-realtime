import express from "express";
import authRouter from "./routes/auth.route";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import messageRouter from "./routes/message.route";
import cors from "cors";
import { app, server } from "./lib/socket";
import path from "path";
import * as fs from "fs";

dotenv.config();

const port = process.env.PORT || 5001;
const __dirname = path.resolve();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  fs.writeFile(
    path.join(__dirname, "./lib/db.json"),
    JSON.stringify({
      users: [],
    }),
    (err) => console.error(err)
  );
  fs.writeFile(
    path.join(__dirname, "./lib/messages.json"),
    JSON.stringify({
      messages: [],
    }),
    (err) => console.error(err)
  );
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
server.listen(port, () => {
  console.log("server is running http://localhost:5001/api/auth");
});
