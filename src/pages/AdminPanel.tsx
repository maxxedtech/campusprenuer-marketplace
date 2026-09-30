import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Phone, MoreVertical, Circle } from "lucide-react";
import { type ChatMessage } from "@/types/chat";

type ChatWindowProps = {
  otherName: string;
  otherId: string;
  currentUserId: string;
  messages: ChatMessage[];
  onBack: () => void;
  onSend: (content: string) => void;
};

export default function ChatWindow({
  otherName,
  otherId,
  currentUserId,
  messages,
  onBack,
  onSend,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const groupedMessages = messages.reduce((groups: any, msg) => {
    const date = formatDate(msg.timestamp);
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  return (
    <div className="flex-1 flex flex-col bg-[#e5ddd5]">
      {/* WhatsApp-style Header */}
      <div className="bg-[#075e54] text-white px-4 py-3 flex items-center gap-3">
        <button onClick={onBack} className="md:hidden p-2 -ml-2 hover:bg-white/10 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold text-lg">
          {otherName[0]?.toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{otherName}</p>
          <div className="flex items-center gap-1 text-xs text-green-400">
            <Circle className="w-2 h-2 fill-current" />
            <span>online</span>
          </div>
        </div>

        <button className="p-2 hover:bg-white/10 rounded-full">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Messages - WhatsApp style */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-[#dcf8c6] px-4 py-3 rounded-lg shadow-sm max-w-xs">
              <p className="text-sm text-gray-700">
                Start chatting with <b>{otherName}</b>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Messages are stored locally on this device
              </p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, msgs]: [string, any]) => (
            <div key={date} className="space-y-1">
              {/* Date separator */}
              <div className="flex justify-center my-4">
                <span className="bg-[#e1f2fb] text-xs text-gray-600 px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>

              {msgs.map((msg: ChatMessage) => {
                const isOwn = msg.senderId === currentUserId;
                return (
                  <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm relative ${
                        isOwn
                          ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs text-orange-600 font-medium mb-0.5">
                          {msg.senderName}
                        </p>
                      )}
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-0.5">
                        <span className="text-[10px] text-gray-500">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && input.trim() && onSend(input.trim())}
            placeholder="Type a message..."
            className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button
            onClick={() => {
              if (!input.trim()) return;
              onSend(input.trim());
              setInput("");
            }}
            className="bg-brand-orange text-white rounded-full px-4 py-2 text-sm font-semibold"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
