// src/pages/Login.tsx

import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword
} from "firebase/auth";

import { auth, googleProvider, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔥 REGISTER (THIS WAS MISSING)
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: "New User",
        role: "customer",
        provider: "email",
        createdAt: Date.now(),
      });

      alert("User registered successfully!");
    } catch (err: any) {
      alert("Register failed: " + err.message);
    }
  };

  // 🔥 LOGIN
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate("/");
    } catch (err: any) {
      alert("Login failed: " + err.message);
    }
  };

  // 🔥 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // save user to firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || "User",
        role: "customer",
        provider: "google",
        createdAt: Date.now(),
      });

      alert("Google login successful!");
      navigate("/");
    } catch (err: any) {
      alert("Google login failed: " + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl mb-4 font-bold">Login / Register</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 rounded w-64"
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 rounded w-64"
      />

      {/* LOGIN */}
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-2 w-64"
      >
        Login
      </button>

      {/* REGISTER */}
      <button
        onClick={handleRegister}
        className="bg-green-500 text-white px-4 py-2 rounded mb-2 w-64"
      >
        Register
      </button>

      {/* GOOGLE */}
      <button
        onClick={handleGoogleLogin}
        className="bg-red-500 text-white px-4 py-2 rounded w-64"
      >
        Login with Google
      </button>
    </div>
  );
}
