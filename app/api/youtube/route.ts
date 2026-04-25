import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const YT_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i;

function normalizeUrl(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (!YT_REGEX.test(trimmed)) return null;
  if (trimmed.startsWith("http")) return trimmed;
  return `https://${trimmed}`;
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    const ytUrl = normalizeUrl(url || "");

    if (!ytUrl) {
      return NextResponse.json(
        { error: "유효한 YouTube URL을 입력해주세요." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      {
        fileData: {
          fileUri: ytUrl,
          mimeType: "video/*",
        },
      },
      {
        text: `이 영상에서 사람이 말하는 내용을 한국어로 그대로 받아써주세요.
- 화자가 여러 명이면 가장 핵심적인 발언자의 말 위주로 정리
- 분석/해설 없이 발화 내용만 그대로 텍스트로 출력
- 다른 부가 설명 없이 발화 텍스트만 응답`,
      },
    ]);

    const text = result.response.text().trim();

    if (!text) {
      throw new Error("영상에서 발화를 추출하지 못했습니다.");
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("YouTube error:", error);
    const message =
      error instanceof Error ? error.message : "YouTube 처리 중 오류가 발생했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
