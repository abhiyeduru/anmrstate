import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr("");
    // client-side validation to avoid empty requests leading to 400 from Firebase
    if (!form.email || !form.password) {
      setErr("Email and password are required");
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      nav("/admin");
    } catch (e) {
      // show more detailed feedback for debugging (kept user-friendly)
      setErr(e?.code ? `Auth error: ${e.code}` : "Invalid credentials");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h3 className="font-bold mb-4">Admin Login</h3>
      <form onSubmit={submit} className="space-y-3">
        <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="Email" className="w-full p-2 border rounded" />
        <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Password" className="w-full p-2 border rounded" />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Sign in</button>
        </div>
      </form>
    </div>
  );
}
