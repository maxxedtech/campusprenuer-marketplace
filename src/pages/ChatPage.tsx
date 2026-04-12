import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { supabase } from "@/supabase";
import { getCurrentUser } from "@/lib/auth";
import {
  getOrCreateConversation,
  sendMessage,
  sendImage,
  sendAudio,
  markAsRead,
} from "@/lib/chat";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [params] = useSearchParams();

  const sellerId = params.get("seller");
  const sellerName = params.get("name");

  const [user, setUser] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const current = await getCurrentUser();
      setUser(current);

      if (!current || !sellerId) return;

      const convo = await getOrCreateConversation(current.id, sellerId);
      setConversation(convo);

      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", convo.id)
        .order("created_at", { ascending: true });

      setMessages(data || []);

      await markAsRead(convo.id, current.id);

      const channel = supabase
        .channel(`chat-${convo.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${convo.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    load();
  }, [sellerId]);

  /* ================= SEND ================= */
  const handleSend = async () => {
    if (!text.trim()) return;

    await sendMessage(conversation.id, user.id, text);
    setText("");
  };

  /* ================= IMAGE ================= */
  const handleImage = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    await sendImage(conversation.id, user.id, file);
  };

  /* ================= AUDIO ================= */
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    const chunks: any[] = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      await sendAudio(conversation.id, user.id, blob);
    };

    recorder.start();
    setMediaRecorder(recorder);
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col h-[90vh]">

      {/* HEADER */}
      <h1 className="text-lg font-bold mb-2">
        {sellerName || "Chat"}
      </h1>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto space-y-3 border p-3 rounded-xl bg-white">

        {messages.map((m) => {
          const isMe = m.sender_id === user?.id;

          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {!isMe && (
                <img
                  src="/default-avatar.png"
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div
                className={`px-3 py-2 rounded-2xl max-w-xs text-sm shadow ${
                  isMe
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
              >
                {m.content && <p>{m.content}</p>}

                {m.image_url && (
                  <img
                    src={m.image_url}
                    className="rounded mt-1 max-w-[200px]"
                  />
                )}

                {m.audio_url && (
                  <audio controls className="mt-1">
                    <source src={m.audio_url} />
                  </audio>
                )}
              </div>

              {isMe && (
                <img
                  src={user?.avatar_url || "/default-avatar.png"}
                  className="w-8 h-8 rounded-full"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 mt-3">

        <input type="file" onChange={handleImage} />

        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type message..."
        />

        <Button onClick={handleSend}>Send</Button>

        {!recording ? (
          <Button onClick={startRecording}>🎤</Button>
        ) : (
          <Button onClick={stopRecording} className="bg-red-500">
            Stop
          </Button>
        )}
      </div>

    </div>
  );
}
