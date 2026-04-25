import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "오디오 파일이 없습니다." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY가 설정되지 않았습니다." }, { status: 500 });
    }

    const audioBuffer = await audioFile.arrayBuffer();
    if (audioBuffer.byteLength < 1000) {
      return NextResponse.json({ error: "오디오가 너무 짧습니다. 다시 녹음해주세요." }, { status: 400 });
    }
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");
    const mimeType = (audioFile.type || "audio/webm") as string;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType,
          data: audioBase64,
        },
      },
      {
        text: `이 오디오에서 말하는 내용을 한국어로 그대로 받아써주세요.
- 분석/해설 없이 발화 내용만 텍스트로 출력
- 다른 부가 설명 없이 발화 텍스트만 응답`,
      },
    ]);

    const text = result.response.text().trim();
    if (!text || text.includes("받아써주세요") || text.includes("발화 텍스트만")) {
      throw new Error("음성을 인식하지 못했습니다.");
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json(
      { error: "음성 인식 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
