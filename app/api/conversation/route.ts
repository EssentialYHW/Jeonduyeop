import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const PROMPT = `당신은 대화를 분석하는 전문가입니다.
아래 대화를 분석하여 JSON으로만 응답하세요. 다른 텍스트는 절대 포함하지 마세요.

[분석 항목]
1. 전체 긴장도: 0~100 숫자
2. 위험도: "안전" / "주의" / "위험" / "폭발직전" 중 하나
3. 대화 요약: 전체 흐름을 한 문장으로
4. 핵심 전환점: 대화의 흐름이 바뀐 순간 한 문장
5. 화자별 분석: 등장하는 각 화자마다
   - 화자 이름/식별자 (대화에 나온 그대로)
   - 화자 유형: 꼰대/MZ/정치인/직장인/자기계발러/진상고객/기타
   - 실제 의도: 한 문장
   - 감정: 한 단어
   - 감정 강도: 0~100
6. 마지막 발언 분석: 대화의 마지막 메시지가 진짜 하려는 말
7. 추천 대응: 마지막 메시지에 대한 가장 현명한 대응 1~2문장
8. 관계 진단: 이 대화의 두 사람(또는 여러 사람) 관계를 한 줄로 진단

JSON 형식:
{
  "overallTension": 75,
  "dangerLevel": "위험",
  "summary": "대화 전체 요약",
  "keyMoment": "핵심 전환점",
  "speakers": [
    { "name": "A", "type": "꼰대", "realIntent": "실제 의도", "emotion": "분노", "emotionPercent": 80 }
  ],
  "lastMessageAnalysis": "마지막 발언의 진짜 의미",
  "suggestedResponse": "추천 대응",
  "relationshipDiagnosis": "관계 진단"
}

분석할 대화:
CONVERSATION`;

export async function POST(request: NextRequest) {
  try {
    const { conversation } = await request.json();

    if (!conversation?.trim()) {
      return NextResponse.json({ error: "대화 내용을 입력해주세요." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY가 설정되지 않았습니다." }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = PROMPT.replace("CONVERSATION", conversation);
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("JSON 파싱 실패");

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Conversation analyze error:", error);
    return NextResponse.json(
      { error: "분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}
