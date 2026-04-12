import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "@/lib/auth";
import { getUserConversations } from "@/lib/chat";
import { supabase } from "@/supabase";

export default function InboxPage() {
  const navigate = useNavigate();

  const [convos, setConvos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const data = await getUserConversations(user.id);
      setConvos(data || []);
      setLoading(false);

      // 🔥 REAL-TIME UPDATE
      const channel = supabase
        .channel("inbox-ui")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          async () => {
            const updated = await getUserConversations(user.id);
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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">Messages</h1>

      {convos.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No conversations yet 💬
        </p>
      )}

      <div className="space-y-2">

        {convos.map((c) => (
          <div
            key={c.id}
            onClick={() =>
              navigate(`/chat-room?seller=${c.otherUserId}&name=${c.name}`)
            }
            className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-50 transition"
          >

            {/* 🖼️ AVATAR */}
            {c.avatar ? (
              <img
                src={c.avatar}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm">
                {c.name.charAt(0)}
              </div>
            )}

            {/* 💬 TEXT */}
            <div className="flex-1">
              <div className="flex justify-between items-center">

                <p className="font-semibold">
                  {c.name}
                </p>

                <span className="text-xs text-gray-400">
                  {c.lastTime
                    ? new Date(c.lastTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>

              <div className="flex justify-between items-center mt-1">

                <p className="text-sm text-gray-500 truncate max-w-[180px]">
                  {c.lastMessage || "Start chatting..."}
                </p>

                {c.unreadCount > 0 && (
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {c.unreadCount}
                  </span>
                )}
              </div>
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
