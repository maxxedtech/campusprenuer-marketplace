import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  Loader2,
  Send,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import UserAvatar from "@/components/common/UserAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useUnreadMessages } from "@/contexts/UnreadMessagesContext";
import {
  deleteMessage,
  getConversationById,
  getMessages,
  getOtherParticipant,
  getParticipantDisplayName,
  sendMessage,
  startConversation,
  type ChatConversation,
  type ChatMessage,
} from "@/lib/chat";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

function formatMessageTime(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setActiveConversationId, markConversationAsRead } = useUnreadMessages();

  const convIdParam = params.get("conv");
  const sellerIdParam = params.get("seller");
  const productTitleParam = params.get("product");

  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Load or start conversation (with strict self-messaging guard)
  useEffect(() => {
    let active = true;

    const init = async () => {
      if (!user) return;

      if (sellerIdParam && sellerIdParam === user.id) {
        toast.error("You cannot message yourself.");
        navigate("/chat", { replace: true });
        return;
      }

      setLoading(true);
      try {
        let conv: ChatConversation | null = null;

        if (convIdParam) {
          conv = await getConversationById(convIdParam, user.id);
        } else if (sellerIdParam) {
          conv = await startConversation(user.id, sellerIdParam);
        }

        if (!active) return;

        if (!conv) {
          toast.error("Conversation could not be opened.");
          navigate("/chat", { replace: true });
          return;
        }

        setConversation(conv);
        setActiveConversationId(conv.id);

        const initialMessages = await getMessages(conv.id);
        if (!active) return;

        setMessages(initialMessages);
        await markConversationAsRead(conv.id);

        // Instant scroll on initial load
        window.setTimeout(() => scrollToBottom("auto"), 50);
      } catch (error) {
        console.error("Failed to initialize chat:", error);
        if (active) {
          toast.error("Could not load conversation.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void init();

    return () => {
      active = false;
      setActiveConversationId(null);
    };
  }, [
    user,
    convIdParam,
    sellerIdParam,
    navigate,
    setActiveConversationId,
    markConversationAsRead,
    scrollToBottom,
  ]);

  // Real-time subscription for active conversation messages
  useEffect(() => {
    if (!isSupabaseConfigured || !conversation || !user) return;

    const channel = supabase
      .channel(`conversation-${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (!newMsg) return;

          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });

          if (newMsg.sender_id !== user.id) {
            void markConversationAsRead(conversation.id);
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const updatedMsg = payload.new as ChatMessage;
          if (!updatedMsg) return;
          setMessages((prev) =>
            prev.map((m) => (m.id === updatedMsg.id ? { ...m, ...updatedMsg } : m))
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => {
          const deletedId = (payload.old as { id?: string })?.id;
          if (!deletedId) return;
          setMessages((prev) => prev.filter((m) => m.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversation, user, markConversationAsRead]);

  // Smooth auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages.length, scrollToBottom]);

  const otherUser = useMemo(() => {
    if (!conversation || !user) return null;
    return getOtherParticipant(conversation, user.id);
  }, [conversation, user]);

  const otherDisplayName = useMemo(
    () => getParticipantDisplayName(otherUser),
    [otherUser]
  );

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || !user || !conversation || sending) return;

    setSending(true);
    setText("");
    try {
      const sent = await sendMessage(conversation.id, user.id, trimmed);
      setMessages((prev) => (prev.some((m) => m.id === sent.id) ? prev : [...prev, sent]));
    } catch (error) {
      console.error("Failed to send message:", error);
      setText(trimmed);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!user) return;
    try {
      await deleteMessage(messageId, user.id);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Could not delete message.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-4 sm:py-6 px-3 sm:px-4 flex flex-col">
      <div className="max-w-3xl w-full mx-auto flex-1 flex flex-col rounded-3xl border border-slate-800/90 bg-slate-900 shadow-2xl overflow-hidden h-[calc(100vh-6.5rem)] max-h-[820px]">
        {/* Active Chat Header */}
        <header className="px-4 py-3.5 sm:px-6 border-b border-slate-800 bg-slate-900/95 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => navigate("/chat")}
              aria-label="Back to inbox"
              className="text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            {otherUser ? (
              <div className="flex items-center gap-3 min-w-0">
                <UserAvatar
                  user={{
                    full_name: otherDisplayName,
                    avatar_url: otherUser.avatar_url,
                  }}
                  size="md"
                  className="ring-2 ring-slate-800 shrink-0"
                />
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base font-bold text-white truncate">
                    {otherDisplayName}
                  </h1>
                  <p className="text-[11px] text-emerald-400 font-medium">
                    Marketplace Chat
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-10 w-40 rounded-xl bg-slate-800 animate-pulse" />
            )}
          </div>

          {productTitleParam && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 max-w-[220px]">
              <ShoppingBag className="w-3.5 h-3.5 text-brand-orange shrink-0" />
              <span className="truncate">{productTitleParam}</span>
            </div>
          )}
        </header>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 space-y-3 bg-slate-950/70">
          {loading ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin mr-2 text-brand-orange" />
              <span className="text-sm">Loading conversation...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              {otherUser && (
                <UserAvatar
                  user={{
                    full_name: otherDisplayName,
                    avatar_url: otherUser.avatar_url,
                  }}
                  size="lg"
                  className="mb-3 ring-4 ring-slate-800"
                />
              )}
              <p className="text-base font-semibold text-white">
                Start chatting with {otherDisplayName}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Say hello, ask about availability, or agree on delivery details.
              </p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.sender_id === user?.id;
              const prevMessage = index > 0 ? messages[index - 1] : null;
              const showSenderMeta =
                !isOwnMessage && prevMessage?.sender_id !== message.sender_id;

              return (
                <div
                  key={message.id}
                  className={`flex w-full ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-end gap-2 max-w-[82%] sm:max-w-[72%] ${
                      isOwnMessage ? "ml-auto flex-row-reverse" : "mr-auto"
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="w-7 shrink-0">
                        {showSenderMeta && otherUser && (
                          <UserAvatar
                            user={{
                              full_name: otherDisplayName,
                              avatar_url: otherUser.avatar_url,
                            }}
                            size="sm"
                            className="h-7 w-7 text-[10px]"
                          />
                        )}
                      </div>
                    )}

                    <div className="group relative">
                      {showSenderMeta && (
                        <p className="text-[11px] font-semibold text-slate-400 mb-1 ml-1">
                          {otherDisplayName}
                        </p>
                      )}

                      <div
                        className={`px-3.5 py-2.5 text-sm leading-relaxed shadow-sm ${
                          isOwnMessage
                            ? "bg-brand-orange text-white rounded-2xl rounded-br-sm"
                            : "bg-slate-800 text-slate-100 border border-slate-700/70 rounded-2xl rounded-bl-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">
                          {message.content}
                        </p>

                        <div
                          className={`mt-1 flex items-center gap-1.5 text-[10px] ${
                            isOwnMessage
                              ? "justify-end text-white/80"
                              : "justify-start text-slate-400"
                          }`}
                        >
                          <span>{formatMessageTime(message.created_at)}</span>
                          {isOwnMessage &&
                            (message.is_read ? (
                              <CheckCheck
                                className="w-3.5 h-3.5 text-white"
                                aria-label="Read"
                              />
                            ) : (
                              <Check
                                className="w-3.5 h-3.5 text-white/75"
                                aria-label="Sent"
                              />
                            ))}
                        </div>
                      </div>

                      {isOwnMessage && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(message.id)}
                          aria-label="Delete message"
                          title="Delete message"
                          className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity absolute -left-7 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-500 hover:text-red-400 hover:bg-slate-800"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="px-4 py-3 sm:px-6 border-t border-slate-800 bg-slate-900 flex items-center gap-2.5 shrink-0"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              otherUser ? `Message ${otherDisplayName}...` : "Type a message..."
            }
            disabled={loading || !conversation}
            aria-label="Message input"
            className="flex-1 h-11 bg-slate-950/80 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl focus-visible:ring-brand-orange"
          />
          <Button
            type="submit"
            disabled={loading || !conversation || sending || !text.trim()}
            className="h-11 px-4 bg-brand-orange hover:bg-brand-orange/90 text-white font-semibold rounded-xl shrink-0"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
