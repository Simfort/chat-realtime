"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.getUsersForSidebar = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
const socket_1 = require("../lib/socket");
const getUsersForSidebar = (req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const filteredUsers = user_model_1.default.findAll((val, i) => val.id !== loggedInUserId);
        res.status(200).json(filteredUsers);
    }
    catch (err) {
        console.log("Error in getUserForSidebar");
        res.status(500).json({ err: "Internal server error" });
    }
};
exports.getUsersForSidebar = getUsersForSidebar;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const messages = message_model_1.default.findAllMessage((val, i) => (val.senderId == senderId && val.receiverId == +userToChatId) ||
            (val.senderId == +userToChatId && val.receiverId == senderId));
        res.status(200).json(messages);
    }
    catch (err) {
        console.log("Error in getMessages");
        res.status(500).json({ err: "Internal server error" });
    }
});
exports.getMessages = getMessages;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let imageUrl = "";
        if (image) {
            const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = message_model_1.default.addMessage({
            senderId,
            receiverId: +receiverId,
            text,
            image: imageUrl,
            createdAt: new Date(),
        });
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(+receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (err) {
        console.log("Error in sendMessage");
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.sendMessage = sendMessage;
