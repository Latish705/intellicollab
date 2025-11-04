import React, { useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Room, Message } from "@/types/types";
import { SendIcon, SparklesIcon } from "../icons";

interface ChatViewProps {
  room: Room;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onToggleAiPanel: () => void;
  isAiPanelOpen: boolean;
  onSuggestReply: (message: Message) => void;
  newMessage: string;
  onNewMessageChange: (value: string) => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  room,
  messages,
  onSendMessage,
  onToggleAiPanel,
  isAiPanelOpen,
  onSuggestReply,
  newMessage,
  onNewMessageChange,
}) => {
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      onNewMessageChange("");
    }
  };

  return (
    <div className="flex-grow flex flex-col h-full bg-dark-bg">
      <header className="p-4 border-b border-dark-border flex-shrink-0 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-lg"># {room.name}</h2>
          <p className="text-sm text-gray-400">
            A space for seamless collaboration and AI-powered insights.
          </p>
        </div>
        <button
          onClick={onToggleAiPanel}
          title="Toggle AI Assistant"
          className={`p-2 rounded-md transition-colors ${
            isAiPanelOpen
              ? "bg-brand-purple/20 text-brand-purple-light"
              : "text-gray-400 hover:bg-white/10 hover:text-brand-purple-light"
          }`}
        >
          <SparklesIcon className="w-6 h-6" />
        </button>
      </header>
      <main className="flex-grow overflow-y-auto p-4 space-y-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`group flex items-start gap-2 max-w-xl w-full ${
              msg.user.email === user?.email
                ? "flex-row-reverse ml-auto"
                : "mr-auto"
            }`}
          >
            {msg.user.email !== user?.email && (
              <div
                className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${
                  msg.isAI
                    ? "bg-gradient-to-br from-green-500 to-teal-500"
                    : "bg-gradient-to-br from-brand-pink to-brand-purple"
                }`}
              >
                {msg.user.avatar}
              </div>
            )}
            <div
              className={`w-full p-3 rounded-lg ${
                msg.user.email === user?.email
                  ? "bg-brand-purple text-white rounded-br-none"
                  : "bg-dark-card text-gray-300 rounded-bl-none"
              }`}
            >
              <div className="flex items-baseline gap-3">
                <p className="font-semibold text-sm">{msg.user.name}</p>
                <p className="text-xs text-gray-500">{msg.timestamp}</p>
              </div>
              <p className="mt-1 break-words">{msg.text}</p>
            </div>
            <div className="self-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onSuggestReply(msg)}
                title="Suggest a reply with AI"
                className="p-1 rounded-full text-gray-400 hover:bg-white/10 hover:text-brand-purple-light"
              >
                <SparklesIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>
      <footer className="p-4 flex-shrink-0">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => onNewMessageChange(e.target.value)}
            placeholder="Type a message..."
            className="w-full bg-dark-card border border-dark-border rounded-lg pl-4 pr-14 py-3 focus:outline-none focus:ring-2 focus:ring-brand-purple"
          />
          <div className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center">
            <button
              type="submit"
              title="Send Message"
              className="p-2 rounded-md text-gray-400 hover:bg-white/10 hover:text-brand-purple-light transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default ChatView;
