import { useParams } from "react-router-dom";
export default function Card() {
  const { id } = useParams();
  return (
    <div className="flex-1 flex items-center justify-center px-6">
      <h1 className="text-h1">Card: {id}</h1>
    </div>
  );
}