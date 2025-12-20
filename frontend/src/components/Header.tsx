import { Sparkles, Music } from "lucide-react";

export default function Header() {
  return (
    <header className="text-center mb-12">
      <div className="inline-flex items-center justify-center gap-3 mb-4">
        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
          <Music className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-white tracking-tight">
          Music Recommendation
        </h1>
      </div>

      <div className="flex items-center justify-center gap-2 text-white/50 mt-3">
        <Sparkles className="w-4 h-4" />
        <p className="text-sm font-medium">
          Powered by Machine Learning & Spotify Audio Features
        </p>
      </div>
    </header>
  );
}
