import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

type Language = "English" | "German" | "Spanish" | "Hindi" | "Thai";

type Cognate = {
  language: Language;
  word: string;
  relationship: "inherited" | "borrowed" | "unrelated";
  note: string;
};

type Root = {
  _id: string;
  root: string;
  reconstructedMeaning: string;
  cognates: Cognate[];
  isCurated: boolean;
};

const LANGUAGE_BG: Record<Language, string> = {
  English: "bg-lavender-30",
  Hindi: "bg-mint-30",
  Thai: "bg-gold-30",
  German: "bg-tomato-30",
  Spanish: "bg-blue-30",
};

function FlipCard({ root, language }: { root: Root; language: Language }) {
  const [flipped, setFlipped] = useState(false);
  const cognate = root.cognates.find((c) => c.language === language);
  const bg = LANGUAGE_BG[language];

  return (
    <div
      onClick={() => setFlipped(!flipped)}
      className="cursor-pointer aspect-5/6 perspective:[1000px]"
    >
      <div
        className={`relative w-full h-full transition-transform duration-600 ease-out [transform-style:preserve-3d] ${
  flipped ? "[transform:rotateY(180deg)_scale(1.02)]" : "[transform:rotateY(0)_scale(1)]"
}`}
      >
        {/* Front */}
        <div
          className={`absolute inset-0 ${bg} rounded-3xl p-6 [backface-visibility:hidden]`}
        >
          <div className="bg-white rounded-2xl w-full h-full flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-h3">{root.root}</h2>
            <p className="text-body-md text-ink-80 mt-6">"{root.reconstructedMeaning}"</p>
          </div>
        </div>

        {/* Back */}
        <div
          className={`absolute inset-0 ${bg} rounded-3xl p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]`}
        >
          <div className="bg-white rounded-2xl w-full h-full flex flex-col items-center justify-center text-center p-6">
            {cognate ? (
              <>
                <h2 className="text-h3">{cognate.word}</h2>
                <span
                  className={`text-body-sm px-3 py-1 rounded-full mt-4 ${
                    cognate.relationship === "inherited"
                      ? "bg-ink-10"
                      : cognate.relationship === "borrowed"
                      ? "bg-ink-10"
                      : "bg-ink-10"
                  }`}
                >
                  {cognate.relationship}
                </span>
                {cognate.note && (
                  <p className="text-body-sm text-ink-80 mt-3">{cognate.note}</p>
                )}
              </>
            ) : (
              <p className="text-body-md text-ink-80">No {language} cognate</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Set() {
  const { language } = useParams<{ language: Language }>();
  const navigate = useNavigate();
  const [roots, setRoots] = useState<Root[]>([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState("");

  useEffect(() => {
  async function fetchRoots() {
    try {
      const rootsRes = await fetch(`https://pie-flashcards-server.onrender.com/roots?language=${language}`);
      if (!rootsRes.ok) throw new Error("Failed to load");
      const allRoots: Root[] = await rootsRes.json();

      const token = localStorage.getItem("token");
      let savedIds: Set<string> = new globalThis.Set<string>();
      if (token) {
        const userRes = await fetch("https://pie-flashcards-server.onrender.com/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const user = await userRes.json();
          console.log("USER SAVED ROOTS:", user.savedRoots);
          console.log("CURRENT LANGUAGE:", language);
          savedIds = new globalThis.Set(
            user.savedRoots
              .filter((sr: { language: string }) => sr.language === language)
              .map((sr: { root: string | { _id: string } }) =>
                typeof sr.root === "string" ? sr.root : sr.root._id
              )
          );
          console.log("SAVED IDS FOR THIS LANGUAGE:", [...savedIds]);
        }
      }

      const filtered = allRoots.filter(
        (r) => r.isCurated || savedIds.has(r._id)
      );
      console.log("FILTERED ROOTS COUNT:", filtered.length);
      setRoots(filtered);
    } catch {
      setError("Could not load this set.");
    } finally {
      setLoading(false);
    }
  }
  fetchRoots();
}, [language]);

  return (
    <div className="flex-1 flex flex-col pb-4">
      <div className="flex-1 w-full mx-auto flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center md:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-h6 text-ink-50 hover:text-ink-100 mt-8 mb-4"
          >
            ← Back
          </button>
        </div>

        <div className="flex justify-between items-top mb-6 md:mb-8">
          <div>
            <h1 className="text-h1">{language}</h1>
            <p className="text-body-sm text-ink-50 mt-2">
              {roots.length} cards
            </p>
          </div>
          <Link
            to={`/study/${language}`}
            className="btn bg-ink-100 text-white rounded-full h-10 min-h-10 px-8 border-0 hover:bg-ink-80"
          >
            Flashcard mode
          </Link>
        </div>

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 [@media(min-width:1024px)]:grid-cols-3 [@media(min-width:1240px)]:grid-cols-3">
          {roots.map((root) => (
            <FlipCard
              key={root._id}
              root={root}
              language={language as Language}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
