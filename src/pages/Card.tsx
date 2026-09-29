import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";

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
  English: "bg-lavender-50",
  Hindi: "bg-mint-50",
  Thai: "bg-gold-50",
  German: "bg-tomato-50",
  Spanish: "bg-blue-50",
};

export default function Card() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const language = (searchParams.get("lang") || "English") as Language;
  const navigate = useNavigate();

  const [root, setRoot] = useState<Root | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    async function fetchRoot() {
      try {
        const res = await fetch(`https://pie-flashcards-server.onrender.com/roots/${id}`);
        if (!res.ok) throw new Error("Root not found");
        const data = await res.json();
        setRoot(data);
      } catch {
        setError("Could not load this card.");
      } finally {
        setLoading(false);
      }
    }
    fetchRoot();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-body-md text-ink-50">Loading...</p>
      </div>
    );
  }

  if (error || !root) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <p className="text-body-md text-tomato-100">{error}</p>
        <Link to="/library" className="btn bg-ink-100 text-white rounded-full h-10 min-h-10 px-8 border-0 hover:bg-ink-80">
          Back to library
        </Link>
      </div>
    );
  }

  const cognate = root.cognates.find((c) => c.language === language);
  const bg = LANGUAGE_BG[language];

  return (
    <div className="flex-1 flex flex-col pb-4">
      <div className="flex-1 w-full max-w-4xl mx-auto flex flex-col">

        {/* Back link */}
        <button
          onClick={() => navigate(-1)}
          className="self-start text-h6 text-ink-50 hover:text-ink-100 mb-6"
        >
          ← Back
        </button>

        {/* Flashcard */}
        <div
          onClick={() => setFlipped(!flipped)}
          className={`flex-1 ${bg} rounded-3xl flex flex-col items-center justify-center p-8 md:p-16 cursor-pointer transition-transform hover:scale-[1.005] min-h-[500px]`}
        >
          {!flipped ? (
            // Front — PIE root + reconstructed meaning
            <div className="text-center flex flex-col items-center gap-6">
              <p className="text-body-sm text-ink-50 uppercase tracking-widest">
                Proto-Indo European
              </p>
              <h1 className="text-h1 md:text-[64px] md:leading-tight">{root.root}</h1>
              <p className="text-body-lg text-ink-80 italic">
                reconstructed: "{root.reconstructedMeaning}"
              </p>
              <p className="text-body-sm text-ink-50 mt-8">Tap to reveal {language}</p>
            </div>
          ) : (
            // Back — Language + cognate + note
            <div className="text-center flex flex-col items-center gap-6">
              <p className="text-body-sm text-ink-50 uppercase tracking-widest">
                {language}
              </p>
              {cognate ? (
                <>
                  <h1 className="text-h1 md:text-[64px] md:leading-tight">{cognate.word}</h1>
                  <span
                    className={`text-body-sm px-4 py-1 rounded-full ${
                      cognate.relationship === "inherited"
                        ? "bg-mint-30 text-ink-100"
                        : cognate.relationship === "borrowed"
                        ? "bg-gold-30 text-ink-100"
                        : "bg-ink-10 text-ink-80"
                    }`}
                  >
                    {cognate.relationship}
                  </span>
                  {cognate.note && (
                    <p className="text-body-md text-ink-80 max-w-lg">{cognate.note}</p>
                  )}
                </>
              ) : (
                <p className="text-body-md text-ink-80">
                  No {language} cognate for this root.
                </p>
              )}
              <p className="text-body-sm text-ink-50 mt-8">Tap to flip back</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}