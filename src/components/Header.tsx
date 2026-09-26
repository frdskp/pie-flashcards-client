import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <Link to="/" className="text-h4 italic" style={{ fontFamily: "cursive" }}>
        PIE
      </Link>
      <div className="w-10 h-10 rounded-full bg-ink-100 text-white flex items-center justify-center text-body-md">
        F
      </div>
    </header>
  );
}