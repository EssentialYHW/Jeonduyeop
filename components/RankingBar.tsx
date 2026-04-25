"use client";

import { useEffect, useState } from "react";
import { getRanking } from "@/lib/ranking";

const EMOJI: Record<string, string> = {
  꼰대: "👴", MZ: "🧑", 정치인: "🏛️", 직장인: "💼",
  자기계발러: "📚", 진상고객: "😤", 기타: "🤔",
};

export default function RankingBar({ refreshKey }: { refreshKey: number }) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setCounts(getRanking().counts);
  }, [refreshKey]);

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3);
  if (sorted.length === 0) return null;

  return (
    <div className="bg-card border rounded-full px-3 py-1.5 flex items-center gap-2 shadow-sm overflow-x-auto">
      <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">📊 오늘 TOP</span>
      <div className="flex items-center gap-2">
        {sorted.map(([type, count], i) => (
          <span key={type} className="flex items-center gap-1 text-xs whitespace-nowrap">
            <span className="font-bold text-muted-foreground">{i + 1}</span>
            <span>{EMOJI[type] || "🤔"}</span>
            <span className="font-medium">{type}</span>
            <span className="text-muted-foreground">×{count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
