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
exports.checkAuth = exports.updateProfile = exports.logout = exports.login = exports.signup = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const utils_1 = require("../lib/utils");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullName, email, password } = req.body;
    try {
        // hash password
        if (password.length < 6) {
            res
                .status(400)
                .json({ message: "Password must be at least 6 characters" });
        }
        const user = user_model_1.default.findUser({ email });
        if (user)
            res.status(400).json({ message: "Email already exists" });
        const salt = yield bcryptjs_1.default.genSalt(10);
        const hashedPassword = yield bcryptjs_1.default.hash(password, salt);
        const newUser = user_model_1.default.addUser({
            id: Math.random() * 1000,
            fullName,
            email,
            password: hashedPassword,
            profilePic: "",
        });
        if (newUser) {
            (0, utils_1.generateToken)(newUser.id, res);
            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullName,
                email: newUser.email,
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.log("Error in signup controller", error.message);
        }
        else {
            console.log(error);
        }
        res.status(400).json({ message: "Error" });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = user_model_1.default.findUser({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid credentials" });
        }
        else {
            const isPassworCorrect = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPassworCorrect) {
                res.status(400).json({ message: "Invalid credentials" });
            }
            (0, utils_1.generateToken)(user.id, res);
            res.status(200).json({
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
            });
        }
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Error in login", err.message);
        }
    }
});
exports.login = login;
const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (err) {
        if (err instanceof Error) {
            console.log("Error in logout controller", err.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
};
exports.logout = logout;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { profilePic } = req.body;
        const userId = req.user.id;
        if (!profilePic) {
            res.status(400).json({ message: "Profile pic is required" });
        }
        const uploatedUser = user_model_1.default.updateUser(userId, {
            profilePic,
        });
        res.status(200).json(uploatedUser);
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
});
exports.updateProfile = updateProfile;
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    }
    catch (e) {
        console.log("error in checkauth controller");
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.checkAuth = checkAuth;
