import { useState } from "react";
// Fix: Updated import path from '../types' to '../types/index' to correctly resolve the types module.
import { Room, Message, View } from "@/types/types";
import { mockMessages, currentUser, otherUser } from "../data/mockData";

export const useDashboardState = () => {
  const [activeRoom, setActiveRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<{ [key: string]: Message[] }>(
    mockMessages
  );
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);
  const [view, setView] = useState<View>("rooms");
  const [replyModalMessage, setReplyModalMessage] = useState<Message | null>(
    null
  );
  const [newMessage, setNewMessage] = useState("");
  const isAdmin = true; // Mock admin status

  const handleSetView = (newView: View) => {
    setView(newView);
    setActiveRoom(null);
    setIsAiPanelOpen(false);
  };

  const handleSelectRoom = (room: Room) => {
    setActiveRoom(room);
    setIsAiPanelOpen(false);
  };

  const handleToggleAiPanel = () => {
    setIsAiPanelOpen((prev) => !prev);
  };

  const handleSendMessage = (text: string) => {
    if (!activeRoom) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: currentUser,
    };

    const aiResponse: Message = {
      id: `ai_${Date.now()}`,
      text: `This is a mock AI response regarding: "${text}". In a real application, I would provide a contextual summary or answer based on the conversation history.`,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      user: otherUser,
      isAI: true,
    };

    setMessages((prev) => {
      const roomMessages = prev[activeRoom.id] || [];
      const updatedMessages = [...roomMessages, userMessage];
      return { ...prev, [activeRoom.id]: updatedMessages };
    });

    setTimeout(() => {
      setMessages((prev) => {
        const roomMessages = prev[activeRoom.id] || [];
        return { ...prev, [activeRoom.id]: [...roomMessages, aiResponse] };
      });
    }, 1500);
  };

  const handleSuggestReply = (message: Message) => {
    setReplyModalMessage(message);
  };

  const handleCloseReplyModal = () => {
    setReplyModalMessage(null);
  };

  const handleInsertSuggestion = (text: string) => {
    setNewMessage((prev) => (prev ? `${prev} ${text}` : text));
    setReplyModalMessage(null);
  };

  return {
    activeRoom,
    messages,
    isAiPanelOpen,
    view,
    replyModalMessage,
    newMessage,
    isAdmin,
    handleSetView,
    handleSelectRoom,
    handleToggleAiPanel,
    handleSendMessage,
    setNewMessage,
    handleSuggestReply,
    handleCloseReplyModal,
    handleInsertSuggestion,
    setIsAiPanelOpen,
  };
};
