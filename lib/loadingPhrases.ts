export const LOADING_PHRASES = [
  "👀 눈치 계산 중...",
  "🧠 행간 읽는 중...",
  "🔍 진짜 의도 파악 중...",
  "💭 속마음 들여다보는 중...",
  "🕵️ 말투 프로파일링 중...",
  "📡 감정 주파수 맞추는 중...",
  "🎭 가면 벗기는 중...",
  "🧩 맥락 조립 중...",
  "🤔 행간을 곱씹는 중...",
  "⚡ 전두엽 풀가동 중...",
  "🎯 의도 적중률 계산 중...",
  "📖 사회생활 사전 펼치는 중...",
];

export function randomLoadingPhrase(): string {
  return LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
}
