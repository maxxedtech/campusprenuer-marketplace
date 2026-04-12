import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { getOrCreateConversation, sendMessage } from "@/lib/chat";
import { supabase } from "@/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [params] = useSearchParams();

  const sellerId = params.get("seller");
  const sellerName = params.get("name");

  const [user, setUser] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const current = await getCurrentUser();
      setUser(current);

      if (!current || !sellerId) return;

      const convo = await getOrCreateConversation(current.id, sellerId);
      setConversation(convo);

      // 🔥 Load messages
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convo.id)
        .order("created_at", { ascending: true });

      setMessages(data || []);

      // 🔥 REAL-TIME CHANNEL
      const channel = supabase.channel(`chat-${convo.id}`);

      // 💬 NEW MESSAGES
      channel.on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${convo.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      );

      // ✨ TYPING INDICATOR
      channel.on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.userId !== current.id) {
          setIsTyping(true);

          setTimeout(() => setIsTyping(false), 1500);
        }
      });

      // 🟢 ONLINE PRESENCE
      channel.on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();

        const users = Object.values(state)
          .flat()
          .map((p: any) => p.userId);

        setOnlineUsers(users);
      });

      await channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId: current.id,
          });
        }
      });

      return () => {
        supabase.removeChannel(channel);
      };
    };

    load();
  }, [sellerId]);

  // 💬 SEND MESSAGE
  const handleSend = async () => {
    if (!text.trim() || !conversation || !user) return;

    await sendMessage(conversation.id, user.id, text);
    setText("");
  };

  // ✨ SEND TYPING EVENT
  const handleTyping = async (value: string) => {
    setText(value);

    if (!conversation || !user) return;

    const channel = supabase.channel(`chat-${conversation.id}`);

    await channel.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: user.id },
    });
  };

  const isOnline = onlineUsers.includes(sellerId || "");

  return (
    <div className="p-4 max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-xl font-bold">
          Chat with {sellerName}
        </h1>

        <span
          className={`text-xs px-2 py-1 rounded ${
            isOnline ? "bg-green-500 text-white" : "bg-gray-300"
          }`}
        >
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>

      {/* TYPING */}
      {isTyping && (
        <p className="text-sm text-gray-500 mb-2">
          {sellerName} is typing...
        </p>
      )}

      {/* MESSAGES */}
      <div className="border h-96 overflow-y-auto p-3 space-y-2 mb-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-2 rounded max-w-xs ${
              m.sender_id === user?.id
                ? "ml-auto bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {m.content}
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex gap-2">
        <Input
          value={text}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type message..."
        />

        <Button onClick={handleSend}>
          Send
        </Button>
      </div>

    </div>
  );
}
