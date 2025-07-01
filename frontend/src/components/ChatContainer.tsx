import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { User2 } from "lucide-react";

export default function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    unsubscribeFromMessages,
    subscribeToMessages,
  } = useChatStore();
  const messageRef = useRef<HTMLDivElement>(null);
  const { authUser } = useAuthStore();
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser!.id!);
      subscribeToMessages();
    }
    return () => unsubscribeFromMessages();
  }, [
    selectedUser!.id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageRef.current && messages) {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            ref={messageRef}
            key={message.id}
            className={`chat ${
              message.senderId === authUser?.id ? "chat-end" : "chat-start"
            }`}>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                {authUser?.profilePic && message.senderId === authUser?.id ? (
                  <img src={authUser.profilePic} alt="profile pic" />
                ) : selectedUser?.profilePic &&
                  message.senderId == selectedUser?.id ? (
                  <img src={selectedUser.profilePic} alt="profile pic" />
                ) : (
                  <User2 size={37} />
                )}
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt.toString())}
              </time>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}
