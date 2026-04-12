import { supabase } from "@/supabase";

/* ================= CONVERSATION ================= */
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
      .insert([{ user1_id: userId, user2_id: otherId }])
      .select()
      .single();

    return newConvo;
  }

  return convo;
}

/* ================= SEND TEXT ================= */
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
      deleted: false, // ✅ ensure exists
    },
  ]);
}

/* ================= SEND IMAGE ================= */
export async function sendImage(
  conversationId: string,
  senderId: string,
  file: File
) {
  const fileName = `img-${Date.now()}-${file.name}`;

  await supabase.storage.from("images").upload(fileName, file);

  const { data } = supabase.storage.from("images").getPublicUrl(fileName);

  await supabase.from("messages").insert([
    {
      conversation_id: conversationId,
      sender_id: senderId,
      image_url: data.publicUrl,
      is_read: false,
      deleted: false,
    },
  ]);
}

/* ================= SEND AUDIO ================= */
export async function sendAudio(
  conversationId: string,
  senderId: string,
  blob: Blob
) {
  const fileName = `audio-${Date.now()}.webm`;

  await supabase.storage.from("audio").upload(fileName, blob);

  const { data } = supabase.storage.from("audio").getPublicUrl(fileName);

  await supabase.from("messages").insert([
    {
      conversation_id: conversationId,
      sender_id: senderId,
      audio_url: data.publicUrl,
      is_read: false,
      deleted: false,
    },
  ]);
}

/* ================= DELETE MESSAGE ================= */
export async function deleteMessage(messageId: string) {
  await supabase
    .from("messages")
    .update({
      deleted: true,
      content: "This message was deleted",
      image_url: null,
      audio_url: null,
    })
    .eq("id", messageId);
}

/* ================= UNREAD ================= */
export async function getUnreadCount(userId: string) {
  const { data } = await supabase.from("messages").select("*");

  return (
    data?.filter(
      (m) =>
        m.sender_id !== userId &&
        m.is_read === false &&
        !m.deleted // ✅ ignore deleted
    ).length || 0
  );
}

/* ================= MARK READ ================= */
export async function markAsRead(conversationId: string, userId: string) {
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .eq("deleted", false); // ✅ only real messages
}

/* ================= INBOX ================= */
export async function getUserConversations(userId: string) {
  const { data: convos } = await supabase
    .from("conversations")
    .select("*");

  if (!convos) return [];

  const myConvos = convos.filter(
    (c) => c.user1_id === userId || c.user2_id === userId
  );

  const results: any[] = [];

  for (const convo of myConvos) {
    const otherUserId =
      convo.user1_id === userId ? convo.user2_id : convo.user1_id;

    const { data: userData } = await supabase
      .from("users")
      .select("name, avatar_url")
      .eq("id", otherUserId)
      .single();

    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convo.id)
      .order("created_at", { ascending: false })
      .limit(1);

    const { data: unread } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", convo.id)
      .eq("is_read", false)
      .neq("sender_id", userId)
      .eq("deleted", false);

    results.push({
      ...convo,
      otherUserId,
      name: userData?.name || "User",
      avatar: userData?.avatar_url || "",
      lastMessage: messages?.[0]?.deleted
        ? "Message deleted"
        : messages?.[0]?.content || "",
      lastTime: messages?.[0]?.created_at || "",
      unreadCount: unread?.length || 0,
    });
  }

  return results;
}
