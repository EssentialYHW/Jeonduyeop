import { Metadata } from "next";
import SpeakerCard from "@/components/SpeakerCard";
import TranslateCard from "@/components/TranslateCard";
import SuggestCard from "@/components/SuggestCard";
import ConversationResultCard from "@/components/ConversationResultCard";
import { AnalysisResult, ConversationResult } from "@/types";

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `전두엽 분석 결과 #${params.id}` };
}

async function getSharedResult(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/share?id=${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function SharePage({ params }: Props) {
  const shared = await getSharedResult(params.id);

  if (!shared) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-yellow-50 to-yellow-100/50">
        <div className="text-center space-y-3">
          <div className="text-5xl">😢</div>
          <p className="text-lg font-semibold">결과를 찾을 수 없습니다</p>
          <p className="text-sm text-gray-500">링크가 만료되었거나 존재하지 않는 결과입니다.</p>
          <a href="/" className="inline-block mt-4 px-4 py-2 bg-yellow-300 rounded-full text-sm font-medium hover:bg-yellow-400 transition-colors">
            🧠 전두엽 사용해보기
          </a>
        </div>
      </main>
    );
  }

  const isConversation = shared.type === "conversation";

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 to-yellow-100/50 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl">🧠</span>
          <div>
            <h1 className="text-lg font-bold">전두엽</h1>
            <p className="text-xs text-gray-500">공유된 분석 결과</p>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">분석된 발언:</span>{" "}
          {shared.text ?? "(대화 분석)"}
        </div>

        {isConversation ? (
          <ConversationResultCard result={shared.data as ConversationResult} />
        ) : (
          <>
            <SpeakerCard
              type={(shared.data as AnalysisResult).speaker.type}
              confidence={(shared.data as AnalysisResult).speaker.confidence}
              emotion={(shared.data as AnalysisResult).speaker.emotion}
              emotionPercent={(shared.data as AnalysisResult).speaker.emotionPercent}
            />
            <TranslateCard
              realMeaning={(shared.data as AnalysisResult).translation.realMeaning}
              subtext={(shared.data as AnalysisResult).translation.subtext}
              groundingNews={(shared.data as AnalysisResult).translation.groundingNews}
            />
            <SuggestCard suggestions={(shared.data as AnalysisResult).suggestions} />
          </>
        )}

        <div className="text-center pt-4">
          <a href="/" className="inline-block px-6 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-slate-900 rounded-full text-sm font-medium transition-colors">
            🧠 나도 분석해보기
          </a>
        </div>
      </div>
    </main>
  );
}
