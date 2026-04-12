import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "@/lib/auth";
import { getUserConversations } from "@/lib/chat";
import { supabase } from "@/supabase";

export default function InboxPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [convos, setConvos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 LOAD CONVERSATIONS
  useEffect(() => {
    const load = async () => {
      const current = await getCurrentUser();
      setUser(current);

      if (!current) return;

      const data = await getUserConversations(current.id);
      setConvos(data || []);
      setLoading(false);

      // 🔥 REAL-TIME UPDATE (NEW MESSAGES)
      const channel = supabase
        .channel("inbox-realtime")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          async () => {
            const updated = await getUserConversations(current.id);
            setConvos(updated || []);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    load();
  }, []);

  if (loading) {
    return <div className="p-6">Loading messages...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {convos.length === 0 && (
        <div className="text-gray-500 text-center mt-10">
          No conversations yet 💬
        </div>
      )}

      <div className="space-y-2">
        {convos.map((c) => (
          <div
            key={c.id}
            onClick={() =>
              navigate(`/chat-room?seller=${c.otherUserId}`)
            }
            className="flex items-center justify-between border rounded-xl p-3 cursor-pointer hover:bg-gray-50 transition"
          >

            {/* LEFT SIDE */}
            <div className="flex flex-col">
              <p className="font-semibold">
                User {c.otherUserId?.slice(0, 6)}
              </p>

              <p className="text-sm text-gray-500 truncate max-w-xs">
                {c.lastMessage || "Start a conversation"}
              </p>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col items-end gap-1">

              {/* TIME */}
              <span className="text-xs text-gray-400">
                {c.lastTime
                  ? new Date(c.lastTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </span>

              {/* 🔴 UNREAD BADGE */}
              {c.unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {c.unreadCount}
                </span>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
