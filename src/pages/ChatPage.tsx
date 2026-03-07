import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { MessageCircle, ArrowLeft } from "lucide-react";
import ChatWindow from "@/components/chat/ChatWindow";
import { readAuth } from "@/lib/authStorage";
import { 
  getConversations, 
  getConversationMessages, 
  sendMessage, 
  markConversationRead,
  Conversation,
  ChatMessage 
} from "@/lib/chatStorage";

const ChatPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get("seller");
  
  const { user } = readAuth();
  const currentUserId = user?.id || "";
  const currentUserName = user?.name || "You";

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");

  // Load conversations
  useEffect(() => {
    const convos = getConversations();
    // Sort by last message time
    convos.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    setConversations(convos);
  }, []);

  // Handle seller param from URL (when clicking "Message Seller")
  useEffect(() => {
    if (sellerId && user) {
      // Create or get conversation with this seller
      const convo = getOrCreateConversation(user.id, sellerId, "Seller");
      setSelectedConvo(convo);
      loadMessages(convo.id);
    }
  }, [sellerId, user]);

  const loadMessages = (convoId: string) => {
    const msgs = getConversationMessages(convoId);
    setMessages(msgs);
    markConversationRead(convoId, currentUserId);
  };

  const handleSelectConvo = (convo: Conversation) => {
    setSelectedConvo(convo);
    loadMessages(convo.id);
  };

  const handleSend = (content: string) => {
    if (!selectedConvo || !user) return;
    
    const newMsg = sendMessage(
      selectedConvo.id,
      currentUserId,
      currentUserName,
      content
    );
    
    setMessages(prev => [...prev, newMsg]);
    
    // Refresh conversations list
    const convos = getConversations();
    convos.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    setConversations(convos);
  };

  const getOtherParticipantName = (convo: Conversation) => {
    const index = convo.participants.findIndex(id => id !== currentUserId);
    return convo.participantNames[index] || "Unknown";
  };

  const getOtherParticipantInitial = (convo: Conversation) => {
    return getOtherParticipantName(convo)[0]?.toUpperCase() || "?";
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <MessageCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Please login to chat</h2>
        <button 
          onClick={() => navigate("/login")}
          className="text-orange-600 hover:underline"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Mobile Header */}
      <div className="bg-white border-b px-4 py-3 flex items-center gap-3 md:hidden">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-semibold">Messages</h1>
      </div>

      <div className="flex-1 flex overflow-hidden container mx-auto max-w-6xl bg-white md:my-4 md:rounded-xl md:shadow-lg md:border">
        {/* Conversation List - Hidden on mobile when chat selected */}
        <div className={`w-full md:w-80 border-r bg-gray-50 flex flex-col ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 bg-white border-b">
            <h2 className="font-bold text-lg">Chats</h2>
            <p className="text-xs text-gray-500">{conversations.length} conversations</p>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <MessageCircle className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">No messages yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Click "Message Seller" on any product to start chatting
                </p>
              </div>
            ) : (
              conversations.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => handleSelectConvo(convo)}
                  className={`w-full text-left p-4 border-b hover:bg-white transition flex items-center gap-3 ${
                    selectedConvo?.id === convo.id ? "bg-white border-l-4 border-l-orange-500" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                    {getOtherParticipantInitial(convo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-sm truncate">{getOtherParticipantName(convo)}</p>
                      <span className="text-xs text-gray-400">
                        {new Date(convo.lastMessageTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{convo.lastMessage || "No messages yet"}</p>
                  </div>
                  {convo.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center font-bold">
                      {convo.unreadCount}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`flex-1 flex flex-col ${!selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          {selectedConvo ? (
            <ChatWindow
              conversation={selectedConvo}
              messages={messages}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              otherName={getOtherParticipantName(selectedConvo)}
              onSend={handleSend}
              onBack={() => setSelectedConvo(null)}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-12 h-12 text-orange-600" />
              </div>
              <p className="text-lg font-medium text-gray-600">Select a conversation</p>
              <p className="text-sm text-gray-400 mt-1">Choose a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper function (should be in chatStorage but added here for completeness)
function getOrCreateConversation(userId: string, otherId: string, otherName: string) {
  const { getConversations, saveConversations } = require("@/lib/chatStorage");
  const conversations = getConversations();
  const sortedIds = [userId, otherId].sort();
  const convoId = sortedIds.join("_");
  
  let convo = conversations.find((c: any) => c.id === convoId);
  
  if (!convo) {
    convo = {
      id: convoId,
      participants: sortedIds,
      participantNames: ["You", otherName],
      lastMessage: "",
      lastMessageTime: Date.now(),
      unreadCount: 0
    };
    conversations.push(convo);
    saveConversations(conversations);
  }
  
  return convo;
}

export default ChatPage;
