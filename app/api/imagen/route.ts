import { NextRequest, NextResponse } from "next/server";

const SPEAKER_PROMPTS: Record<string, string> = {
  꼰대: "cartoon caricature of a stern Korean middle-aged male boss, pointing finger authoritatively, business suit, slightly exaggerated comic style, white background",
  MZ: "cartoon illustration of a trendy young Korean person, casual streetwear, holding smartphone, energetic pose, white background",
  정치인: "cartoon caricature of a Korean politician in suit and tie, at a podium, exaggerated confident smile, white background",
  직장인: "cartoon illustration of a tired Korean office worker, business casual, holding coffee cup, relatable expression, white background",
  자기계발러: "cartoon illustration of an enthusiastic Korean self-improvement person, surrounded by books and dumbbells, motivational energy, white background",
  진상고객: "cartoon caricature of an angry Korean customer, red face, finger pointing, dramatically exaggerated expression, white background",
  기타: "cartoon illustration of a neutral curious Korean person with a friendly smile, simple clean style, white background",
};

export async function POST(request: NextRequest) {
  try {
    const { speakerType } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY 없음" }, { status: 500 });
    }

    const prompt = SPEAKER_PROMPTS[speakerType] ?? SPEAKER_PROMPTS["기타"];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-fast-generate-001:predict?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instances: [{ prompt }],
          parameters: { sampleCount: 1, aspectRatio: "1:1" },
        }),
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || "Imagen API 오류");
    }

    const data = await res.json();
    const b64 = data.predictions?.[0]?.bytesBase64Encoded;
    const mimeType = data.predictions?.[0]?.mimeType ?? "image/png";

    if (!b64) throw new Error("이미지 생성 실패");

    return NextResponse.json({ imageData: `data:${mimeType};base64,${b64}` });
  } catch (error) {
    console.error("Imagen error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "이미지 생성 실패" },
      { status: 500 }
    );
  }
}
