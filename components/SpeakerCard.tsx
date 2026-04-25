"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SPEAKER_EMOJI: Record<string, string> = {
  꼰대: "👴",
  MZ: "🧑",
  정치인: "🏛️",
  직장인: "💼",
  자기계발러: "📚",
  진상고객: "😤",
  기타: "🤔",
};

const SPEAKER_COLOR: Record<string, string> = {
  꼰대: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:border-amber-800",
  MZ: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800",
  정치인: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800",
  직장인: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  자기계발러: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800",
  진상고객: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800",
  기타: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700",
};

interface SpeakerCardProps {
  type: string;
  confidence: number;
  emotion: string;
  emotionPercent: number;
}

export default function SpeakerCard({ type, confidence, emotion, emotionPercent }: SpeakerCardProps) {
  const emoji = SPEAKER_EMOJI[type] || "🤔";
  const colorClass = SPEAKER_COLOR[type] || SPEAKER_COLOR["기타"];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">👤 화자 분석</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{emoji}</span>
          <Badge className={`text-base px-3 py-1 border ${colorClass}`} variant="outline">
            {type}
          </Badge>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">확신도</span>
              <span className="font-medium">{confidence}%</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-700"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">감정 — {emotion}</span>
              <span className="font-medium">{emotionPercent}%</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-700"
                style={{ width: `${emotionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
