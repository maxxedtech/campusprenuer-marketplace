import { supabase } from "@/supabase";

// 🔥 CREATE OR GET CONVERSATION
export async function getOrCreateConversation(userId: string, otherId: string) {
  const { data } = await supabase.from("conversations").select("*");

  let convo = data?.find(
    (c) =>
      (c.user1_id === userId && c.user2_id === otherId) ||
      (c.user1_id === otherId && c.user2_id === userId)
  );

  if (!convo) {
    const { data: newConvo } = await supabase
      .from("conversations")
      .insert([
        {
          user1_id: userId,
          user2_id: otherId,
        },
      ])
      .select()
      .single();

    return newConvo;
  }

  return convo;
}

// 💬 SEND MESSAGE
export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string
) {
  await supabase.from("messages").insert([
    {
      conversation_id: conversationId,
      sender_id: senderId,
      content,
      is_read: false,
    },
  ]);
}

// 📩 GET UNREAD COUNT
export async function getUnreadCount(userId: string) {
  const { data } = await supabase.from("messages").select("*");

  return (
    data?.filter(
      (m) => m.sender_id !== userId && m.is_read === false
    ).length || 0
  );
}

// ✅ MARK AS READ
export async function markAsRead(conversationId: string, userId: string) {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId);
}

// 📥 GET USER CONVERSATIONS (INBOX)
export async function getUserConversations(userId: string) {
  const { data: convos } = await supabase
    .from("conversations")
    .select("*");

  if (!convos) return [];

  const myConvos = convos.filter(
    (c) => c.user1_id === userId || c.user2_id === userId
  );

  const results = [];

  for (const convo of myConvos) {
    const otherUserId =
      convo.user1_id === userId ? convo.user2_id : convo.user1_id;

    // 🔥 LAST MESSAGE
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: false })
      .limit(1);

    // 🔥 UNREAD COUNT
    const { data: unread } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convo.id)
      .eq("is_read", false)
      .neq("sender_id", userId);

    results.push({
      ...convo,
      otherUserId,
      lastMessage: messages?.[0]?.content || "",
      lastTime: messages?.[0]?.created_at || "",
      unreadCount: unread?.length || 0,
    });
  }

  return results;
}
