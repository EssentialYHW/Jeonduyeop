export interface ConversationResult {
  overallTension: number;
  dangerLevel: "안전" | "주의" | "위험" | "폭발직전";
  summary: string;
  keyMoment: string;
  speakers: Array<{
    name: string;
    type: string;
    realIntent: string;
    emotion: string;
    emotionPercent: number;
  }>;
  lastMessageAnalysis: string;
  suggestedResponse: string;
  relationshipDiagnosis: string;
}

export interface AnalysisResult {
  speaker: {
    type: string;
    confidence: number;
    emotion: string;
    emotionPercent: number;
  };
  translation: {
    realMeaning: string;
    subtext: string;
    groundingNews?: string;
  };
  suggestions: Array<{
    tone: string;
    text: string;
  }>;
}
