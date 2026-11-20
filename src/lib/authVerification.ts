export const PENDING_EMAIL_VERIFICATION_KEY = "campuspreneur_pending_email_verification";

export function markEmailVerificationPending() {
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(PENDING_EMAIL_VERIFICATION_KEY, "true");
  }
}

export function isEmailVerificationPending() {
  return typeof window !== "undefined"
    && window.sessionStorage.getItem(PENDING_EMAIL_VERIFICATION_KEY) === "true";
}

export function clearEmailVerificationPending() {
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(PENDING_EMAIL_VERIFICATION_KEY);
  }
}

export function hasAuthCallbackParams() {
  if (typeof window === "undefined") return false;

  const search = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  return Boolean(
    search.get("code")
      || hash.get("access_token")
      || hash.get("refresh_token")
      || hash.get("type") === "signup",
  );
}

export function cleanAuthCallbackUrl() {
  if (typeof window === "undefined") return;

  window.history.replaceState(
    {},
    document.title,
    `${window.location.origin}${window.location.pathname}`,
  );
}
