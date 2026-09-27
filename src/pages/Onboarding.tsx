import { useState } from "react";
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
    subtext:
      "Germanic branch of the Indo-European family.",
    imgClass: "absolute bottom-54 inset-x-0 mx-auto max-h-56 w-auto",
  },
  {
    name: "Hindi",
    bg: "bg-mint-50",
    illustration: "/src/assets/illustration4.svg",
    subtext: "Descended from Sanskrit, shares roots with English and Greek.",
    imgClass: "absolute bottom-48 inset-x-0 mx-auto max-h-64 w-auto",
  },
  {
    name: "Thai",
    bg: "bg-gold-50",
    illustration: "/src/assets/illustration5.svg",
    subtext: "Rich with borrowed words from Sanskrit and Pali.",
    imgClass: "absolute bottom-56 inset-x-0 mx-auto max-h-60 w-auto",
  },
  {
    name: "German",
    bg: "bg-tomato-50",
    illustration: "/src/assets/illustration6.svg",
    subtext: "Germanic branch. English's closest major cousin.",
    imgClass: "absolute bottom-54 inset-x-0 mx-auto max-h-56 w-auto",
  },
  {
    name: "Spanish",
    bg: "bg-blue-50",
    illustration: "/src/assets/illustration7.svg",
    subtext: "Romance branch. Descended from Latin.",
    imgClass: "absolute bottom-54 inset-x-0 mx-auto max-h-56 w-auto",
  },
];

export default function Onboarding() {
  const [selected, setSelected] = useState<Language[]>([]);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  function toggle(lang: Language) {
    setSelected((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  }

  async function handleContinue() {
    if (selected.length === 0) {
      navigate("/library");
      return;
    }
    setSaving(true);
    const token = localStorage.getItem("token");
    try {
      await fetch("http://localhost:4000/users/me/languages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ languages: selected }),
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
        <div className="flex items-center justify-between mb-6 md:mb-8 min-h-45">
          <h1 className="text-h2 md:text-h1">Pick your languages</h1>
          <div className="flex items-center gap-6">
            <button
              onClick={handleSkip}
              className="text-h5 text-ink-50 hover:text-ink-80"
            >
              Skip
            </button>
            <button
              onClick={handleContinue}
              disabled={saving}
              className="text-h5 text-ink-100 hover:text-ink-80 disabled:opacity-50"
            >
              {saving ? "..." : "Continue"}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 flex-1 [@media(min-width:1240px)]:grid-cols-5">
          {LANGUAGES.map((lang) => {
            const isSelected = selected.includes(lang.name);
            return (
              <div
                key={lang.name}
                className={`${lang.bg} rounded-3xl overflow-hidden flex flex-col relative min-h-[420px]`}
              >
                {/* Illustration — absolutely positioned, can go behind text card */}
                <img
                  src={lang.illustration}
                  alt=""
                  className={`absolute ${lang.imgClass}`}
                />

                {/* Spacer to push text card to bottom */}
                <div className="flex-1" />

                {/* White inner card — sits on top */}
                <div className="relative z-10 bg-white m-3 rounded-2xl p-4 flex flex-col gap-3">
                  <h2 className="text-h4 text-center">{lang.name}</h2>
                  <p className="text-body-sm text-center text-ink-80">
                    {lang.subtext}
                  </p>
                  <button
                    onClick={() => toggle(lang.name)}
                    className={`btn rounded-full h-10 min-h-10 border-0 ${
                      isSelected
                        ? "bg-white text-ink-100 border-2 border-ink-100"
                        : "bg-ink-100 text-white hover:bg-ink-80"
                    }`}
                  >
                    {isSelected ? "✓ Added" : "Add to my library"}
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
