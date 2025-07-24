import type { Route } from "./+types/_index";
import { Welcome } from "../welcome/welcome";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Briend - Home" },
    { name: "description", content: "Welcome to Briend!" },
  ];
}

export default function Home() {
  return (
    <div>
      <Welcome />
      <div className="flex justify-center mt-8">
        <Link 
          to="/socket" 
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 inline-flex items-center gap-2"
        >
          🚀 Socket Demo 체험하기
        </Link>
      </div>
    </div>
  );
}
