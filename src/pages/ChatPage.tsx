import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { supabase } from "@/supabase";
import { getCurrentUser } from "@/lib/auth";
import {
  getOrCreateConversation,
  sendMessage,
  deleteMessage,
  markAsRead,
} from "@/lib/chat";

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

  /* ================= LOAD ================= */
  useEffect(() => {
    const load = async () => {
      const current = await getCurrentUser();
      setUser(current);

      if (!current || !sellerId) return;

      const convo = await getOrCreateConversation(current.id, sellerId);
      setConversation(convo);

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convo.id)
        .order("created_at", { ascending: true });

      setMessages(data || []);

      await markAsRead(convo.id, current.id);

      const channel = supabase
        .channel(`chat-${convo.id}`)
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
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
          },
          (payload) => {
            setMessages((prev) =>
              prev.map((m) =>
                m.id === payload.new.id ? payload.new : m
              )
            );
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    load();
  }, [sellerId]);

  /* ================= SEND ================= */
  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage(conversation.id, user.id, text);
    setText("");
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Delete this message?");
    if (!confirmDelete) return;

    await deleteMessage(id);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[90vh]">

      {/* HEADER */}
      <h1 className="text-lg font-bold mb-2">
        {sellerName || "Chat"}
      </h1>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-3 border p-3 rounded-xl bg-white">

        {messages.map((m) => {
          const isMe = m.sender_id === user?.id;

          return (
            <div
              key={m.id}
              onContextMenu={(e) => {
                e.preventDefault();
                handleDelete(m.id);
              }}
              className={`flex items-end gap-2 transition-all duration-300 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* OTHER AVATAR */}
              {!isMe && (
                <img
                  src="/default-avatar.png"
                  className="w-8 h-8 rounded-full"
                />
              )}

              {/* MESSAGE */}
              <div
                className={`px-3 py-2 rounded-2xl max-w-xs text-sm shadow transform transition-all duration-300 ${
                  m.deleted
                    ? "opacity-50 scale-95 italic bg-gray-200"
                    : isMe
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 rounded-bl-none"
                }`}
              >
                {/* DELETED */}
                {m.deleted ? (
                  <p className="italic text-xs">
                    This message was deleted
                  </p>
                ) : (
                  <>
                    {m.content && <p>{m.content}</p>}
                  </>
                )}

                {/* ✔✔ SEEN */}
                {isMe && !m.deleted && (
                  <span className="text-[10px] mt-1 block text-right opacity-80">
                    {m.is_read ? "✔✔ Seen" : "✔ Sent"}
                  </span>
                )}
              </div>

              {/* YOUR AVATAR */}
              {isMe && (
                <img
                  src={user?.avatar_url || "/default-avatar.png"}
                  className="w-8 h-8 rounded-full"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 mt-3">

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
