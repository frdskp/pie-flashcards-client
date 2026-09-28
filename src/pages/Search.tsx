import { useEffect, useState } from "react";

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

type SavedRoot = {
  root: string | { _id: string };
  language: Language;
};

type User = {
  spokenLanguages: Language[];
  savedRoots: SavedRoot[];
};

type CardState = "unsaved" | "just-added" | "already-saved";

const LANGUAGE_BG: Record<Language, string> = {
  English: "bg-lavender-30",
  Hindi: "bg-mint-30",
  Thai: "bg-gold-30",
  German: "bg-tomato-30",
  Spanish: "bg-blue-30",
};

const LANGUAGE_DOT: Record<Language, string> = {
  English: "bg-lavender-100",
  Hindi: "bg-mint-100",
  Thai: "bg-gold-100",
  German: "bg-tomato-100",
  Spanish: "bg-blue-100",
};

function ResultCard({
  root,
  spokenLanguages,
  state,
  onAdd,
}: {
  root: Root;
  spokenLanguages: Language[];
  state: CardState;
  onAdd: () => void;
}) {
  const [flipped, setFlipped] = useState(false);

  const bg = LANGUAGE_BG[spokenLanguages[0]] || "bg-lavender-30";

  const shownCognates = spokenLanguages
    .map((lang) => root.cognates.find((c) => c.language === lang))
    .filter((c): c is Cognate => c !== undefined);

  return (
    <div className="flex flex-col gap-3">
      <div
        onClick={() => setFlipped(!flipped)}
        className="cursor-pointer aspect-[5/6] [perspective:1000px]"
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* Front */}
          <div
            className={`absolute inset-0 ${bg} rounded-3xl p-6 [backface-visibility:hidden]`}
          >
            <div className="bg-white rounded-2xl w-full h-full flex flex-col items-center justify-center text-center p-6">
              <h2 className="text-h3">{root.root}</h2>
              <p className="text-body-md text-ink-80 mt-6">
                "{root.reconstructedMeaning}"
              </p>
            </div>
          </div>

          {/* Back */}
          <div
            className={`absolute inset-0 ${bg} rounded-3xl p-6 [backface-visibility:hidden] [transform:rotateY(180deg)]`}
          >
            <div className="bg-white rounded-2xl w-full h-full flex flex-col p-4 overflow-y-auto gap-3">
              {shownCognates.length > 0 ? (
                shownCognates.map((c) => (
                  <div
                    key={c.language}
                    className="flex flex-col gap-1 border-b border-ink-10 pb-2 last:border-b-0"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${LANGUAGE_DOT[c.language]}`}
                      />
                      <span className="text-body-sm text-ink-50">
                        {c.language}
                      </span>
                    </div>
                    <p className="text-body-md font-bold">{c.word}</p>
                    {c.note && (
                      <p className="text-body-sm text-ink-80">{c.note}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-body-md text-ink-80 text-center my-auto">
                  No cognates in your languages
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onAdd}
        disabled={state !== "unsaved"}
        className={`btn rounded-full h-10 min-h-10 border-0 ${
          state === "unsaved"
            ? "bg-ink-100 text-white hover:bg-ink-80"
            : state === "just-added"
              ? "bg-mint-30 text-ink-100 cursor-default"
              : "bg-ink-5 text-ink-50 cursor-default"
        }`}
      >
        {state === "unsaved"
          ? "Add to sets"
          : state === "just-added"
            ? "Added to your sets"
            : "Already in your sets"}
      </button>
    </div>
  );
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [roots, setRoots] = useState<Root[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [initiallySavedIds, setInitiallySavedIds] = useState<Set<string>>(
    new Set(),
  );
  const [justAddedIds, setJustAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchAll() {
      try {
        const rootsRes = await fetch("http://localhost:4000/roots");
        const rootsData = await rootsRes.json();
        setRoots(rootsData);

        const token = localStorage.getItem("token");
        if (token) {
          const userRes = await fetch("http://localhost:4000/users/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            setUser(userData);

            const savedIds = new Set<string>(
              userData.savedRoots.map((sr: SavedRoot) =>
                typeof sr.root === "string" ? sr.root : sr.root._id,
              ),
            );
            setInitiallySavedIds(savedIds);
          }
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  async function handleAddToSets(rootId: string) {
    if (!user) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await Promise.all(
        user.spokenLanguages.map((lang) =>
          fetch(`http://localhost:4000/users/me/save/${rootId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ language: lang }),
          }),
        ),
      );
      setJustAddedIds((prev) => new Set(prev).add(rootId));
    } catch {
      // silent
    }
  }

  function getCardState(root: Root): CardState {
    if (justAddedIds.has(root._id)) return "just-added";
    if (initiallySavedIds.has(root._id)) return "already-saved";
    if (root.isCurated && user && user.spokenLanguages.length > 0)
      return "already-saved";
    return "unsaved";
  }

  const q = query.trim().toLowerCase();
 const filtered = q
  ? roots
      .filter((r) => {
        if (r.root.toLowerCase().includes(q)) return true;
        if (r.reconstructedMeaning.toLowerCase().includes(q)) return true;
        return r.cognates.some(
          (c) => c.word.toLowerCase().includes(q) || c.note.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const aSaved = initiallySavedIds.has(a._id) || a.isCurated;
        const bSaved = initiallySavedIds.has(b._id) || b.isCurated;
        if (aSaved === bSaved) return 0;
        return aSaved ? 1 : -1; // unsaved first
      })
  : [];

  return (
    <div className="flex-1 flex flex-col pb-4">
      <div className="flex-1 w-full mx-auto flex flex-col">
        {/* Search input + helper (centered, capped) */}
        <div className="w-full max-w-4xl mx-auto mb-6 mt-16">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roots, meanings, or words..."
            className="input w-full rounded-full text-body-md h-14 px-6 bg-white border border-ink-30 focus:border-ink-100 focus:outline-none"
            autoFocus
          />
          {user && user.spokenLanguages.length > 0 && (
            <p className="text-body-sm text-center text-ink-50 mt-2 mb-16 px-6">
              Adding a root will add the flashcard to all your sets:{" "}
              {user.spokenLanguages.join(", ")}.
            </p>
          )}
        </div>

        {/* Results / states */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-body-md text-ink-50">Loading...</p>
          </div>
        ) : !q ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <img
              src="/src/assets/illustration1.svg"
              alt=""
              className="max-h-120"
            />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
            <img
              src="/src/assets/illustration1.svg"
              alt=""
              className="max-h-120"
            />
            <h3 className="text-h4">No results for "{query}"</h3>
            <p className="text-body-md text-ink-80">
              Try a different root, meaning, or word.
            </p>
          </div>
        ) : (
          <>
            <p className="text-h4 text-center mb-4">
              {filtered.length} result{filtered.length === 1 ? "" : "s"} for "
              {query}"
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 [@media(min-width:1024px)]:grid-cols-3 [@media(min-width:1240px)]:grid-cols-3">
              {filtered.map((root) => (
                <ResultCard
                  key={root._id}
                  root={root}
                  spokenLanguages={user?.spokenLanguages || []}
                  state={getCardState(root)}
                  onAdd={() => handleAddToSets(root._id)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
