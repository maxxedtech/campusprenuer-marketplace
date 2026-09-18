import { describe, expect, it, beforeEach } from "vitest";
import { getCurrentUser, loginUser, logoutUser, signUpUser } from "@/lib/auth";

describe("local authentication", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("keeps a signed-up user logged in and supports a later login", async () => {
    const created = await signUpUser({ name: "Ada", email: "ADA@example.com", password: "secret123", role: "customer" });
    expect((await getCurrentUser())?.id).toBe(created.id);
    await logoutUser();
    expect(await getCurrentUser()).toBeNull();
    expect((await loginUser("ada@example.com", "secret123")).id).toBe(created.id);
  });

  it("provides a local admin account", async () => {
    const admin = await loginUser("admin@campusprenuer.local", "admin123");
    expect(admin.role).toBe("admin");
  });
});
