import { Music } from "lucide-react";

export default function Header() {
  return (
    <header className="text-center mb-14 animate-fade-in opacity-0">
      <div className="inline-flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <Music className="w-6 h-6 text-zinc-100" />
        </div>

        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100">
          Music Recommendation
        </h1>
      </div>

      <div className="flex justify-center items-center text-zinc-500">
        <p className="text-sm font-medium tracking-wide">
          ML-powered Spotify Audio Intelligence
        </p>
      </div>
    </header>
  );
}
