"use client";

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Users,
  LogOut,
  Send,
  Hash,
} from "lucide-react";
import { chatAPI } from "@/lib/api";
import { Room } from "@/types";

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState({
    name: "",
    description: "",
    is_private: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      loadRooms();
    }
  }, [user]);

  const loadRooms = async () => {
    try {
      const response = await chatAPI.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Failed to load rooms:", error);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await chatAPI.createRoom({
        name: newRoomData.name,
        description: newRoomData.description,
        organisation_id: "default-org", // Replace with actual org ID
        created_by_user_id: user.id,
        is_private: newRoomData.is_private,
      });

      setNewRoomData({ name: "", description: "", is_private: false });
      setShowCreateRoom(false);
      await loadRooms();
    } catch (error) {
      console.error("Failed to create room:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">IntelliCollab</h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>

          {/* User info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            {user.is_premium && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pro
              </span>
            )}
          </div>
        </div>

        {/* Search and Create */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setShowCreateRoom(!showCreateRoom)}
            className="w-full"
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </Button>
        </div>

        {/* Create Room Form */}
        {showCreateRoom && (
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <form onSubmit={handleCreateRoom} className="space-y-3">
              <div>
                <Label htmlFor="roomName" className="text-sm">
                  Room Name
                </Label>
                <Input
                  id="roomName"
                  value={newRoomData.name}
                  onChange={(e) =>
                    setNewRoomData({ ...newRoomData, name: e.target.value })
                  }
                  placeholder="Enter room name"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="roomDescription" className="text-sm">
                  Description (optional)
                </Label>
                <Textarea
                  id="roomDescription"
                  value={newRoomData.description}
                  onChange={(e) =>
                    setNewRoomData({
                      ...newRoomData,
                      description: e.target.value,
                    })
                  }
                  placeholder="Enter room description"
                  className="mt-1"
                  rows={2}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPrivate"
                  checked={newRoomData.is_private}
                  onChange={(e) =>
                    setNewRoomData({
                      ...newRoomData,
                      is_private: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isPrivate" className="text-sm">
                  Private room
                </Label>
              </div>
              <div className="flex space-x-2">
                <Button type="submit" size="sm" className="flex-1">
                  Create
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateRoom(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
              Rooms ({filteredRooms.length})
            </h3>
            <div className="space-y-2">
              {filteredRooms.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    {rooms.length === 0
                      ? "No rooms yet"
                      : "No rooms match your search"}
                  </p>
                  {rooms.length === 0 && (
                    <p className="text-gray-400 text-xs mt-1">
                      Create your first room to get started
                    </p>
                  )}
                </div>
              ) : (
                filteredRooms.map((room) => (
                  <button
                    key={room._id}
                    onClick={() => setSelectedRoom(room)}
                    className={`w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedRoom?._id === room._id
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-white border-gray-200"
                    } border`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          room.is_private ? "bg-gray-100" : "bg-indigo-100"
                        }`}
                      >
                        {room.is_private ? (
                          <Users className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Hash className="h-4 w-4 text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {room.name}
                        </p>
                        {room.description && (
                          <p className="text-xs text-gray-500 truncate">
                            {room.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center ${
                      selectedRoom.is_private ? "bg-gray-100" : "bg-indigo-100"
                    }`}
                  >
                    {selectedRoom.is_private ? (
                      <Users className="h-4 w-4 text-gray-600" />
                    ) : (
                      <Hash className="h-4 w-4 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedRoom.name}
                    </h2>
                    {selectedRoom.description && (
                      <p className="text-sm text-gray-500">
                        {selectedRoom.description}
                      </p>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 bg-gray-50 p-4">
              <div className="text-center py-20">
                <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome to {selectedRoom.name}
                </h3>
                <p className="text-gray-500">
                  This is the beginning of your conversation in this room.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Real-time messaging will be implemented with Socket.IO
                  integration.
                </p>
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <Input
                  placeholder={`Message #${selectedRoom.name}`}
                  className="flex-1"
                />
                <Button size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to IntelliCollab
              </h2>
              <p className="text-gray-500 mb-6 max-w-md">
                Select a room from the sidebar to start collaborating, or create
                a new room to begin your conversation.
              </p>
              <Button onClick={() => setShowCreateRoom(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Room
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
