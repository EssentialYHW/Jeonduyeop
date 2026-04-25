"use client";

import { useState, useEffect, useRef } from "react";
import InputSelector, { InputSource } from "@/components/InputSelector";
import SpeakerCard from "@/components/SpeakerCard";
import TranslateCard from "@/components/TranslateCard";
import SuggestCard from "@/components/SuggestCard";
import ThemeToggle from "@/components/ThemeToggle";
import RankingBar from "@/components/RankingBar";
import CaptureButton from "@/components/CaptureButton";
import { UserBubble, AssistantBubble, TypingBubble } from "@/components/ChatBubble";
import ConversationResultCard from "@/components/ConversationResultCard";
import { AnalysisResult, ConversationResult } from "@/types";
import { randomLoadingPhrase } from "@/lib/loadingPhrases";
import { recordSpeaker } from "@/lib/ranking";

const SPEAKER_EMOJI: Record<string, string> = {
  꼰대: "👴", MZ: "🧑", 정치인: "🏛️", 직장인: "💼",
  자기계발러: "📚", 진상고객: "😤", 기타: "🤔",
};

interface Message {
  id: string;
  role: "user" | "assistant";
  text?: string;
  source?: InputSource;
  result?: AnalysisResult;
  conversationResult?: ConversationResult;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loadingPhrase, setLoadingPhrase] = useState("");
  const [rankingKey, setRankingKey] = useState(0);
  const [inputOpen, setInputOpen] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isLoading) return;
    setLoadingPhrase(randomLoadingPhrase());
    const interval = setInterval(() => setLoadingPhrase(randomLoadingPhrase()), 2000);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleAnalyze = async (text: string, source: InputSource) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      source,
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError("");

    try {
      if (source === "conversation") {
        const res = await fetch("/api/conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversation: text }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "분석 오류");
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", conversationResult: data }]);
      } else {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "분석 오류");
        setMessages((prev) => [...prev, { id: `a-${Date.now()}`, role: "assistant", result: data }]);
        recordSpeaker(data.speaker.type);
        setRankingKey((k) => k + 1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (messages.length === 0) return;
    if (confirm("대화 내역을 모두 지울까요?")) setMessages([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100/50 dark:from-slate-950 dark:to-slate-900 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-20 backdrop-blur bg-background/70 border-b">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🧠</span>
            <div className="leading-none">
              <h1 className="text-lg font-bold tracking-tight">전두엽</h1>
              <p className="text-[10px] text-muted-foreground tracking-widest uppercase">Jeonduyeop</p>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <RankingBar refreshKey={rankingKey} />
          </div>
          <button
            onClick={clearChat}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
            title="대화 초기화"
          >
            🗑
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Chat Thread */}
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 space-y-5 overflow-y-auto">
        {messages.length === 0 && !isLoading && (
          <div className="text-center py-12 space-y-3">
            <div className="text-5xl">💬</div>
            <p className="text-sm text-muted-foreground">
              말 한마디만 보내주세요.<br />그 안에 숨은 진짜 의미를 풀어드릴게요.
            </p>
            <div className="flex flex-wrap justify-center gap-2 pt-2 max-w-md mx-auto">
              {["금일 중으로 컨펌 부탁드립니다", "요즘 젊은 친구들은 근성이 없어", "국민의 뜻을 받들어 적극 검토하겠습니다"].map((d) => (
                <button
                  key={d}
                  onClick={() => handleAnalyze(d, "text")}
                  className="text-xs px-3 py-1.5 rounded-full bg-card border hover:bg-muted transition-colors"
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserBubble key={msg.id} text={msg.text!} source={msg.source} />
          ) : (
            <div key={msg.id} id={`result-${msg.id}`} className="bg-transparent">
              {msg.conversationResult ? (
                <AssistantBubble emoji="💬" speakerType="대화 분석">
                  <ConversationResultCard result={msg.conversationResult} />
                  <div className="flex justify-end pt-1">
                    <CaptureButton targetId={`result-${msg.id}`} />
                  </div>
                </AssistantBubble>
              ) : (
                <AssistantBubble
                  emoji={SPEAKER_EMOJI[msg.result!.speaker.type] || "🤔"}
                  speakerType={msg.result!.speaker.type}
                >
                  <SpeakerCard
                    type={msg.result!.speaker.type}
                    confidence={msg.result!.speaker.confidence}
                    emotion={msg.result!.speaker.emotion}
                    emotionPercent={msg.result!.speaker.emotionPercent}
                  />
                  <TranslateCard
                    realMeaning={msg.result!.translation.realMeaning}
                    subtext={msg.result!.translation.subtext}
                    groundingNews={msg.result!.translation.groundingNews}
                  />
                  <SuggestCard suggestions={msg.result!.suggestions} />
                  <div className="flex justify-end pt-1">
                    <CaptureButton targetId={`result-${msg.id}`} />
                  </div>
                </AssistantBubble>
              )}
            </div>
          )
        )}

        {isLoading && <TypingBubble phrase={loadingPhrase} />}

        {error && !isLoading && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-3 text-center">
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Dock */}
      <div className="sticky bottom-0 z-10 bg-background/90 backdrop-blur border-t">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <button
            onClick={() => setInputOpen((v) => !v)}
            className="w-full text-xs text-muted-foreground py-1 hover:text-foreground transition-colors flex items-center justify-center gap-1"
          >
            {inputOpen ? "▼ 입력창 접기" : "▲ 입력창 펼치기"}
          </button>
          {inputOpen && (
            <div className="pt-2">
              <InputSelector onAnalyze={handleAnalyze} isLoading={isLoading} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
