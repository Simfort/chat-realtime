import { User2, X } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

export default function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              {selectedUser!.profilePic! ? (
                <img
                  src={selectedUser!.profilePic}
                  alt={selectedUser?.fullName}
                />
              ) : (
                <User2 />
              )}
            </div>
          </div>
          <div>
            <h3 className="font-medium">{selectedUser?.fullName}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser!.id!.toString())
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>
        <button
          className=" cursor-pointer"
          onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>
    </div>
  );
}
