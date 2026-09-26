import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Mode = "signup" | "signin";

export default function Auth() {
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:4000/auth/${mode === "signup" ? "register" : "login"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong");
        setLoading(false);
        return;
      }

      // Save token + user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Route: new signup → onboarding, existing login → library
      navigate(mode === "signup" ? "/onboarding" : "/library");
    } catch {
      setError("Could not reach server. Is it running?");
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col pb-4">
      <div className="flex-1 w-full mx-auto bg-ink-5 rounded-3xl px-6 md:px-12 py-8 md:py-16 flex flex-col items-center justify-center">

        {/* Illustration */}
        <img
          src="/src/assets/illustration8.svg"
          alt=""
          className="w-48 md:w-64 mb-8"
        />

        {/* Tabs */}
        <div className="flex gap-6 mb-8">
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`text-h2 ${mode === "signup" ? "text-ink-100" : "text-ink-30"}`}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`text-h2 ${mode === "signin" ? "text-ink-100" : "text-ink-30"}`}
          >
            Sign in
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full rounded-full text-body-md px-6 bg-white border-ink-30"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="input input-bordered w-full rounded-full text-body-md px-6 bg-white border-ink-30"
          />

          {error && (
            <p className="text-body-sm text-tomato-100 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn bg-ink-100 text-white rounded-full hover:bg-ink-80 border-0 mt-4 text-body-md"
          >
            {loading ? "..." : mode === "signup" ? "Sign up" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}