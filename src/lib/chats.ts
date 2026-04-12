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

// 💬 SEND MESSAGE (UPDATED WITH is_read)
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
