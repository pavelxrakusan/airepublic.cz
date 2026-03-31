'use client';

import { useEffect, useState } from 'react';

interface ScoreEntry {
  name: string;
  score: number;
  date: string;
}

export default function SnakeLeaderboard() {
  const [scores, setScores] = useState<ScoreEntry[] | null>(null);

  useEffect(() => {
    const loadScores = () =>
      fetch('/api/snake-scores')
        .then((res) => res.json())
        .then((data) => setScores(data))
        .catch(() => setScores([]));

    // Delay refetch slightly so Blob has time to propagate the write
    const handleScoreUpdated = () => setTimeout(loadScores, 500);

    loadScores();

    window.addEventListener('snake-score-updated', handleScoreUpdated);
    return () => window.removeEventListener('snake-score-updated', handleScoreUpdated);
  }, []);

  if (scores === null) {
    return <p className="my-4 text-sm text-zinc-500">Načítám leaderboard...</p>;
  }

  if (scores.length === 0) {
    return <p className="my-4 text-sm text-zinc-500">Zatím žádné skóre. Buď první!</p>;
  }

  return (
    <div className="my-8 overflow-hidden rounded-lg border border-zinc-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-800 bg-zinc-900/50">
          <tr>
            <th className="px-4 py-2 font-mono text-zinc-500">#</th>
            <th className="px-4 py-2 font-mono text-zinc-500">Hráč</th>
            <th className="px-4 py-2 text-right font-mono text-zinc-500">Skóre</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((entry, i) => (
            <tr key={i} className="border-b border-zinc-800/50 last:border-0">
              <td className="px-4 py-2 font-mono text-zinc-600">{i + 1}</td>
              <td className="px-4 py-2 font-mono text-zinc-300">{entry.name}</td>
              <td className="px-4 py-2 text-right font-mono text-green-400">{entry.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
