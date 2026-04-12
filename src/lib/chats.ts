import { supabase } from "@/supabase";

// 🔥 CREATE OR GET CONVERSATION
export async function getOrCreateConversation(userId: string, otherId: string) {
  const { data } = await supabase
    .from("conversations")
    .select("*");

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
export async function sendMessage(conversationId: string, senderId: string, content: string) {
  await supabase.from("messages").insert([
    {
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    },
  ]);
}

// 📥 GET MESSAGES
export async function getMessages(conversationId: string) {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  return data;
}
