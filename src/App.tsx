import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Library from "./pages/Library";
import Set from "./pages/Set";
import Card from "./pages/Card";
import Search from "./pages/Search";
import FlashcardMode from "./pages/FlashcardMode";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/library" element={<Library />} />
      <Route path="/sets/:language" element={<Set />} />
      <Route path="/roots/:id" element={<Card />} />
      <Route path="/search" element={<Search />} />
      <Route path="/study/:language" element={<FlashcardMode />} />
    </Routes>
  );
}

export default App;