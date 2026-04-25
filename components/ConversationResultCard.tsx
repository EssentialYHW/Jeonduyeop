"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConversationResult } from "@/types";

const DANGER_CONFIG: Record<string, { color: string; bg: string; bar: string; emoji: string }> = {
  안전: { color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800", bar: "bg-green-500", emoji: "✅" },
  주의: { color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800", bar: "bg-yellow-500", emoji: "⚠️" },
  위험: { color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800", bar: "bg-orange-500", emoji: "🚨" },
  폭발직전: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800", bar: "bg-red-500", emoji: "💥" },
};

const SPEAKER_EMOJI: Record<string, string> = {
  꼰대: "👴", MZ: "🧑", 정치인: "🏛️", 직장인: "💼",
  자기계발러: "📚", 진상고객: "😤", 기타: "🤔",
};

interface Props {
  result: ConversationResult;
}

export default function ConversationResultCard({ result }: Props) {
  const danger = DANGER_CONFIG[result.dangerLevel] ?? DANGER_CONFIG["주의"];

  return (
    <div className="space-y-3">
      {/* 위험도 + 긴장도 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">🌡️ 대화 긴장도</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className={`p-3 rounded-lg border ${danger.bg} flex items-center gap-3`}>
            <span className="text-2xl">{danger.emoji}</span>
            <div>
              <p className={`font-bold text-lg ${danger.color}`}>{result.dangerLevel}</p>
              <p className="text-xs text-muted-foreground">{result.summary}</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>긴장도</span><span>{result.overallTension}%</span>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${danger.bar}`}
                style={{ width: `${result.overallTension}%` }}
              />
            </div>
          </div>
          {result.keyMoment && (
            <div className="p-2 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-0.5">⚡ 핵심 전환점</p>
              <p className="text-sm">{result.keyMoment}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 화자별 분석 */}
      {result.speakers.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">👥 화자별 분석</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {result.speakers.map((s, i) => (
              <div key={i} className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{SPEAKER_EMOJI[s.type] || "🤔"}</span>
                  <span className="font-medium text-sm">{s.name}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{s.type}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">진짜 의도: <span className="text-foreground">{s.realIntent}</span></p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{s.emotion}</span>
                  <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${s.emotionPercent}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground">{s.emotionPercent}%</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 마지막 메시지 + 추천 대응 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">💡 마지막 발언 분석</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-xs text-muted-foreground mb-1">진짜 하려는 말</p>
            <p className="font-semibold text-primary">&ldquo;{result.lastMessageAnalysis}&rdquo;</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">🎯 추천 대응</p>
            <p className="text-sm">{result.suggestedResponse}</p>
          </div>
          {result.relationshipDiagnosis && (
            <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800">
              <p className="text-xs text-muted-foreground mb-1">🔬 관계 진단</p>
              <p className="text-sm text-purple-800 dark:text-purple-200">{result.relationshipDiagnosis}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
