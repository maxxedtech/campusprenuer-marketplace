import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type AvatarUser = { full_name?: string | null; avatar_url?: string | null };

export default function UserAvatar({ user, size = "md", className = "" }: { user: AvatarUser; size?: "sm" | "md" | "lg"; className?: string }) {
  const name = user.full_name?.trim() || "User";
  const validUrl = typeof user.avatar_url === "string" && /^https?:\/\//i.test(user.avatar_url.trim()) ? user.avatar_url : undefined;
  const sizes = { sm: "h-8 w-8 text-xs", md: "h-10 w-10 text-sm", lg: "h-24 w-24 text-3xl" };
  return <Avatar className={`${sizes[size]} ${className}`}><AvatarImage src={validUrl} alt={`${name} profile picture`} /><AvatarFallback className="bg-brand-navy font-bold text-white">{name[0]?.toUpperCase() || "U"}</AvatarFallback></Avatar>;
}
