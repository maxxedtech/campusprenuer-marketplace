import {
  createUser,
  ensureLocalAdmin,
  findUser,
  getSessionUser,
  setSessionUser,
  type UserRecord,
} from "@/utils/userStorage";

export type SignupData = Omit<UserRecord, "id" | "createdAt">;

export async function signUpUser(data: SignupData) {
  ensureLocalAdmin();
  if (!data.name.trim()) throw new Error("Please enter your name.");
  if (data.password.length < 6) throw new Error("Password must be at least 6 characters.");
  const user = createUser({ ...data, email: data.email.trim().toLowerCase() });
  setSessionUser(user);
  return user;
}

export async function loginUser(email: string, password: string) {
  ensureLocalAdmin();
  const user = findUser(email.trim(), password);
  if (!user) throw new Error("Invalid email or password.");
  setSessionUser(user);
  return user;
}

export async function getCurrentUser() {
  ensureLocalAdmin();
  return getSessionUser();
}

export async function logoutUser() {
  setSessionUser(null);
}
