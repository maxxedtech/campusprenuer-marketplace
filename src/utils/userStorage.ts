export type Role = "entrepreneur" | "customer" | "admin";

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  password: string; // local-only; later you'll remove this with real backend
  role: Role;
  createdAt: number;
};

const USERS_KEY = "campusprenuer_users";

export function getUsers(): UserRecord[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveUsers(users: UserRecord[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function createUser(user: Omit<UserRecord, "id" | "createdAt">) {
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (exists) throw new Error("This email is already registered.");

  const record: UserRecord = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: Date.now(),
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
