import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "텍스트를 입력해주세요." }, { status: 400 });
    }

    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      return NextResponse.json({ error: "GOOGLE_CLOUD_API_KEY가 설정되지 않았습니다." }, { status: 500 });
    }

    const requestBody = {
      input: { text },
      voice: {
        languageCode: "ko-KR",
        name: "ko-KR-Chirp3-HD-Charon",
      },
      audioConfig: {
        audioEncoding: "MP3",
      },
    };

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("TTS API error:", errorData);
      throw new Error(`TTS API 오류: ${response.status}`);
    }

    const data = await response.json();
    const audioContent = data.audioContent;

    const audioBuffer = Buffer.from(audioContent, "base64");
    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return NextResponse.json(
      { error: "음성 합성 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
