"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

const DEMO_TEXTS = [
  "금일 중으로 컨펌 부탁드립니다",
  "요즘 젊은 친구들은 근성이 없어",
  "국민의 뜻을 받들어 적극 검토하겠습니다",
  "이건 제 생각인데요, 한번 들어보실래요?",
];

export default function TextInput({ onAnalyze, isLoading }: TextInputProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) onAnalyze(text.trim());
  };

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="분석할 문장을 입력하세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
        }}
        className="min-h-[120px] resize-none text-base"
      />
      <div className="flex flex-wrap gap-2">
        {DEMO_TEXTS.map((demo) => (
          <button
            key={demo}
            onClick={() => setText(demo)}
            className="text-xs px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
          >
            {demo}
          </button>
        ))}
      </div>
      <Button
        onClick={handleSubmit}
        disabled={!text.trim() || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "분석 중..." : "🔍 번역하기"}
      </Button>
      <p className="text-xs text-center text-muted-foreground">Ctrl+Enter로도 분석할 수 있어요</p>
    </div>
  );
}
