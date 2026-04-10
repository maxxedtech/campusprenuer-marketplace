import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/lib/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "entrepreneur") navigate("/dashboard/entrepreneur");
      else navigate("/marketplace");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="p-6 space-y-3">
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e)=>setPassword(e.target.value)} />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
