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

function CardFace({
  root,
  cognate,
  bg,
  flipped,
  language,
  onClick,
}: {
  root: Root;
  cognate?: Cognate;
  bg: string;
  flipped: boolean;
  language: Language;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`w-full h-full [perspective:1000px] ${onClick ? "cursor-pointer" : ""}`}
    >
      <div
        className={`relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className={`absolute inset-0 ${bg} rounded-3xl p-6 [backface-visibility:hidden]`}>
          <div className="bg-white rounded-2xl w-full h-full flex flex-col items-center justify-center text-center p-6">
            <h2 className="text-h3">{root.root}</h2>
            <p className="text-body-md text-ink-80 mt-6">"{root.reconstructedMeaning}"</p>
          </div>
        </div>
        {/* Back */}
        <div className={`absolute inset-0 ${bg} rounded-3xl p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]`}>
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

export default function FlashcardMode() {
  const { language } = useParams<{ language: Language }>();

  const [roots, setRoots] = useState<Root[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [sliding, setSliding] = useState(false);
  const [knew, setKnew] = useState(0);
  const [didntKnow, setDidntKnow] = useState(0);
  const [complete, setComplete] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
  async function fetchRoots() {
    try {
      const rootsRes = await fetch(`http://localhost:4000/roots?language=${language}`);
      if (!rootsRes.ok) throw new Error("Failed to load");
      const allRoots: Root[] = await rootsRes.json();

      const token = localStorage.getItem("token");
      let savedIds: Set<string> = new globalThis.Set<string>();
      if (token) {
        const userRes = await fetch("http://localhost:4000/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (userRes.ok) {
          const user = await userRes.json();
          savedIds = new globalThis.Set(
            user.savedRoots
              .filter((sr: { language: string }) => sr.language === language)
              .map((sr: { root: string | { _id: string } }) =>
                typeof sr.root === "string" ? sr.root : sr.root._id
              )
          );
        }
      }

      const inSet = allRoots.filter((r) => r.isCurated || savedIds.has(r._id));
      setRoots(inSet.sort(() => Math.random() - 0.5));
    } catch {
      setError("Could not load flashcards.");
    } finally {
      setLoading(false);
    }
  }
  fetchRoots();
}, [language]);

  function handleAnswer(correct: boolean) {
    if (sliding) return;
    if (correct) setKnew((n) => n + 1);
    else setDidntKnow((n) => n + 1);

    setSliding(true);
    setTimeout(() => {
      if (currentIndex + 1 >= roots.length) {
        setComplete(true);
      } else {
        setCurrentIndex((i) => i + 1);
        setFlipped(false);
      }
      setSliding(false);
    }, 350);
  }

  function restart() {
    setCurrentIndex(0);
    setKnew(0);
    setDidntKnow(0);
    setComplete(false);
    setFlipped(false);
    setRoots((prev) => [...prev].sort(() => Math.random() - 0.5));
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-body-md text-ink-50">Loading...</p>
      </div>
    );
  }

  if (error || roots.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-body-md text-tomato-100">{error || "No cards for this set."}</p>
        <Link to="/library" className="btn bg-ink-100 text-white rounded-full h-10 min-h-10 px-8 border-0 hover:bg-ink-80">
          Back to library
        </Link>
      </div>
    );
  }

  if (complete) {
  return (
    <div className="flex-1 flex flex-col pb-4">
      <div className="flex-1 w-full mx-auto bg-ink-5 rounded-3xl p-8 md:p-16 flex flex-col items-center justify-center text-center gap-6">
        <img src="/src/assets/illustration2.svg" alt="" className="max-h-64" />
        <div className="flex flex-col gap-2">
          <h2 className="text-h2 pb-12">Congratulations!</h2>
          <p className="text-body-md text-ink-80">Here's your stats:</p>
        </div>
        <div className="flex gap-16 pb-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-tomato-100 text-white flex items-center justify-center text-h4">
              ✕
            </div>
            <p className="text-h4 text-tomato-100">{didntKnow}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-mint-100 text-white flex items-center justify-center text-h4">
              ✓
            </div>
            <p className="text-h4 text-mint-100">{knew}</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-md">
          <button
            onClick={restart}
            className="btn bg-ink-100 text-white rounded-full border-0 hover:bg-ink-80 w-full"
          >
            Study again
          </button>
          <Link
            to="/library"
            className="btn bg-white text-ink-100 rounded-full border-ink-100 border hover:bg-ink-5 w-full"
          >
            Back to library
          </Link>
        </div>
      </div>
    </div>
  );
}

  const currentRoot = roots[currentIndex];
  const cognate = currentRoot.cognates.find((c) => c.language === language);
  const bg = LANGUAGE_BG[language as Language];

  const nextRoot = roots[currentIndex + 1];
  const nextCognate = nextRoot?.cognates.find((c) => c.language === language);

  return (
    <div className="flex-1 flex flex-col pb-4">
      <div className="flex-1 w-full mx-auto flex flex-col">

        {/* Top bar */}
        <div className="grid grid-cols-5 items-center gap-6 mb-8 mt-16">
  <h2 className="text-h4 col-span-1">{language}</h2>
  <div className="col-span-3 flex gap-1 items-center">
    {roots.map((_, i) => (
      <div
        key={i}
        className={`h-1.5 flex-1 rounded-full transition-colors ${
          i < currentIndex ? "bg-ink-100" : "bg-ink-10"
        }`}
      />
    ))}
  </div>
  <button
  onClick={() => navigate(-1)}
  className="col-span-1 text-h6 text-ink-50 hover:text-ink-100 text-right whitespace-nowrap"
>
  Exit flashcard mode
</button>
</div>

        {/* Cards — outgoing slides left, incoming slides in from right */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden">
          <div className="relative aspect-[5/6] max-h-[500px] w-full" style={{ maxWidth: "400px" }}>

            {/* Outgoing card (only during slide) */}
            {sliding && (
              <div className="absolute inset-0 animate-slide-out-left pointer-events-none">
                <CardFace
                  root={currentRoot}
                  cognate={cognate}
                  bg={bg}
                  flipped={flipped}
                  language={language as Language}
                />
              </div>
            )}

            {/* Incoming / current card */}
            {sliding && nextRoot ? (
              <div key={`incoming-${currentIndex + 1}`} className="absolute inset-0 animate-slide-in-right">
                <CardFace
                  root={nextRoot}
                  cognate={nextCognate}
                  bg={bg}
                  flipped={false}
                  language={language as Language}
                />
              </div>
            ) : !sliding ? (
              <div key={`current-${currentIndex}`} className="absolute inset-0">
                <CardFace
                  root={currentRoot}
                  cognate={cognate}
                  bg={bg}
                  flipped={flipped}
                  language={language as Language}
                  onClick={() => setFlipped(!flipped)}
                />
              </div>
            ) : null}

          </div>
        </div>

        {/* Answer buttons */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleAnswer(false)}
              disabled={sliding}
              className="w-14 h-14 rounded-2xl bg-tomato-100 text-white flex items-center justify-center text-h3 hover:bg-tomato-50 transition-colors disabled:opacity-50"
            >
              ✕
            </button>
            <p className="text-body-sm text-tomato-100">{didntKnow}</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => handleAnswer(true)}
              disabled={sliding}
              className="w-14 h-14 rounded-2xl bg-mint-100 text-white flex items-center justify-center text-h3 hover:bg-mint-50 transition-colors disabled:opacity-50"
            >
              ✓
            </button>
            <p className="text-body-sm text-mint-100">{knew}</p>
          </div>
        </div>

      </div>
    </div>
  );
}