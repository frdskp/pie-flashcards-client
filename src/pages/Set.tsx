import { useParams } from "react-router-dom";
export default function Set() {
  const { language } = useParams();
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <h1 className="text-h1">Set: {language}</h1>
    </div>
  );
}