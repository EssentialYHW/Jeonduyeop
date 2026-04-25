"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TONE_EMOJI: Record<string, string> = {
  직장인: "💼",
  솔직한: "💬",
  회피: "🌀",
  이상적: "⭐",
  잼민이: "🧒",
  훈민정음: "📜",
  "MBTI T": "🧊",
  "MBTI F": "🥹",
};

const TONE_COLOR: Record<string, string> = {
  직장인: "border-l-slate-400",
  솔직한: "border-l-orange-400",
  회피: "border-l-blue-400",
  이상적: "border-l-yellow-400",
  잼민이: "border-l-purple-500",
  훈민정음: "border-l-amber-700",
  "MBTI T": "border-l-cyan-500",
  "MBTI F": "border-l-rose-400",
};

const TONE_LABEL: Record<string, string> = {
  직장인: "직장인 모드",
  솔직한: "솔직한 모드",
  회피: "회피 모드",
  이상적: "이상적 모드",
  잼민이: "잼민이 모드 🧒",
  훈민정음: "훈민정음 모드 📜",
  "MBTI T": "MBTI T 모드 ❄️",
  "MBTI F": "MBTI F 모드 🥹",
};

interface SuggestCardProps {
  suggestions: Array<{ tone: string; text: string }>;
}

export default function SuggestCard({ suggestions }: SuggestCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const playTTS = async (text: string, index: number) => {
    if (playingIndex === index) return;
    setPlayingIndex(index);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS 오류");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => {
        setPlayingIndex(null);
        URL.revokeObjectURL(url);
      };
      audio.play();
    } catch {
      setPlayingIndex(null);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">💡 응답 추천 ({suggestions.length}가지)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((s, i) => (
          <div
            key={i}
            className={`p-3 bg-muted/50 rounded-lg border-l-4 ${TONE_COLOR[s.tone] || "border-l-gray-400"} hover:bg-muted transition-colors`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <span className="text-xs text-muted-foreground font-medium">
                  {TONE_EMOJI[s.tone] || "💬"} {TONE_LABEL[s.tone] || `${s.tone} 모드`}
                </span>
                <p className="text-sm mt-0.5 leading-snug">{s.text}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => playTTS(s.text, i)}
                  disabled={playingIndex !== null}
                  title="읽어주기"
                >
                  {playingIndex === i ? "🔊" : "▶"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => copyToClipboard(s.text, i)}
                  title="복사"
                >
                  {copiedIndex === i ? "✓" : "📋"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
