// src/lib/storage.ts
export type Role = "customer" | "entrepreneur" | "admin";

export type StoredUser = {
  id: string;
  name: string;
  email: string;
  password: string; // demo only (plain). Use hashing on a real backend.
  role: Role;
  createdAt: string;
};

export type SessionUser = Omit<StoredUser, "password">;

const USERS_KEY = "cp_users";
const SESSION_KEY = "cp_session";

// ---------- helpers ----------
function readUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// ---------- seed admin (optional) ----------
export function ensureAdminSeeded() {
  const users = readUsers();
  const hasAdmin = users.some((u) => u.role === "admin");
  if (hasAdmin) return;

  // ✅ Change these to your own secret credentials
  const adminEmail = "admin@campusprenuer.com";
  const adminPassword = "Admin@12345";

  const admin: StoredUser = {
    id: uid(),
    name: "System Admin",
    email: adminEmail.toLowerCase(),
    password: adminPassword,
    role: "admin",
    createdAt: new Date().toISOString(),
  };

  writeUsers([admin, ...users]);
}

export function signupUser(payload: {
  name: string;
  email: string;
  password: string;
  role: Role; // role chosen here only
}): SessionUser {
  const users = readUsers();
  const email = payload.email.toLowerCase().trim();

  if (!payload.name.trim()) throw new Error("Name is required");
  if (!email) throw new Error("Email is required");
  if (!payload.password) throw new Error("Password is required");

  const exists = users.some((u) => u.email === email);
  if (exists) throw new Error("An account with this email already exists");

  const newUser: StoredUser = {
    id: uid(),
    name: payload.name.trim(),
    email,
    password: payload.password,
    role: payload.role,
    createdAt: new Date().toISOString(),
  };

  const updated = [newUser, ...users];
  writeUsers(updated);

  const session: SessionUser = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    createdAt: newUser.createdAt,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function loginUser(email: string, password: string): SessionUser {
  const users = readUsers();
  const found = users.find((u) => u.email === email.toLowerCase().trim());
  if (!found) throw new Error("Invalid email or password");
  if (found.password !== password) throw new Error("Invalid email or password");

  const session: SessionUser = {
    id: found.id,
    name: found.name,
    email: found.email,
    role: found.role,
    createdAt: found.createdAt,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession(): SessionUser | null {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function deleteAccount(userId: string, password: string) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === userId);
  if (idx === -1) throw new Error("Account not found");

  if (users[idx].password !== password) {
    throw new Error("Incorrect password");
  }

  users.splice(idx, 1);
  writeUsers(users);

  // destroy session if the deleted user was logged in
  const s = getSession();
  if (s?.id === userId) logoutUser();
}
