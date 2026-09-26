import { Link, NavLink } from "react-router-dom";

type HeaderProps = {
  variant?: "full" | "minimal";
};

export default function Header({ variant = "full" }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link to="/" className="text-h3 italic font-black">
        PIE
      </Link>

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
        <div className="w-10 h-10 rounded-full bg-ink-100 text-white flex items-center justify-center text-h6">
          F
        </div>
      ) : (
        <div className="w-10 h-10" /> // spacer to keep wordmark left-aligned
      )}
    </header>
  );
}