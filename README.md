# 🧠 전두엽 (Jeonduyeop)

> **말의 표면 아래, 진짜 의도를 번역합니다.**

사람들이 하는 말의 숨겨진 의미를 분석하고, 상황에 맞는 최적의 응답을 추천하는 AI 커뮤니케이션 어시스턴트입니다.

---

## ✨ 주요 기능

### 🔍 발화 분석
- **화자 유형 분류** — 꼰대 / MZ / 정치인 / 직장인 / 자기계발러 / 진상고객 / 기타
- **실제 의미 번역** — 말 뒤에 숨겨진 진짜 의도 파악
- **감정 상태 게이지** — 확신도 · 감정 강도 시각화
- **🎨 Imagen 3 캐릭터** — 화자 유형별 AI 캐릭터 이미지 자동 생성
- **🌐 Google Search Grounding** — 발언과 관련된 실시간 뉴스·맥락 자동 검색 후 분석에 반영

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
- **텍스트** 직접 입력 (비한국어 자동 감지 → 한국어 번역 후 분석)
- **음성** 녹음 → Gemini 2.5 Flash 멀티모달 음성 인식
- **영상/음성 파일** 업로드 (MP4, MOV, MP3, WAV 등)
- **YouTube URL** 입력 → Gemini가 영상 내용을 직접 받아쓰기

### 기타
- 🌙 다크 / 라이트 모드 전환
- 💬 카카오톡 스타일 채팅 UI
- 🏆 화자 유형별 실시간 랭킹 바
- 📸 분석 결과 이미지 저장
- 🔗 분석 결과 URL 공유 (Firebase Firestore)
- 🔊 응답 추천 TTS 재생

---

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS v3 + shadcn/ui |
| **AI 분석** | Gemini 2.5 Flash |
| **Search Grounding** | Google Search Retrieval (Gemini 내장) |
| **이미지 생성** | Imagen 3 (화자 유형 캐릭터) |
| **번역** | Google Cloud Translation API |
| **STT** | Gemini 2.5 Flash Multimodal |
| **TTS** | Google Cloud Text-to-Speech — Chirp3-HD-Charon |
| **영상 이해** | Gemini 2.5 Flash Multimodal (YouTube URL 직접 처리) |
| **공유** | Firebase Firestore |
| **배포** | Docker (NAS / 자체 서버) |

---

## 🚀 빠른 시작

### 1. 저장소 클론

```bash
git clone https://github.com/EssentialYHW/Jeonduyeop.git
cd Jeonduyeop
npm install
```

### 2. 환경변수 설정

`.env.local` 파일 생성:

```env
# Google AI Studio: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key

# Google Cloud Console (TTS / Translate API 활성화)
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key

# Firebase Console: https://console.firebase.google.com
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_API_KEY=your_firebase_api_key

# 배포 URL (로컬: http://localhost:3000)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인

---

## 🐳 Docker 배포 (NAS / 자체 서버)

```bash
docker build -t jeonduyeop .
docker run -p 3000:3000 --env-file .env.local jeonduyeop
```

또는 `docker-compose up -d`

---

## 📁 프로젝트 구조

```
jeonduyeop/
├── app/
│   ├── api/
│   │   ├── analyze/       # 발화 분석 (Gemini + Google Search Grounding)
│   │   ├── conversation/  # 대화 전체 분석
│   │   ├── imagen/        # 화자 캐릭터 이미지 생성 (Imagen 3)
│   │   ├── share/         # 결과 공유 (Firebase Firestore)
│   │   ├── stt/           # 음성 인식 (Gemini 2.5 Flash Multimodal)
│   │   ├── translate/     # 언어 감지 + 한국어 번역
│   │   ├── tts/           # 텍스트 → 음성 (Google Cloud TTS Chirp3-HD)
│   │   └── youtube/       # YouTube URL → 발화 추출 (Gemini Multimodal)
│   ├── share/[id]/        # 공유된 결과 페이지
│   └── page.tsx
├── components/
│   ├── ConversationResultCard.tsx
│   ├── ShareButton.tsx
│   ├── SpeakerCard.tsx    # Imagen 3 캐릭터 포함
│   ├── TranslateCard.tsx  # Google Search Grounding 표시
│   └── ...
└── types/index.ts
```

---

## 📄 라이선스

MIT
