import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    if (!text?.trim()) return NextResponse.json({ error: "텍스트 없음" }, { status: 400 });

    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      return NextResponse.json({ error: "GOOGLE_CLOUD_API_KEY 없음" }, { status: 500 });
    }

    const res = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text }),
      }
    );

    const detectData = await res.json();
    const detectedLanguage = detectData.data?.detections?.[0]?.[0]?.language ?? "ko";

    if (detectedLanguage === "ko") {
      return NextResponse.json({ translatedText: text, detectedLanguage: "ko", isKorean: true });
    }

    const translateRes = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, target: "ko", format: "text" }),
      }
    );

    const translateData = await translateRes.json();
    const translatedText = translateData.data?.translations?.[0]?.translatedText ?? text;

    return NextResponse.json({ translatedText, detectedLanguage, isKorean: false });
  } catch (error) {
    console.error("Translate error:", error);
    return NextResponse.json({ translatedText: "", detectedLanguage: "ko", isKorean: true });
  }
}
