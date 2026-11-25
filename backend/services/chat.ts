import { isSupabaseConfigured, supabase } from "@backend/supabase/client";

export interface ChatParticipant {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface ChatConversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  updated_at?: string | null;
  buyer: ChatParticipant | null;
  seller: ChatParticipant | null;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationListItem {
  id: string;
  buyer_id: string;
  seller_id: string;
  otherUser: ChatParticipant;
  lastMessage: string;
  lastMessageAt: string;
  lastSenderId: string | null;
  unreadCount: number;
}

const CONVERSATION_SELECT = `
  id,
  buyer_id,
  seller_id,
  created_at,
  updated_at,
  buyer:profiles!buyer_id(id, full_name, avatar_url),
  seller:profiles!seller_id(id, full_name, avatar_url)
`;

function normalizeParticipant(raw: unknown): ChatParticipant | null {
  const item = Array.isArray(raw) ? raw[0] : raw;
  if (!item || typeof item !== "object") return null;
  const record = item as Record<string, unknown>;
  if (typeof record.id !== "string") return null;
  return {
    id: record.id,
    full_name: typeof record.full_name === "string" ? record.full_name : null,
    avatar_url: typeof record.avatar_url === "string" ? record.avatar_url : null,
  };
}

function normalizeConversation(raw: Record<string, unknown>): ChatConversation {
  return {
    id: String(raw.id),
    buyer_id: String(raw.buyer_id),
    seller_id: String(raw.seller_id),
    created_at: String(raw.created_at),
    updated_at: typeof raw.updated_at === "string" ? raw.updated_at : null,
    buyer: normalizeParticipant(raw.buyer),
    seller: normalizeParticipant(raw.seller),
  };
}

export function getParticipantDisplayName(participant?: ChatParticipant | null): string {
  const trimmed = participant?.full_name?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : "Member";
}

export function getOtherParticipant(
  conversation: Pick<ChatConversation, "buyer_id" | "seller_id" | "buyer" | "seller">,
  currentUserId: string
): ChatParticipant {
  const isBuyer = currentUserId === conversation.buyer_id;
  const raw = isBuyer ? conversation.seller : conversation.buyer;
  const fallbackId = isBuyer ? conversation.seller_id : conversation.buyer_id;

  return {
    id: raw?.id || fallbackId,
    full_name: getParticipantDisplayName(raw),
    avatar_url: raw?.avatar_url ?? null,
  };
}

/**
 * Finds an existing conversation between currentUserId and sellerId,
 * or creates a new one. Strictly blocks self-messaging.
 */
export async function startConversation(
  currentUserId: string,
  sellerId: string
): Promise<ChatConversation | null> {
  if (!isSupabaseConfigured || !currentUserId || !sellerId || currentUserId === sellerId) {
    return null;
  }

  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .or(
      `and(buyer_id.eq.${currentUserId},seller_id.eq.${sellerId}),and(buyer_id.eq.${sellerId},seller_id.eq.${currentUserId})`
    )
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;
  if (existing) {
    return normalizeConversation(existing as unknown as Record<string, unknown>);
  }

  const { data: created, error: insertError } = await supabase
    .from("conversations")
    .insert({
      buyer_id: currentUserId,
      seller_id: sellerId,
    })
    .select(CONVERSATION_SELECT)
    .single();

  if (insertError) {
    // Handle concurrent creation race if unique constraint triggers
    if (insertError.code === "23505") {
      const { data: retry, error: retryError } = await supabase
        .from("conversations")
        .select(CONVERSATION_SELECT)
        .or(
          `and(buyer_id.eq.${currentUserId},seller_id.eq.${sellerId}),and(buyer_id.eq.${sellerId},seller_id.eq.${currentUserId})`
        )
        .limit(1)
        .maybeSingle();
      if (retryError) throw retryError;
      return retry ? normalizeConversation(retry as unknown as Record<string, unknown>) : null;
    }
    throw insertError;
  }

  return normalizeConversation(created as unknown as Record<string, unknown>);
}

export async function getConversationById(
  conversationId: string,
  currentUserId: string
): Promise<ChatConversation | null> {
  if (!isSupabaseConfigured || !conversationId || !currentUserId) return null;

  const { data, error } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .eq("id", conversationId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const conv = normalizeConversation(data as unknown as Record<string, unknown>);
  if (conv.buyer_id === conv.seller_id) return null;
  if (conv.buyer_id !== currentUserId && conv.seller_id !== currentUserId) return null;

  return conv;
}

export async function getUserConversations(
  currentUserId: string
): Promise<ConversationListItem[]> {
  if (!isSupabaseConfigured || !currentUserId) return [];

  const { data: convRows, error: convError } = await supabase
    .from("conversations")
    .select(CONVERSATION_SELECT)
    .or(`buyer_id.eq.${currentUserId},seller_id.eq.${currentUserId}`)
    .order("created_at", { ascending: false });

  if (convError) throw convError;
  if (!convRows || convRows.length === 0) return [];

  const validConvs = convRows
    .map((row) => normalizeConversation(row as unknown as Record<string, unknown>))
    .filter((conv) => conv.buyer_id !== conv.seller_id);

  if (validConvs.length === 0) return [];

  const convIds = validConvs.map((c) => c.id);
  const { data: msgRows, error: msgError } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, content, is_read, created_at")
    .in("conversation_id", convIds)
    .order("created_at", { ascending: false });

  if (msgError) throw msgError;

  const latestByConv = new Map<string, ChatMessage>();
  const unreadByConv = new Map<string, number>();

  for (const rawMsg of msgRows || []) {
    const msg = rawMsg as ChatMessage;
    if (!latestByConv.has(msg.conversation_id)) {
      latestByConv.set(msg.conversation_id, msg);
    }
    if (!msg.is_read && msg.sender_id !== currentUserId) {
      unreadByConv.set(msg.conversation_id, (unreadByConv.get(msg.conversation_id) || 0) + 1);
    }
  }

  return validConvs
    .map((conv) => {
      const otherUser = getOtherParticipant(conv, currentUserId);
      const last = latestByConv.get(conv.id);
      return {
        id: conv.id,
        buyer_id: conv.buyer_id,
        seller_id: conv.seller_id,
        otherUser,
        lastMessage: last?.content || "",
        lastMessageAt: last?.created_at || conv.updated_at || conv.created_at,
        lastSenderId: last?.sender_id || null,
        unreadCount: unreadByConv.get(conv.id) || 0,
      };
    })
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  if (!isSupabaseConfigured || !conversationId) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("id, conversation_id, sender_id, content, is_read, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []) as ChatMessage[];
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
): Promise<ChatMessage> {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error("Message cannot be empty.");
  }
  if (!isSupabaseConfigured) {
    throw new Error("Chat service is not configured.");
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content: trimmed,
      is_read: false,
    })
    .select("id, conversation_id, sender_id, content, is_read, created_at")
    .single();

  if (error) throw error;

  // Best-effort timestamp bump on conversation
  void supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  return data as ChatMessage;
}

export async function markConversationMessagesAsRead(
  conversationId: string,
  currentUserId: string
): Promise<void> {
  if (!isSupabaseConfigured || !conversationId || !currentUserId) return;

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", currentUserId)
    .eq("is_read", false);

  if (error) {
    console.error("Failed to mark messages as read:", error);
  }
}

export async function deleteMessage(messageId: string, senderId: string): Promise<void> {
  if (!isSupabaseConfigured || !messageId || !senderId) return;

  const { error } = await supabase
    .from("messages")
    .delete()
    .eq("id", messageId)
    .eq("sender_id", senderId);

  if (error) throw error;
}
