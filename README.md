# 🧠 전두엽 (Jeonduyeop)

> **말의 표면 아래, 진짜 의도를 번역합니다.**

사람들이 하는 말의 숨겨진 의미를 분석하고, 상황에 맞는 최적의 응답을 추천하는 AI 커뮤니케이션 어시스턴트입니다.  
"금일 중으로 컨펌 부탁드립니다"가 실제로 무슨 뜻인지, 어떻게 대응하면 좋은지 — 전두엽이 대신 생각해드립니다.

---

## ✨ 주요 기능

### 🔍 발화 분석
- **화자 유형 분류** — 꼰대 / MZ / 정치인 / 직장인 / 자기계발러 / 진상고객 / 기타
- **실제 의미 번역** — 말 뒤에 숨겨진 진짜 의도 파악
- **감정 상태 게이지** — 확신도 · 감정 강도 시각화
- **🌐 Google Search Grounding** — 발언과 관련된 실시간 뉴스·맥락을 자동 검색해 분석에 반영

### 💬 응답 추천 (8가지 톤)

| 톤 | 설명 |
|----|------|
| 💼 직장인 | 정중하고 무난한 비즈니스 톤 |
| 💬 솔직한 | 본심 그대로 직설적으로 |
| 🌀 회피 | 두루뭉술하게 빠져나가기 |
| ⭐ 이상적 | 갈등 없이 현명하게 풀어내기 |
| 🧒 잼민이 | 초등학생 잼민이 말투로 받아치기 |
| 📜 훈민정음 | 조선시대 사극 어투로 진지하게 |
| 🧊 MBTI T | 감정 배제, 팩트만 차갑게 |
| 🥹 MBTI F | 공감 과잉, 감성 홍수 스타일 |

### 💬 대화 전체 분석
카카오톡 대화, 문자, 회의록을 붙여넣으면:
- **긴장도 게이지** — 안전 / 주의 / 위험 / 폭발직전 4단계
- **화자별 의도 분석** — 각 사람의 유형 · 실제 의도 · 감정 강도
- **핵심 전환점** — 대화 흐름이 바뀐 순간 포착
- **마지막 발언 분석 + 추천 대응**
- **관계 진단** — 두 사람의 관계를 한 줄로

### 🎤 다양한 입력 방식
- **텍스트** 직접 입력
- **음성** 녹음 → 자동 텍스트 변환 후 분석
- **영상/음성 파일** 업로드 (MP4, MOV, MP3, WAV 등)
- **YouTube URL** 입력 → Gemini가 영상 내용을 직접 받아쓰기

### 기타
- 🌙 다크 / 라이트 모드 전환
- 💬 카카오톡 스타일 채팅 UI
- 🏆 화자 유형별 실시간 랭킹 바
- 📸 분석 결과 이미지 저장
- 🔊 응답 추천 TTS 재생 (클릭 한 번으로 읽어주기)

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v3 + shadcn/ui |
| **AI 분석** | Gemini 2.5 Flash (`@google/generative-ai`) |
| **Search Grounding** | Google Search Retrieval (Gemini 내장) |
| **STT** | Google Cloud Speech-to-Text — Chirp 2 |
| **TTS** | Google Cloud Text-to-Speech — Chirp3-HD-Charon |
| **영상 이해** | Gemini Multimodal (YouTube URL 직접 처리) |
| **배포** | Vercel |

---

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/YOUR_USERNAME/jeonduyeop.git
cd jeonduyeop
npm install
```

### 2. 환경변수 설정

`.env.local` 파일 생성:

```env
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
```

| 변수 | 발급처 |
|------|--------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey) |
| `GOOGLE_CLOUD_API_KEY` | Google Cloud Console → Speech-to-Text API / Text-to-Speech API 활성화 후 발급 |

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

---

## 📁 프로젝트 구조

```
jeonduyeop/
├── app/
│   ├── api/
│   │   ├── analyze/       # 발화 분석 (Gemini 2.5 Flash + Google Search Grounding)
│   │   ├── conversation/  # 대화 전체 분석
│   │   ├── stt/           # 음성 → 텍스트 (Google Cloud STT Chirp 2)
│   │   ├── tts/           # 텍스트 → 음성 (Google Cloud TTS Chirp3-HD)
│   │   └── youtube/       # YouTube URL → 발화 추출 (Gemini Multimodal)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ChatBubble.tsx              # 카카오톡 스타일 버블
│   ├── ConversationInput.tsx       # 대화 붙여넣기 입력
│   ├── ConversationResultCard.tsx  # 대화 분석 결과 카드
│   ├── InputSelector.tsx           # 입력 방식 탭 (텍스트/음성/영상/대화)
│   ├── RankingBar.tsx              # 화자 유형 랭킹
│   ├── SpeakerCard.tsx             # 화자 분석 카드
│   ├── SuggestCard.tsx             # 응답 추천 카드
│   ├── TranslateCard.tsx           # 실제 의미 번역 카드
│   ├── VideoInput.tsx              # 영상/YouTube 입력
│   └── VoiceInput.tsx              # 음성 녹음 입력
├── lib/
│   ├── loadingPhrases.ts   # 분석 중 재밌는 문구
│   └── ranking.ts          # 화자 유형 랭킹 (localStorage)
└── types/
    └── index.ts
```

---

## 🎯 사용 예시

**단일 발화 분석**
```
입력: "이번 건 좀 검토해봐~ 급하진 않아"

→ 화자 유형: 꼰대 (87%)
→ 실제 의미: "지금 당장 해줘, 사실 엄청 급해"
→ Google 검색 기반 실시간 맥락 표시
→ 8가지 톤의 응답 추천 제공
```

**대화 전체 분석**
```
팀장: 이번 프로젝트 언제 끝나?
나: 다음주 금요일까지 가능할 것 같습니다
팀장: 음... 좀 더 당길 순 없어?

→ 긴장도: 위험 🚨 (72%)
→ 팀장: 꼰대 유형 — 실제 의도: 빠른 완료 압박
→ 핵심 전환점 분석
→ 마지막 발언 대응 전략 제시
```

---

## 🌐 Vercel 배포

```bash
npm run build
vercel --prod
```

Vercel 환경변수 설정에서 `GEMINI_API_KEY`, `GOOGLE_CLOUD_API_KEY`를 추가해주세요.

---

## 📄 라이선스

MIT
