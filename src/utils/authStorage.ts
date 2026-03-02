export type StoredUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
} | null;

export function getStoredUser(): StoredUser {
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getSellerId(): string | null {
  const user = getStoredUser();
  if (!user) return null;
  return (user.email || user.id || user.name || null) as string | null;
}

export function getSellerName(): string {
  const user = getStoredUser();
  return (user?.name || "Entrepreneur") as string;
}
