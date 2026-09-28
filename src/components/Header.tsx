import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

type HeaderProps = {
  variant?: "full" | "minimal";
};

export default function Header({ variant = "full" }: HeaderProps) {
  const [initial, setInitial] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.email) {
          setInitial(user.email.charAt(0).toUpperCase());
        }
      } catch {
        // ignore
      }
    }
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [menuOpen]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth");
  }

  function handleChangeLanguages() {
    setMenuOpen(false);
    navigate("/onboarding");
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Delete your account permanently? This cannot be undone."
    );
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:4000/users/me", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    } catch {
      alert("Could not delete account. Try again.");
    }
  }

  return (
    <header className="flex items-center justify-between px-6 py-4">
       {initial ? (
  <div className="flex items-center">
    <img src="/src/assets/PIE.svg" alt="PIE" className="h-6" />
  </div>
) : (
  <Link to="/" className="flex items-center">
    <img src="/src/assets/PIE.svg" alt="PIE" className="h-6" />
  </Link>
)}

      {variant === "full" && (
        <nav className="flex gap-6">
          <NavLink
            to="/library"
            className={({ isActive }) =>
              `text-h4 ${isActive ? "underline underline-offset-4" : "text-ink-50"}`
            }
          >
            Library
          </NavLink>
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `text-h4 ${isActive ? "underline underline-offset-4" : "text-ink-50"}`
            }
          >
            Search
          </NavLink>
        </nav>
      )}

      {variant === "full" ? (
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-10 h-10 rounded-full bg-ink-100 text-white flex items-center justify-center text-h4 hover:bg-ink-80"
          >
            {initial || "?"}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl border border-ink-10 shadow-lg py-2 z-50">
              <button
                onClick={handleChangeLanguages}
                className="w-full text-left px-4 py-2 text-body-md hover:bg-ink-5"
              >
                Change my languages
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-body-md hover:bg-ink-5"
              >
                Log out
              </button>
              <div className="border-t border-ink-10 my-1" />
              <button
                onClick={handleDeleteAccount}
                className="w-full text-left px-4 py-2 text-body-md text-tomato-100 hover:bg-ink-5"
              >
                Delete account
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-10 h-10" />
      )}
    </header>
  );
}