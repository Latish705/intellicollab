import React from "react";
import { useAuth } from "@/hooks/useAuth";

import {
  IntelliCollabLogo,
  SearchIcon,
  PlusIcon,
  MenuIcon,
  CheckIcon,
  XIcon,
  GlobeIcon,
  ChatBubbleIcon,
} from "../icons";
import Link from "next/link";
import { Room, JoinRequest, View } from "@/types/types";

interface SidebarProps {
  rooms: Room[];
  activeRoom: Room | null;
  onSelectRoom: (room: Room) => void;
  joinRequests: JoinRequest[];
  isAdmin: boolean;
  view: View;
  onSetView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  rooms,
  activeRoom,
  onSelectRoom,
  joinRequests,
  isAdmin,
  view,
  onSetView,
}) => {
  const { user, signOut } = useAuth();

  return (
    <aside className="w-full md:w-80 bg-gradient-to-b from-dark-card to-black/50 flex-shrink-0 flex flex-col h-full">
      <div className="p-4 border-b border-dark-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IntelliCollabLogo className="w-8 h-8" />
            <span className="font-bold text-lg">IntelliCollab</span>
          </div>
          <button className="md:hidden p-1 text-gray-400 hover:text-white">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center font-bold text-white flex-shrink-0">
            {user?.displayName?.[0]?.toUpperCase() ||
              user?.email?.[0]?.toUpperCase() ||
              "U"}
          </div>
          <div className="flex-grow min-w-0">
            <p className="font-semibold text-sm truncate">
              {user?.displayName || "User"}
            </p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="text-gray-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors flex-shrink-0"
            title="Sign Out"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="p-4 flex-shrink-0 border-b border-dark-border">
        <div className="flex bg-dark-bg rounded-lg p-1">
          <button
            onClick={() => onSetView("rooms")}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${
              view === "rooms"
                ? "bg-brand-purple text-white"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <ChatBubbleIcon className="w-5 h-5" />
            <span>Rooms</span>
          </button>
          <Link href="/explore">
            <button
              className={`w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${
                view === "explore"
                  ? "bg-brand-purple text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <GlobeIcon className="w-5 h-5" />
              <span>Explore</span>
            </button>
          </Link>
        </div>
      </div>

      {view === "rooms" ? (
        <>
          <div className="p-4 flex-shrink-0">
            <div className="relative">
              <SearchIcon className="w-5 h-5 absolute top-1/2 left-3 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search rooms..."
                className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple"
              />
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity">
              <PlusIcon className="w-5 h-5" />
              Create Room
            </button>
          </div>

          {isAdmin && joinRequests.length > 0 && (
            <div className="px-4 py-2 border-t border-b border-dark-border">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex justify-between items-center">
                <span>Join Requests</span>
                <span className="bg-brand-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {joinRequests.length}
                </span>
              </p>
              <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {joinRequests.map((req) => (
                  <li
                    key={req.id}
                    className="bg-dark-bg/50 p-2 rounded-lg border border-dark-border"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center font-bold text-white flex-shrink-0 text-sm">
                        {req.user.avatar}
                      </div>
                      <div className="flex-grow overflow-hidden">
                        <p className="font-semibold text-sm text-white truncate">
                          {req.user.name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {req.user.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 flex gap-2">
                      <button className="w-full flex items-center justify-center gap-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-bold py-1 rounded transition-colors">
                        <CheckIcon className="w-3.5 h-3.5" /> Approve
                      </button>
                      <button className="w-full flex items-center justify-center gap-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold py-1 rounded transition-colors">
                        <XIcon className="w-3.5 h-3.5" /> Deny
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <nav className="flex-grow overflow-y-auto px-4 pt-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Rooms ({rooms.length})
            </p>
            <ul>
              {rooms.map((room) => (
                <li key={room.id}>
                  <button
                    onClick={() => onSelectRoom(room)}
                    className={`w-full text-left p-2 rounded-md flex justify-between items-center transition-colors ${
                      activeRoom?.id === room.id
                        ? "bg-brand-purple/20 text-white"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <span className="font-medium text-sm"># {room.name}</span>
                    {room.unreadCount && (
                      <span className="bg-brand-pink text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {room.unreadCount}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </>
      ) : (
        <div className="flex-grow p-4 text-sm text-center text-gray-400 flex flex-col items-center justify-center">
          <GlobeIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p>
            Discover public organizations, open-source projects, and
            communities.
          </p>
          <p className="mt-2 text-xs">
            Your private rooms are in the 'Rooms' tab.
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
