import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

type Language = "English" | "Hindi" | "Thai" | "German" | "Spanish";

type LangMeta = {
  bg: string;
  illustration: string;
  subtext: string;
  imgClass: string;
};

const LANGUAGE_META: Record<Language, LangMeta> = {
  English: {
    bg: "bg-lavender-50",
    illustration: "/src/assets/illustration3.svg",
    subtext: "Over 1 billion speakers. Germanic branch of the Indo-European family.",
    imgClass: "absolute bottom-50 left-1/2 -translate-x-1/2 max-h-84",
  },
  Hindi: {
    bg: "bg-mint-50",
    illustration: "/src/assets/illustration4.svg",
    subtext: "Indo-Aryan branch. Descended from Sanskrit, shares roots with English and Greek.",
    imgClass: "absolute bottom-36 left-1/2 -translate-x-1/2 max-h-64",
  },
  Thai: {
    bg: "bg-gold-50",
    illustration: "/src/assets/illustration5.svg",
    subtext: "Not Indo-European but rich with borrowed words from Sanskrit and Pali.",
    imgClass: "absolute bottom-50 left-1/2 -translate-x-1/2 max-h-64",
  },
  German: {
    bg: "bg-tomato-50",
    illustration: "/src/assets/illustration6.svg",
    subtext: "Germanic branch. English's closest major cousin.",
    imgClass: "absolute bottom-40 left-1/2 -translate-x-1/2 max-h-56",
  },
  Spanish: {
    bg: "bg-blue-50",
    illustration: "/src/assets/illustration7.svg",
    subtext: "Romance branch. Descended from Latin.",
    imgClass: "absolute bottom-40 left-1/2 -translate-x-1/2 max-h-56",
  },
};

type User = {
  _id: string;
  email: string;
  spokenLanguages: Language[];
};

export default function Library() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch("https://pie-flashcards-server.onrender.com/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            navigate("/auth");
            return;
          }
          throw new Error("Failed to fetch user");
        }
        const data = await res.json();
        setUser(data);
      } catch {
        setError("Could not load your library. Is the server running?");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-body-md text-ink-50">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-body-md text-tomato-100">{error}</p>
      </div>
    );
  }

  if (!user || user.spokenLanguages.length === 0) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-12 px-6 text-center">
      <img
        src="/src/assets/illustration1.svg"
        alt=""
        className="max-h-80"
      />
      <div className="flex flex-col gap-2">
        <h2 className="text-h4">Your library is empty</h2>
        <p className="text-body-md text-ink-80">
          Pick your languages to add flashcard sets to your library.
        </p>
      </div>
      <Link
        to="/onboarding"
        className="btn bg-ink-100 text-white rounded-full px-12 border-0 hover:bg-ink-80"
      >
        Pick your languages
      </Link>
    </div>
  );
}

  return (
    <div className=" pb-4 pt-16">
      <div className=" w-full mx-auto flex flex-col">

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-1 [@media(min-width:1240px)]:grid-cols-3">
          {user.spokenLanguages.map((lang) => {
            const meta = LANGUAGE_META[lang];
            return (
              <div
                key={lang}
                onClick={() => navigate(`/sets/${lang}`)}
                className={`${meta.bg} rounded-3xl overflow-hidden flex flex-col relative min-h-105 cursor-pointer hover:scale-[1.01] transition-transform`}
              >
                {/* Illustration */}
                <img
                  src={meta.illustration}
                  alt=""
                  className={meta.imgClass}
                />

                {/* Spacer */}
                <div className="flex-1" />

                {/* White inner card */}
                <div className="relative z-10 bg-white m-3 rounded-2xl p-4 flex flex-col gap-3">
                  <h2 className="text-h4 text-center">{lang}</h2>
                  <p className="text-body-sm text-center text-ink-80">
                    {meta.subtext}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // don't trigger card click
                      navigate(`/study/${lang}`);
                    }}
                    className="btn rounded-full h-10 min-h-10 border-0 bg-ink-100 text-white hover:bg-ink-80"
                  >
                    Flashcard mode
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}