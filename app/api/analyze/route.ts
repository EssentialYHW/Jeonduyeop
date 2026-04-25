import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PROMPT_TEMPLATE = `당신은 앞으로 사람들의 말을 듣고 분석하는 인물입니다.
아래 문장을 분석하여 JSON으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

[Google 검색으로 수집된 실시간 배경 정보]
GROUNDING_CONTEXT

[분석 항목]
1. 화자 유형: 꼰대/MZ/정치인/직장인/자기계발러/진상고객/기타 중 하나
2. 확신도: 0~100 숫자
3. 실제 의미: 말 뒤에 숨겨진 진짜 의도 (한 문장)
4. 숨겨진 맥락: 위 검색 배경 정보를 참고하여 더 풍부하게 설명 (한 문장)
5. 감정 상태: 감정을 나타내는 한 단어
6. 감정 강도: 0~100 숫자

[응답 추천 — 정확히 8가지, 각각 1~2문장]
다양성과 재미를 최우선! 가능한 한 빵 터지게, 위트 있게, 한국식 유머와 밈을 적극 활용하세요.
순서대로:
- "직장인": 정중하고 무난한 비즈니스 톤
- "솔직한": 본심 그대로 직설적으로
- "회피": 두루뭉술하게 빠져나가기
- "이상적": 갈등 없이 현명하게 풀어내기
- "잼민이": 초등학생 잼민이 말투. 미성숙하고 시끄럽고 자기중심적. "ㅋㅋㅋㅋㅋ", "내가 맞다고!!", "암튼!!", "ㄴㄴ", "님이 틀림" 같은 어투. 진심 빵 터지게
- "훈민정음": 조선시대 훈민정음/사극 어투. "~하시옵니까", "~이옵니다", "통촉하여 주시옵소서", "아니 되옵니다" 같은 진지+엉뚱한 조합으로 웃기게
- "MBTI T": MBTI T 유형 말투. 감정 배제, 팩트 위주, 차갑고 논리적으로 받아침. "그건 객관적으로 비효율적입니다" 같은 느낌
- "MBTI F": MBTI F 유형 말투. 공감 과잉, 감정 이입 폭발. "너무 속상했겠다ㅠㅠ", "그 마음 백만% 이해해", "우리 같이 이겨내자" 같은 감성 홍수 스타일

[중요]
- 각 톤의 색깔이 분명하게 다르게! 비슷한 답변 절대 금지
- 잼민이/훈민정음/MBTI T/MBTI F는 캐릭터가 진하게 묻어나야 함. 평범하면 실패
- 이모지 적당히 활용 가능

JSON 형식:
{
  "speaker": { "type": "화자유형", "confidence": 85, "emotion": "감정", "emotionPercent": 70 },
  "translation": { "realMeaning": "실제 의미", "subtext": "숨겨진 맥락", "groundingNews": "Google 검색 기반 배경 정보 (없으면 빈 문자열)" },
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
}

분석할 문장: "INPUT_SENTENCE"`;

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

    // Step 2: 그라운딩 맥락을 주입한 메인 분석 (JSON 모드)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const prompt = PROMPT_TEMPLATE
      .replace("GROUNDING_CONTEXT", groundingContext)
      .replace("INPUT_SENTENCE", text);

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON 파싱 실패");
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
