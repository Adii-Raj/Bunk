import React, { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [message, setMessage] = useState("");

  async function handleAuth(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      let data, error;
      if (mode === "signup") {
        ({ data, error } = await supabase.auth.signUp({
          email,
          password,
        }));
        if (!error) {
          setMessage("Signup successful! Check your email to confirm.");
        }
      } else {
        ({ data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        }));
        if (!error) {
          setMessage("Login successful!");
        }
      }

      if (error) throw error;
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </h1>

        {message && (
          <div className="mb-4 p-3 text-sm text-white bg-blue-500 rounded">
            {message}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          {mode === "login" ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() =>
              setMode(mode === "login" ? "signup" : "login")
            }
            className="text-blue-600 hover:underline font-medium"
          >
            {mode === "login" ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
