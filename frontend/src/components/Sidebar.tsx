import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { User2, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

export default function Sidebar() {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user.id!.toString()))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>
      <div className="overfolow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user.id}
            onClick={() => setSelectedUser(user)}
            className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
              selectedUser?.id == user.id
                ? "bg-base-300 ring-1 ring-base-300"
                : ""
            }`}>
            <div className="relative mx-auto lg:mx-0">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
              ) : (
                <User2 size={25} />
              )}
              {onlineUsers.includes(user.id!.toString()) && (
                <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 rind-zinc-900"></span>
              )}
            </div>
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user.id!.toString())
                  ? "Online"
                  : "Offline"}
              </div>
            </div>
          </button>
        ))}
      </div>
    </aside>
  );
}
