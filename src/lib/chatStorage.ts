export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  read: boolean;
};

export type Conversation = {
  id: string;
  participants: string[]; // user IDs
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
};

const CONVERSATIONS_KEY = "cp_conversations";
const MESSAGES_KEY = "cp_messages";

export function getConversations(): Conversation[] {
  const raw = localStorage.getItem(CONVERSATIONS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveConversations(conversations: Conversation[]) {
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
}

export function getMessages(): ChatMessage[] {
  const raw = localStorage.getItem(MESSAGES_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveMessages(messages: ChatMessage[]) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function getOrCreateConversation(userId: string, otherId: string, otherName: string): Conversation {
  const conversations = getConversations();
  const sortedIds = [userId, otherId].sort();
  const convoId = sortedIds.join("_");
  
  let convo = conversations.find(c => c.id === convoId);
  
  if (!convo) {
    convo = {
      id: convoId,
      participants: sortedIds,
      participantNames: ["You", otherName],
      lastMessage: "",
      lastMessageTime: Date.now(),
      unreadCount: 0
    };
    conversations.push(convo);
    saveConversations(conversations);
  }
  
  return convo;
}

export function sendMessage(conversationId: string, senderId: string, senderName: string, content: string): ChatMessage {
  const messages = getMessages();
  const newMessage: ChatMessage = {
    id: crypto.randomUUID(),
    conversationId,
    senderId,
    senderName,
    content,
    timestamp: Date.now(),
    read: false
  };
  
  messages.push(newMessage);
  saveMessages(messages);
  
  // Update conversation
  const conversations = getConversations();
  const convo = conversations.find(c => c.id === conversationId);
  if (convo) {
    convo.lastMessage = content;
    convo.lastMessageTime = Date.now();
    saveConversations(conversations);
  }
  
  return newMessage;
}

export function getConversationMessages(conversationId: string): ChatMessage[] {
  const messages = getMessages();
  return messages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function markConversationRead(conversationId: string, userId: string) {
  const messages = getMessages();
  messages.forEach(m => {
    if (m.conversationId === conversationId && m.senderId !== userId) {
      m.read = true;
    }
  });
  saveMessages(messages);
  
  const conversations = getConversations();
  const convo = conversations.find(c => c.id === conversationId);
  if (convo) {
    convo.unreadCount = 0;
    saveConversations(conversations);
  }
}
