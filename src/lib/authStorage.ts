// src/lib/authStorage.ts
export type Role = "entrepreneur" | "customer" | "admin" | "unknown";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type DbUser = StoredUser & {
  password: string; // demo only
  createdAt: string;
};

const USERS_KEY = "cp_users";
const TOKEN_KEY = "token";
const USER_KEY = "user";

/** Seed a default admin in localStorage DB (demo). CHANGE the credentials. */
export function ensureAdminSeeded() {
  const users = readUsers();
  const hasAdmin = users.some((u) => u.role === "admin");
  if (hasAdmin) return;

  const admin: DbUser = {
    id: cryptoId(),
    name: "System Admin",
    email: "admin@campusprenuer.com",
    password: "Admin@12345", // 🔴 CHANGE THIS
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  writeUsers([admin, ...users]);
}

/** ---- Session helpers (your app already expects token + user) ---- */
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
  // demo token
  localStorage.setItem(TOKEN_KEY, "demo-token");
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/** ---- Demo user DB helpers (needed for delete-account + login) ---- */
export function readUsers(): DbUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
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
    createdAt: new Date().toISOString(),
  };

  const updated = [newUser, ...users];
  writeUsers(updated);

  return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
}

export function loginDbUser(email: string, password: string): StoredUser {
  const users = readUsers();
  const found = users.find((u) => u.email === email.toLowerCase().trim());
  if (!found) throw new Error("Invalid email or password");
  if (found.password !== password) throw new Error("Invalid email or password");

  return { id: found.id, name: found.name, email: found.email, role: found.role };
}

export function deleteDbUser(userId: string, password: string) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("Account not found");

  if (users[idx].password !== password) throw new Error("Incorrect password");

  users.splice(idx, 1);
  writeUsers(users);
  clearSession();
}

/** ---- tiny utils ---- */
function cryptoId() {
  // works on modern browsers; fallback if needed
  const g = globalThis as any;
  if (g.crypto?.randomUUID) return g.crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
