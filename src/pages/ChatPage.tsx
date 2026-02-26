import { useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow";
import type { Conversation, ChatMessage } from "@/types";
import { MessageCircle } from "lucide-react";

const ChatPage = () => {
  const [conversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [messages] = useState<ChatMessage[]>([]);
  const currentUserId = ""; // Set from auth

  const handleSend = (_content: string) => {
    // TODO: Send via WebSocket
    // ws.send(JSON.stringify({ type: 'message', conversationId: selectedConvo?.id, content }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-2xl font-display font-bold mb-6">Messages</h1>

      <div className="card-soft p-0 overflow-hidden flex" style={{ height: "calc(100vh - 200px)" }}>
        {/* Conversation list */}
        <div className="w-72 border-r border-border flex flex-col shrink-0">
          <div className="p-4 border-b border-border">
            <p className="font-display font-bold text-sm">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <MessageCircle className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-xs text-muted-foreground mt-2">No conversations yet.</p>
                <p className="text-xs text-muted-foreground">Chat will connect via WebSocket.</p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConvo(c)}
                  className={`w-full text-left p-4 border-b border-border hover:bg-muted/50 transition-colors ${
                    selectedConvo?.id === c.id ? "bg-muted/50" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center font-display font-bold text-sm">
                      {c.participantNames[0]?.[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{c.participantNames[0]}</p>
                      <p className="text-xs text-muted-foreground truncate">{c.lastMessage}</p>
                    </div>
                    {c.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                        {c.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <ChatWindow
          conversation={selectedConvo}
          messages={messages}
          currentUserId={currentUserId}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatPage;
