export type Role = "entrepreneur" | "customer" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: number;
  business_name?: string;
  business_category?: string;
  phone?: string;
  address?: string;
  campus?: string;
  department?: string;
  hostel?: string;
  room_number?: string;
  landmark?: string;
  bio?: string;
  avatar_url?: string;
  student_id_number?: string;
  id_type?: string;
  id_number?: string;
  id_card_image?: string;
  social_handle?: string;
  bank_name?: string;
  account_number?: string;
  account_name?: string;
  years_in_business?: string;
  verification_status?: VerificationStatus;
  verification_requested_at?: string;
  verified_at?: string;
};

const USERS_KEY = "campusprenuer_users";
export const SESSION_KEY = "campusprenuer_session";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function uid() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getUsers(): UserRecord[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUsers(users: UserRecord[]) {
  if (canUseStorage()) {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
    window.dispatchEvent(new Event("campus-users-change"));
  }
}

export function createUser(user: Omit<UserRecord, "id" | "createdAt">) {
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) throw new Error("This email is already registered.");

  const record: UserRecord = {
    id: uid(),
    createdAt: Date.now(),
    verification_status: "unverified",
    ...user,
  };

  users.push(record);
  saveUsers(users);
  return record;
}

export function findUser(email: string, password: string) {
  const users = getUsers();
  return (
    users.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    ) || null
  );
}

export function getUserById(id: string) {
  return getUsers().find((user) => user.id === id) ?? null;
}

export function updateUser(id: string, updates: Partial<UserRecord>) {
  const users = getUsers();
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) throw new Error("User not found");
  
  users[index] = { ...users[index], ...updates, id: users[index].id };
  saveUsers(users);

  // If the updated user is currently logged in, refresh session data
  const currentSessionId = window.localStorage.getItem(SESSION_KEY);
  if (currentSessionId === id) {
    window.dispatchEvent(new Event("campus-auth-change"));
  }

  return users[index];
}

export function setUserVerification(id: string, status: VerificationStatus) {
  const updates: Partial<UserRecord> = {
    verification_status: status,
    ...(status === "verified" ? { verified_at: new Date().toISOString() } : {}),
  };
  return updateUser(id, updates);
}

export function deleteUser(id: string) {
  saveUsers(getUsers().filter((user) => user.id !== id));
  if (canUseStorage() && window.localStorage.getItem(SESSION_KEY) === id) {
    window.localStorage.removeItem(SESSION_KEY);
    window.dispatchEvent(new Event("campus-auth-change"));
  }
}

export function getSessionUser() {
  if (!canUseStorage()) return null;
  const id = window.localStorage.getItem(SESSION_KEY);
  return id ? getUserById(id) : null;
}

export function setSessionUser(user: UserRecord | null) {
  if (!canUseStorage()) return;
  if (user) window.localStorage.setItem(SESSION_KEY, user.id);
  else window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("campus-auth-change"));
}

// A default local admin and demo accounts
export function ensureLocalAdmin() {
  const users = getUsers();
  let changed = false;

  if (!users.some((user) => user.role === "admin")) {
    users.push({
      id: "local-admin",
      name: "Admin Manager",
      email: "admin@campusprenuer.local",
      password: "admin123",
      role: "admin",
      verification_status: "verified",
      createdAt: Date.now(),
    });
    changed = true;
  }

  if (changed) {
    saveUsers(users);
  }
}
