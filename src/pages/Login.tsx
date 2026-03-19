// src/pages/Login.tsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../firebase";
import { collection, doc, setDoc, getDocs, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // store user if new
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName || "User",
          role: "customer",
          provider: "email",
          createdAt: Date.now(),
        });
      }
      navigate("/"); // redirect to marketplace or dashboard
    } catch (err) {
      alert("Login failed: " + err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      // store user in Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", user.email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          name: user.displayName || "User",
          role: "customer",
          provider: "google",
          createdAt: Date.now(),
        });
      }
      navigate("/");
    } catch (err) {
      alert("Google login failed: " + err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4">Login</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 rounded"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 rounded"
      />
      <button onClick={handleEmailLogin} className="bg-blue-500 text-white px-4 py-2 rounded mb-2">
        Login
      </button>
      <button onClick={handleGoogleLogin} className="bg-red-500 text-white px-4 py-2 rounded">
        Login with Google
      </button>
    </div>
  );
}
