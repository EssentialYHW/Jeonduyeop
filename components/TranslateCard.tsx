"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TranslateCardProps {
  realMeaning: string;
  subtext: string;
  groundingNews?: string;
}

export default function TranslateCard({ realMeaning, subtext, groundingNews }: TranslateCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">🔍 실제 의미</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <p className="font-semibold text-primary text-lg leading-snug">&ldquo;{realMeaning}&rdquo;</p>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">숨겨진 맥락</p>
          <p className="text-sm">{subtext}</p>
        </div>
        {groundingNews && groundingNews !== "관련 검색 정보 없음" && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-1 flex items-center gap-1">
              <span>🌐</span> Google 검색 기반 실시간 맥락
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-200">{groundingNews}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
