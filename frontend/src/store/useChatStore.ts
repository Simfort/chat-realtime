import type { IMessage } from "../../../backend/src/models/message.model";
import type { IUser } from "../../../backend/src/models/user.model";
import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

interface ChatStore {
  messages: IMessage[];
  users: IUser[];
  selectedUser: IUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  getUsers: () => void;
  sendMessage: (data: Partial<IMessage>) => void;
  getMessages: (userId: number) => void;
  setSelectedUser: (user: IUser | null) => void;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },
  getMessages: async (userId: number) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser!.id}`,
        messageData
      );

      set({ messages: [...messages, res.data] });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  },
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket!;
    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser.id;
      if (!isMessageSentFromSelectedUser) return;
      set({ messages: [...get().messages, newMessage] });
    });
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket!;
    socket.off("newMessage");
  },
  setSelectedUser: async (user: IUser | null) => set({ selectedUser: user }),
}));
