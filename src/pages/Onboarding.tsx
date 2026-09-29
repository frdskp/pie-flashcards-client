import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type Language = "English" | "Hindi" | "Thai" | "German" | "Spanish";

const LANGUAGES: {
  name: Language;
  bg: string;
  illustration: string;
  subtext: string;
  imgClass: string; // per-card positioning
}[] = [
  {
    name: "English",
    bg: "bg-lavender-50",
    illustration: "/src/assets/illustration3.svg",
    subtext: "Germanic branch of the Indo-European family.",
    imgClass: "absolute bottom-50 inset-x-0 mx-auto max-h-56 w-auto",
  },
  {
    name: "Hindi",
    bg: "bg-mint-50",
    illustration: "/src/assets/illustration4.svg",
    subtext: "Descended from Sanskrit, shares roots with English and Greek.",
    imgClass: "absolute bottom-44 inset-x-0 mx-auto max-h-64 w-auto",
  },
  {
    name: "Thai",
    bg: "bg-gold-50",
    illustration: "/src/assets/illustration5.svg",
    subtext: "Rich with borrowed words from Sanskrit and Pali.",
    imgClass: "absolute bottom-50 inset-x-0 mx-auto max-h-60 w-auto",
  },
  {
    name: "German",
    bg: "bg-tomato-50",
    illustration: "/src/assets/illustration6.svg",
    subtext: "Germanic branch. English's closest major cousin.",
    imgClass: "absolute bottom-48 inset-x-0 mx-auto max-h-56 w-auto",
  },
  {
    name: "Spanish",
    bg: "bg-blue-50",
    illustration: "/src/assets/illustration7.svg",
    subtext: "Romance branch. Descended from Latin.",
    imgClass: "absolute bottom-48 inset-x-0 mx-auto max-h-56 w-auto",
  },
];

export default function Onboarding() {
  const [selected, setSelected] = useState<Language[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const [existingLanguages, setExistingLanguages] = useState<Language[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("https://pie-flashcards-server.onrender.com/users/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((user) => {
        if (user?.spokenLanguages) {
          setExistingLanguages(user.spokenLanguages);
        }
      });
  }, []);

  function toggle(lang: Language) {
    setSelected((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }

  async function handleContinue() {
    if (selected.length === 0 && existingLanguages.length === 0) {
      navigate("/library");
      return;
    }
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      // Merge existing + new picks
      const merged = Array.from(
        new globalThis.Set([...existingLanguages, ...selected]),
      );
      await fetch("https://pie-flashcards-server.onrender.com/users/me/languages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ languages: merged }),
      });
      navigate("/library");
    } catch {
      setSaving(false);
    }
  }

  function handleSkip() {
    navigate("/library");
  }

  return (
    <div className="flex-1 flex flex-col pb-4">
      <div className="flex-1 w-full mx-auto flex flex-col">
        {/* Title bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 mt-12">
          <h1 className="text-h2 md:text-h1">Pick your languages</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSkip}
              className="text-body-lg md:text-h6 text-ink-50 hover:text-ink-100"
            >
              Skip
            </button>
            <button
              onClick={handleContinue}
              className="text-body-lg md:text-h6 text-ink-100 hover:text-ink-80"
            >
              Continue
            </button>
          </div>
        </div>

        {/* Cards — horizontal swipe on mobile, grid on desktop */}
        <div className="flex md:grid md:grid-cols-2 h-[64vh] [@media(min-width:1240px)]:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none -mx-4 md:mx-0 px-4 md:px-0">
          {LANGUAGES.map((lang) => {
            const isSelected = selected.includes(lang.name);
            const isAlreadyAdded = existingLanguages.includes(lang.name);
            return (
              <div
                key={lang.name}
                className={`${lang.bg} rounded-3xl overflow-hidden flex flex-col relative snap-center shrink-0 w-[85vw] md:w-auto md:shrink md:min-h-[420px]`}
              >
                <img src={lang.illustration} alt="" className={lang.imgClass} />
                <div className="flex-1" />
                <div className="relative z-10 bg-white m-3 rounded-2xl p-4 flex flex-col gap-3">
                  <h2 className="text-h4 text-center">{lang.name}</h2>
                  <p className="text-body-sm text-center text-ink-80">
                    {lang.subtext}
                  </p>
                  <button
                    onClick={() => !isAlreadyAdded && toggle(lang.name)}
                    disabled={isAlreadyAdded}
                    className={`btn rounded-full h-10 min-h-10 border-0 ${
                      isAlreadyAdded
                        ? "bg-ink-5 text-ink-50 cursor-default"
                        : isSelected
                          ? "bg-white text-ink-100 border-2 border-ink-100"
                          : "bg-ink-100 text-white hover:bg-ink-80"
                    }`}
                  >
                    {isAlreadyAdded
                      ? "In your library"
                      : isSelected
                        ? "✓ Added"
                        : "Add to my library"}
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
