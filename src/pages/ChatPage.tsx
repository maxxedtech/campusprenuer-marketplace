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

  // 🔥 LOAD INITIAL DATA
  useEffect(() => {
    const load = async () => {
      const current = await getCurrentUser();
      setUser(current);

      if (!current || !sellerId) return;

      const convo = await getOrCreateConversation(current.id, sellerId);
      setConversation(convo);

      // load existing messages
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convo.id)
        .order("created_at", { ascending: true });

      setMessages(data || []);

      // 🔥 REAL-TIME SUBSCRIPTION
      const channel = supabase
        .channel("chat-room")
        .on(
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
        )
        .subscribe();

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

  return (
    <div className="p-4 max-w-2xl mx-auto">

      <h1 className="text-xl font-bold mb-4">
        Chat with {sellerName}
      </h1>

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
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />

        <Button onClick={handleSend}>
          Send
        </Button>
      </div>

    </div>
  );
}
