import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `당신은 사람들의 말을 듣고 분석하는 전문가입니다.

[Google 검색으로 수집된 실시간 배경 정보]
GROUNDING_CONTEXT

[분석 규칙]
- 화자 유형: 꼰대/MZ/정치인/직장인/자기계발러/진상고객/기타 중 하나
- 확신도·감정 강도: 0~100 숫자
- 숨겨진 맥락: 검색 배경 정보를 참고해 풍부하게
- groundingNews: Google 검색 기반 배경 정보 (없으면 빈 문자열)

[응답 추천 — 정확히 8가지, 각각 1~2문장, 한국식 유머와 밈 적극 활용]
- "직장인": 정중하고 무난한 비즈니스 톤
- "솔직한": 본심 그대로 직설적으로
- "회피": 두루뭉술하게 빠져나가기
- "이상적": 갈등 없이 현명하게 풀어내기
- "잼민이": ㅋㅋㅋㅋㅋ, 내가 맞다고!!, 암튼!!, ㄴㄴ, 님이 틀림 — 빵 터지게
- "훈민정음": ~하시옵니까, ~이옵니다, 통촉하여 주시옵소서 — 진지+엉뚱 조합
- "MBTI T": 감정 배제, 팩트 위주, 차갑고 논리적
- "MBTI F": 공감 과잉, 감성 홍수, 너무 속상했겠다ㅠㅠ

[중요] 잼민이/훈민정음/MBTI T/MBTI F 캐릭터가 진하게 묻어나야 함. 평범하면 실패.

분석할 문장: "INPUT_SENTENCE"`;

const JSON_SCHEMA = `{
  "speaker": { "type": "화자유형", "confidence": 85, "emotion": "감정", "emotionPercent": 70 },
  "translation": { "realMeaning": "실제 의미", "subtext": "숨겨진 맥락", "groundingNews": "검색 배경 (없으면 빈 문자열)" },
  "suggestions": [
    { "tone": "직장인", "text": "..." },
    { "tone": "솔직한", "text": "..." },
    { "tone": "회피", "text": "..." },
    { "tone": "이상적", "text": "..." },
    { "tone": "잼민이", "text": "..." },
    { "tone": "훈민정음", "text": "..." },
    { "tone": "MBTI T", "text": "..." },
    { "tone": "MBTI F", "text": "..." }
  ]
}`;

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "텍스트를 입력해주세요." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY가 설정되지 않았습니다." }, { status: 500 });
    }

    // Step 1: Google Search Grounding으로 실시간 배경 정보 수집
    let groundingContext = "관련 검색 정보 없음";
    try {
      const groundingModel = genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
        tools: [{ googleSearchRetrieval: {} }],
      });
      const groundResult = await groundingModel.generateContent(
        `다음 발언과 관련된 실제 배경이나 최신 뉴스·맥락을 2~3문장으로 요약해줘. 관련 정보가 없으면 "관련 검색 정보 없음"이라고만 답해.\n발언: "${text}"`
      );
      const raw = groundResult.response.text().trim();
      if (raw) groundingContext = raw;
    } catch {
      // 그라운딩 실패 시 기본값 유지
    }

    // Step 2: JSON 모드로 구조화된 분석 결과 추출
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = (SYSTEM_PROMPT + "\n\nJSON 형식:\n" + JSON_SCHEMA)
      .replace("GROUNDING_CONTEXT", groundingContext)
      .replace("INPUT_SENTENCE", text);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 파싱 실패");

    return NextResponse.json(JSON.parse(jsonMatch[0]));
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
