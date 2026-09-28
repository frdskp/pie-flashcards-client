import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Library from "./pages/Library";
import Set from "./pages/Set";
import Search from "./pages/Search";
import FlashcardMode from "./pages/FlashcardMode";

function App() {
  return (
    <Routes>
      {/* Public — minimal header */}
      <Route element={<Layout headerVariant="minimal" />}>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Route>

      {/* Authenticated */}
      <Route element={<Layout headerVariant="full" />}>
        <Route path="/library" element={<Library />} />
        <Route path="/sets/:language" element={<Set />} />
        <Route path="/search" element={<Search />} />
        <Route path="/study/:language" element={<FlashcardMode />} />
      </Route>
    </Routes>
  );
}

export default App;