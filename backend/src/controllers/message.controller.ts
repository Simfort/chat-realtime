import { Request, Response } from "express";
import User from "../models/user.model";
import Message from "../models/message.model";
import cloudinary from "../lib/cloudinary";
import { getReceiverSocketId, io } from "../lib/socket";

export const getUsersForSidebar = (req: Request, res: Response) => {
  try {
    const loggedInUserId = (req as any).user.id;
    const filteredUsers = User.findAll((val, i) => val.id !== loggedInUserId);
    res.status(200).json(filteredUsers);
  } catch (err) {
    console.log("Error in getUserForSidebar");
    res.status(500).json({ err: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = (req as any).user.id;
    const messages = Message.findAllMessage(
      (val, i) =>
        (val.senderId == senderId && val.receiverId == +userToChatId) ||
        (val.senderId == +userToChatId && val.receiverId == senderId)
    );
    res.status(200).json(messages);
  } catch (err) {
    console.log("Error in getMessages");
    res.status(500).json({ err: "Internal server error" });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = (req as any).user.id;

    let imageUrl = "";
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    const newMessage = Message.addMessage({
      senderId,
      receiverId: +receiverId,
      text,
      image: imageUrl,
      createdAt: new Date(),
    });
    const receiverSocketId = getReceiverSocketId(+receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json(newMessage);
  } catch (err) {
    console.log("Error in sendMessage");
    res.status(500).json({ error: "Internal server error" });
  }
};
