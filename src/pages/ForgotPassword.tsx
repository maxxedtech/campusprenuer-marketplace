import { useState } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "@/utils/userStorage";

export default function ForgotPassword() {
  const [email, setEmail] = useState(""); const [message, setMessage] = useState("");
  const handleSubmit = (event: React.FormEvent) => { event.preventDefault(); const normalized = email.trim().toLowerCase(); const exists = getUsers().some((user) => user.email === normalized); setMessage(exists ? "Use the reset page to choose a new password." : "No local account found for that email."); localStorage.setItem("campusprenuer_reset_email", normalized); };
  return <div className="min-h-screen flex items-center justify-center"><div className="w-full max-w-sm"><h1 className="text-xl font-bold mb-6">Forgot Password</h1><form onSubmit={handleSubmit} className="space-y-4"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full border p-2 rounded" placeholder="Email" /><button className="w-full bg-black text-white py-2 rounded">Continue</button>{message && <p className="text-sm text-center">{message}</p>}<Link className="block text-center underline text-sm" to="/reset-password">Reset password</Link></form></div></div>;
}
