"use client";
import React from "react";
import { mockRooms, mockJoinRequests } from "@/data/mockData";
import { useDashboardState } from "@/hooks/useDashboardState";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/dashboard/Sidebar";
import WelcomeScreen from "@/components/dashboard/WelcomeScreen";
import ChatView from "@/components/dashboard/ChatView";
import AiChatPanel from "@/components/dashboard/AiChatPanel";
import ExploreView from "@/components/dashboard/ExploreView";
import AiReplyModal from "@/components/dashboard/AiReplyModal";

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth(); // Get current user and signOut function
  const {
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
  } = useDashboardState();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* User info header */}
      <div className="absolute top-4 right-4 z-50 flex items-center gap-3 bg-black/20 backdrop-blur-sm rounded-lg px-4 py-2">
        <span className="text-white text-sm">
          Welcome, {user?.displayName || user?.email}
        </span>
        <button
          onClick={signOut}
          className="text-white/70 hover:text-white text-sm hover:bg-white/10 px-2 py-1 rounded transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      <Sidebar
        rooms={mockRooms}
        activeRoom={activeRoom}
        onSelectRoom={handleSelectRoom}
        isAdmin={isAdmin}
        joinRequests={mockJoinRequests}
        view={view}
        onSetView={handleSetView}
      />
      <div className="flex-grow flex min-w-0 relative">
        <main className="flex-grow flex flex-col">
          {view === "rooms" ? (
            activeRoom ? (
              <ChatView
                room={activeRoom}
                messages={messages[activeRoom.id] || []}
                onSendMessage={handleSendMessage}
                onToggleAiPanel={handleToggleAiPanel}
                isAiPanelOpen={isAiPanelOpen}
                onSuggestReply={handleSuggestReply}
                newMessage={newMessage}
                onNewMessageChange={setNewMessage}
              />
            ) : (
              <WelcomeScreen
                onCreateRoom={() => {
                  /* Mock function */
                }}
              />
            )
          ) : (
            <ExploreView />
          )}
        </main>

        {isAiPanelOpen && activeRoom && view === "rooms" && (
          <AiChatPanel
            room={activeRoom}
            onClose={() => setIsAiPanelOpen(false)}
          />
        )}
      </div>

      {replyModalMessage && (
        <AiReplyModal
          message={replyModalMessage}
          onClose={handleCloseReplyModal}
          onInsert={handleInsertSuggestion}
        />
      )}
    </div>
  );
};

export default DashboardPage;
