export type Role = "entrepreneur" | "customer" | "admin" | "unknown";
export type UserBadge = "" | "verified" | "special";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  address?: string;
  businessName?: string;
  badge?: UserBadge;
  verified?: boolean;
  bio?: string;
  createdAt?: string;
};

export type DbUser = StoredUser & {
  password: string;
  createdAt: string;
};

const USERS_KEY = "cp_users";
const TOKEN_KEY = "token";
const USER_KEY = "user";

export function ensureAdminSeeded() {
  const users = readUsers();
  const hasAdmin = users.some((u) => u.role === "admin");
  if (hasAdmin) return;

  const admin: DbUser = {
    id: cryptoId(),
    name: "System Admin",
    email: "admin@campusprenuer.com",
    password: "Admin@12345",
    role: "admin",
    badge: "special",
    verified: true,
    createdAt: new Date().toISOString(),
  };

  writeUsers([admin, ...users]);
}

export function readAuth(): { token: string | null; user: StoredUser | null } {
  const token = localStorage.getItem(TOKEN_KEY);
  const userRaw = localStorage.getItem(USER_KEY);

  let user: StoredUser | null = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  return { token, user };
}

export function setSession(user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, "demo-token");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function readUsers(): DbUser[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeUsers(users: DbUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function signupDbUser(payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
  phone?: string;
  address?: string;
  businessName?: string;
  bio?: string;
}): StoredUser {
  const users = readUsers();
  const email = payload.email.toLowerCase().trim();

  if (!payload.name.trim()) throw new Error("Name is required");
  if (!email) throw new Error("Email is required");
  if (!payload.password) throw new Error("Password is required");

  if (users.some((u) => u.email === email)) {
    throw new Error("This email already has an account");
  }

  const newUser: DbUser = {
    id: cryptoId(),
    name: payload.name.trim(),
    email,
    password: payload.password,
    role: payload.role,
    phone: payload.phone?.trim() || "",
    address: payload.address?.trim() || "",
    businessName: payload.businessName?.trim() || "",
    bio: payload.bio?.trim() || "",
    badge: "",
    verified: false,
    createdAt: new Date().toISOString(),
  };

  const updated = [newUser, ...users];
  writeUsers(updated);

  return sanitizeUser(newUser);
}

export function loginDbUser(email: string, password: string): StoredUser {
  const users = readUsers();
  const found = users.find((u) => u.email === email.toLowerCase().trim());

  if (!found) throw new Error("Invalid email or password");
  if (found.password !== password) throw new Error("Invalid email or password");

  return sanitizeUser(found);
}

export function deleteDbUser(userId: string, password: string) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);

  if (idx === -1) throw new Error("Account not found");
  if (users[idx].role === "admin") {
    throw new Error("Admin account cannot be deleted");
  }
  if (users[idx].password !== password) throw new Error("Incorrect password");

  users.splice(idx, 1);
  writeUsers(users);
  clearSession();
}

export function getSellerId(): string | null {
  const { token, user } = readAuth();
  if (!token || !user) return null;
  if (user.role !== "entrepreneur") return null;
  return user.id;
}

function sanitizeUser(user: DbUser): StoredUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || "",
    address: user.address || "",
    businessName: user.businessName || "",
    badge: user.badge || "",
    verified: Boolean(user.verified),
    bio: user.bio || "",
    createdAt: user.createdAt,
  };
}

function cryptoId() {
  const g = globalThis as any;
  if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
