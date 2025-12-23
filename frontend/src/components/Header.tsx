import { Sparkles, Music } from "lucide-react";

export default function Header() {
  return (
    <header className="text-center mb-14">
      <div className="inline-flex items-center gap-4 mb-5">
        <div className="w-14 h-14 rounded-2xl bg-[#3A2A23] flex items-center justify-center shadow-lg">
          <Music className="w-7 h-7 text-white" />
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Music Recommendation
        </h1>
      </div>

      <div className="flex justify-center items-center gap-2 text-gray-600">
        <Sparkles className="w-4 h-4 text-[#262626]" />
        <p className="text-sm font-medium">
          ML-powered Spotify Audio Intelligence
        </p>
      </div>
    </header>
  );
}
