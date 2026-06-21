"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithGoogle,
  loginWithEmail,
  registerWithEmail,
} from "../lib/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailLogin = async () => {
    try {
      await loginWithEmail(email, password);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Thapello AI Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={handleEmailLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>

      <hr />

      <button onClick={handleGoogle}>Sign in with Google</button>
    </div>
  );
}