import type { IUser } from "../../../backend/src/models/user.model";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE == "development" ? "http://localhost:5001" : "/";

interface AuthStore {
  authUser: null | IUser;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: null | Socket;
  connectSocket: () => void;
  checkAuth: () => void;
  signup: (data: IUser) => void;
  logout: () => void;
  login: (data: Pick<IUser, "password" | "email">) => void;
  disconnetctSocket: () => void;
  updateProfile: (data: Pick<IUser, "profilePic">) => void;
}
export const useAuthStore = create<AuthStore>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],
  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: { userId: authUser.id },
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error in checkAuth", error);
      }
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error in signup", err.message);
      }
    } finally {
      set({ isSigningUp: false });
    }
    return data;
  },
  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnetctSocket();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
        toast.error("error.response.data.message");
      }
    }
  },
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logedd in is successfully");
      get().connectSocket();
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log(err.message);
        toast.error("Error in login");
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("error in update profile:", err);
        toast.error("Error in update profile");
      }
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  disconnetctSocket: async () => {
    if (get().socket?.connected) get().socket?.disconnect();
  },
}));
