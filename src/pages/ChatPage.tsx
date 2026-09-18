import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { deleteMessage, getMessages, getOrCreateConversation, markAsRead, sendMessage } from "@/lib/chat";
import type { ChatMessage, Conversation } from "@/lib/chatStorage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ChatPage() { const [params] = useSearchParams(); const sellerId = params.get("seller"); const sellerName = params.get("name") || "Chat"; const [user, setUser] = useState<Awaited<ReturnType<typeof getCurrentUser>>>(null); const [conversation, setConversation] = useState<Conversation | null>(null); const [messages, setMessages] = useState<ChatMessage[]>([]); const [text, setText] = useState("");
  useEffect(() => { let active = true; const load = async () => { const current = await getCurrentUser(); if (!active || !current || !sellerId) return; setUser(current); const convo = getOrCreateConversation(current.id, sellerId); setConversation(convo); markAsRead(convo.id, current.id); setMessages(getMessages(convo.id)); }; load(); const interval = window.setInterval(load, 1000); return () => { active = false; window.clearInterval(interval); }; }, [sellerId]);
  const handleSend = () => { if (!text.trim() || !user || !conversation) return; sendMessage(conversation.id, user.id, text.trim()); setText(""); setMessages(getMessages(conversation.id)); };
  const handleDelete = (id: string) => { if (window.confirm("Delete this message?")) { deleteMessage(id); if (conversation) setMessages(getMessages(conversation.id)); } };
  return <div className="max-w-2xl mx-auto p-4 flex flex-col h-[90vh]"><h1 className="text-lg font-bold mb-2">{sellerName}</h1><div className="flex-1 overflow-y-auto space-y-3 border p-3 rounded-xl bg-white">{messages.map((message) => { const own = message.senderId === user?.id; return <div key={message.id} onContextMenu={(event) => { event.preventDefault(); handleDelete(message.id); }} className={`flex ${own ? "justify-end" : "justify-start"}`}><div className={`px-3 py-2 rounded-2xl max-w-xs text-sm ${own ? "bg-blue-500 text-white" : "bg-gray-200"}`}>{message.deleted ? <i>This message was deleted</i> : message.content}<span className="text-[10px] block opacity-70">{new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span></div></div>; })}</div><div className="flex items-center gap-2 mt-3"><Input value={text} onChange={(event) => setText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") handleSend(); }} placeholder="Type message..." /><Button onClick={handleSend}>Send</Button></div></div>;
}
