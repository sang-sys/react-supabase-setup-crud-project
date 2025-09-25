import React, { useState } from "react";
import { supabase } from "../supabaseClient";

export default function Auth({ session }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert("Check your email for confirmation (if enabled).");
  }

  async function signIn() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) alert(error.message);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="auth">
      {session ? (
        <div>
          <div>
            Signed in as <strong>{session.user.email}</strong>
          </div>
          <button onClick={signOut}>Sign out</button>
        </div>
      ) : (
        <div className="auth-form">
          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ marginTop: 8 }}>
            <button onClick={signIn}>Sign in</button>
            <button onClick={signUp} style={{ marginLeft: 8 }}>
              Sign up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
