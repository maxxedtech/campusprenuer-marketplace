export type UserRole = "entrepreneur" | "customer" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  contact: string;
  category: string;
  latitude: number | null;
  longitude: number | null;
  address: string;
  logoUrl?: string;
  bannerUrl?: string;
  isPremium: boolean;
}

export interface Listing {
  id: string;
  businessId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  type: "product" | "service";
  available: boolean;
  images: string[];
  isFeatured: boolean;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participants: string[];
  participantNames: string[];
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: string[];
}

export const CATEGORIES: Category[] = [
  { id: "food", name: "Food & Drinks", icon: "🍔", subcategories: ["Restaurant", "Bakery", "Catering", "Beverages"] },
  { id: "fashion", name: "Fashion", icon: "👗", subcategories: ["Clothing", "Shoes", "Accessories", "Jewelry"] },
  { id: "electronics", name: "Electronics", icon: "📱", subcategories: ["Phones", "Computers", "Gadgets", "Repairs"] },
  { id: "beauty", name: "Beauty & Health", icon: "💄", subcategories: ["Salon", "Spa", "Fitness", "Pharmacy"] },
  { id: "home", name: "Home & Living", icon: "🏠", subcategories: ["Furniture", "Cleaning", "Decor", "Gardening"] },
  { id: "services", name: "Professional Services", icon: "💼", subcategories: ["Plumbing", "Electrical", "Tutoring", "Photography"] },
];
