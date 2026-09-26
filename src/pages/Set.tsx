import { useParams } from "react-router-dom";
import Header from "../components/Header";
export default function Set() {
  const { language } = useParams();
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-6">
        <h1 className="text-h1">Set: {language}</h1>
      </main>
    </div>
  );
}