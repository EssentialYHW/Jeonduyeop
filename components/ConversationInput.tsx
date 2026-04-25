"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ConversationInputProps {
  onAnalyze: (conversation: string) => void;
  isLoading: boolean;
}

const EXAMPLES = [
  `팀장: 이번 프로젝트 언제 끝나?
나: 다음주 금요일까지 가능할 것 같습니다
팀장: 음... 좀 더 당길 순 없어?
나: 최대한 해보겠습니다
팀장: 그래 믿어볼게`,
  `A: 오늘 저녁 뭐해?
B: 그냥 집에 있으려고
A: 아 그래? 나 오늘 사실 힘든 일 있었는데
B: 힘들었구나ㅠ 잘 쉬어
A: 응 ㅇㅇ`,
];

export default function ConversationInput({ onAnalyze, isLoading }: ConversationInputProps) {
  const [text, setText] = useState("");

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground space-y-1">
        <p>💬 카카오톡 대화, 문자, 회의록 등을 그대로 붙여넣으세요.</p>
        <p className="text-[11px]">형식 자유 — <span className="font-medium">이름: 내용</span> 형태면 화자별 분석도 가능합니다.</p>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`예시:\n팀장: 이번 건 좀 빨리 부탁해\n나: 네 알겠습니다\n팀장: 믿어볼게`}
        className="w-full h-40 px-3 py-2 text-sm rounded-md border border-input bg-background resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        disabled={isLoading}
      />
      <div className="flex gap-2 flex-wrap">
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => setText(ex)}
            className="text-[11px] px-2 py-1 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
          >
            예시 {i + 1}
          </button>
        ))}
      </div>
      <Button
        onClick={() => onAnalyze(text)}
        disabled={!text.trim() || isLoading}
        className="w-full"
        size="lg"
      >
        {isLoading ? "분석 중..." : "💬 대화 분석하기"}
      </Button>
    </div>
  );
}
