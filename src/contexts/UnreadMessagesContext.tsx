import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import {
  getConversationById,
  getOtherParticipant,
  getParticipantDisplayName,
  getUserConversations,
  markConversationMessagesAsRead,
  type ChatMessage,
} from "@/lib/chat";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface UnreadMessagesContextValue {
  totalUnread: number;
  unreadByConversation: Record<string, number>;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  markConversationAsRead: (conversationId: string) => Promise<void>;
  refreshUnreadCounts: () => Promise<void>;
}

const UnreadMessagesContext = createContext<UnreadMessagesContextValue | undefined>(undefined);

export function UnreadMessagesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [unreadByConversation, setUnreadByConversation] = useState<Record<string, number>>({});
  const [activeConversationId, setActiveConversationIdState] = useState<string | null>(null);

  const activeConversationIdRef = useRef<string | null>(null);
  const userConvIdsRef = useRef<Set<string>>(new Set());
  const convPartnerNamesRef = useRef<Map<string, string>>(new Map());

  const setActiveConversationId = useCallback((id: string | null) => {
    activeConversationIdRef.current = id;
    setActiveConversationIdState(id);
  }, []);

  const refreshUnreadCounts = useCallback(async () => {
    if (!isSupabaseConfigured || !user || user.role === "admin") {
      setUnreadByConversation({});
      userConvIdsRef.current = new Set();
      convPartnerNamesRef.current = new Map();
      return;
    }

    try {
      const conversations = await getUserConversations(user.id);
      const nextUnread: Record<string, number> = {};
      const nextIds = new Set<string>();
      const nextNames = new Map<string, string>();

      for (const conv of conversations) {
        nextIds.add(conv.id);
        nextNames.set(conv.id, getParticipantDisplayName(conv.otherUser));
        if (conv.unreadCount > 0 && conv.id !== activeConversationIdRef.current) {
          nextUnread[conv.id] = conv.unreadCount;
        }
      }

      userConvIdsRef.current = nextIds;
      convPartnerNamesRef.current = nextNames;
      setUnreadByConversation(nextUnread);
    } catch (err) {
      console.error("Failed to refresh unread message counts:", err);
    }
  }, [user]);

  const markConversationAsRead = useCallback(
    async (conversationId: string) => {
      if (!user || !conversationId) return;

      // Immediately clear local unread badge for snappy UX
      setUnreadByConversation((prev) => {
        if (!prev[conversationId]) return prev;
        const next = { ...prev };
        delete next[conversationId];
        return next;
      });

      await markConversationMessagesAsRead(conversationId, user.id);
    },
    [user]
  );

  useEffect(() => {
    void refreshUnreadCounts();
  }, [refreshUnreadCounts]);

  useEffect(() => {
    if (!isSupabaseConfigured || !user || user.role === "admin") return;

    const channel = supabase
      .channel(`unread-messages-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        async (payload) => {
          const newMsg = payload.new as ChatMessage;
          if (!newMsg || newMsg.sender_id === user.id) return;

          // Ensure this message belongs to a conversation of the current user
          if (!userConvIdsRef.current.has(newMsg.conversation_id)) {
            try {
              const conv = await getConversationById(newMsg.conversation_id, user.id);
              if (!conv) return;
              userConvIdsRef.current.add(conv.id);
              const other = getOtherParticipant(conv, user.id);
              convPartnerNamesRef.current.set(conv.id, getParticipantDisplayName(other));
            } catch {
              return;
            }
          }

          // If user is currently viewing this conversation, mark it read immediately
          if (newMsg.conversation_id === activeConversationIdRef.current) {
            await markConversationAsRead(newMsg.conversation_id);
            return;
          }

          setUnreadByConversation((prev) => ({
            ...prev,
            [newMsg.conversation_id]: (prev[newMsg.conversation_id] || 0) + 1,
          }));

          const senderLabel =
            convPartnerNamesRef.current.get(newMsg.conversation_id) || "New message";
          toast(senderLabel, {
            description:
              newMsg.content.length > 72
                ? `${newMsg.content.slice(0, 72)}…`
                : newMsg.content,
            action: {
              label: "Open",
              onClick: () => navigate(`/chat-room?conv=${newMsg.conversation_id}`),
            },
          });
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
          const updatedMsg = payload.new as ChatMessage;
          if (!updatedMsg || updatedMsg.sender_id === user.id) return;
          if (!userConvIdsRef.current.has(updatedMsg.conversation_id)) return;

          if (updatedMsg.is_read) {
            void refreshUnreadCounts();
          }
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [user, navigate, markConversationAsRead, refreshUnreadCounts]);

  const totalUnread = useMemo(
    () => Object.values(unreadByConversation).reduce((sum, count) => sum + count, 0),
    [unreadByConversation]
  );

  const value = useMemo(
    () => ({
      totalUnread,
      unreadByConversation,
      activeConversationId,
      setActiveConversationId,
      markConversationAsRead,
      refreshUnreadCounts,
    }),
    [
      totalUnread,
      unreadByConversation,
      activeConversationId,
      setActiveConversationId,
      markConversationAsRead,
      refreshUnreadCounts,
    ]
  );

  return (
    <UnreadMessagesContext.Provider value={value}>
      {children}
    </UnreadMessagesContext.Provider>
  );
}

export function useUnreadMessages() {
  const ctx = useContext(UnreadMessagesContext);
  if (!ctx) {
    throw new Error("useUnreadMessages must be used within an UnreadMessagesProvider");
  }
  return ctx;
}
