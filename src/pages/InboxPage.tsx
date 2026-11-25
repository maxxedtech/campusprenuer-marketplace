import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Search, Store } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/contexts/UnreadMessagesContext";
import {
  getParticipantDisplayName,
  getUserConversations,
  type ConversationListItem,
} from "@/lib/chat";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

function formatConversationTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export default function InboxPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { unreadByConversation, totalUnread } = useUnreadMessages();

  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadConversations = useCallback(async () => {
    if (!user) {
      setConversations([]);
      setLoading(false);
      return;
    }

    try {
      const list = await getUserConversations(user.id);
      setConversations(list);
    } catch (error) {
      console.error("Failed to load conversations:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  // Keep inbox list fresh on real-time message inserts/updates
  useEffect(() => {
    if (!isSupabaseConfigured || !user) return;

    const channel = supabase
      .channel(`inbox-sync-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => {
          void loadConversations();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user, loadConversations]);

  const enrichedConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations
      .map((conv) => ({
        ...conv,
        liveUnread: unreadByConversation[conv.id] ?? conv.unreadCount,
        displayName: getParticipantDisplayName(conv.otherUser),
      }))
      .filter((conv) => {
        if (!query) return true;
        return (
          conv.displayName.toLowerCase().includes(query) ||
          conv.lastMessage.toLowerCase().includes(query)
        );
      });
  }, [conversations, unreadByConversation, search]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-6 sm:py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="rounded-3xl border border-slate-800/90 bg-slate-900/90 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-5 sm:px-6 border-b border-slate-800/90 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-brand-orange/15 text-brand-orange flex items-center justify-center border border-brand-orange/25">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                    Messages
                  </h1>
                  {totalUnread > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[22px] h-5.5 px-1.5 rounded-full bg-brand-orange text-white text-xs font-bold">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  Direct conversations with buyers &amp; sellers
                </p>
              </div>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                aria-label="Search conversations"
                className="pl-9 h-10 bg-slate-950/70 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl focus-visible:ring-brand-orange"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="divide-y divide-slate-800/70">
            {loading ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className="h-16 rounded-2xl bg-slate-800/50 animate-pulse"
                  />
                ))}
              </div>
            ) : enrichedConversations.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-800/80 text-brand-orange flex items-center justify-center mb-4">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-semibold text-white">
                  {conversations.length === 0
                    ? "No conversations yet"
                    : "No matching conversations"}
                </h2>
                <p className="text-sm text-slate-400 mt-1.5 max-w-sm mx-auto">
                  {conversations.length === 0
                    ? "Browse the marketplace and message a seller to start chatting."
                    : "Try a different name or keyword."}
                </p>
                {conversations.length === 0 && (
                  <Button
                    onClick={() => navigate("/marketplace")}
                    className="mt-6 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold rounded-xl"
                  >
                    <Store className="w-4 h-4 mr-2" />
                    Browse Marketplace
                  </Button>
                )}
              </div>
            ) : (
              enrichedConversations.map((conversation) => {
                const hasUnread = conversation.liveUnread > 0;
                const isOwnLast = conversation.lastSenderId === user?.id;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/chat-room?conv=${encodeURIComponent(
                          conversation.id
                        )}&seller=${encodeURIComponent(conversation.otherUser.id)}`
                      )
                    }
                    className={`w-full text-left flex items-center gap-3.5 px-5 py-4 sm:px-6 transition-colors ${
                      hasUnread
                        ? "bg-slate-900 hover:bg-slate-800/90"
                        : "bg-slate-900/40 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="relative shrink-0">
                      <UserAvatar
                        user={{
                          full_name: conversation.displayName,
                          avatar_url: conversation.otherUser.avatar_url,
                        }}
                        size="md"
                        className="ring-2 ring-slate-800"
                      />
                      {hasUnread && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-brand-orange ring-2 ring-slate-900"
                        />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`truncate text-sm sm:text-base ${
                            hasUnread
                              ? "font-bold text-white"
                              : "font-semibold text-slate-200"
                          }`}
                        >
                          {conversation.displayName}
                        </p>
                        <span
                          className={`shrink-0 text-[11px] ${
                            hasUnread
                              ? "font-semibold text-brand-orange"
                              : "text-slate-500"
                          }`}
                        >
                          {formatConversationTime(conversation.lastMessageAt)}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-3">
                        <p
                          className={`truncate text-xs sm:text-sm ${
                            hasUnread
                              ? "font-semibold text-slate-100"
                              : "text-slate-400"
                          }`}
                        >
                          {conversation.lastMessage
                            ? `${isOwnLast ? "You: " : ""}${conversation.lastMessage}`
                            : "Start chatting..."}
                        </p>

                        {hasUnread && (
                          <span className="shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-brand-orange text-white text-[11px] font-bold">
                            {conversation.liveUnread > 99
                              ? "99+"
                              : conversation.liveUnread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
