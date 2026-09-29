export default function Footer() {
  return (
    <footer className="px-6 py-6 text-center text-body-sm text-ink-50">
      Etymological data adapted from{" "}
      <a
        href="https://en.wiktionary.org/wiki/Appendix:List_of_Proto-Indo-European_roots"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-ink-100"
      >
        Wikitionary.
      </a>
      {" "} © {new Date().getFullYear()} PIE.
    </footer>
  );
}