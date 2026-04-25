import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return NextResponse.json({ error: "오디오 파일이 없습니다." }, { status: 400 });
    }

    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      return NextResponse.json({ error: "GOOGLE_CLOUD_API_KEY가 설정되지 않았습니다." }, { status: 500 });
    }

    const audioBuffer = await audioFile.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    const mimeType = audioFile.type || "audio/webm";
    const encoding = getEncoding(mimeType);

    const requestBody = {
      config: {
        encoding,
        sampleRateHertz: 16000,
        languageCode: "ko-KR",
        model: "chirp_2",
        useEnhanced: true,
      },
      audio: {
        content: audioBase64,
      },
    };

    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("STT API error:", errorData);
      throw new Error(`STT API 오류: ${response.status}`);
    }

    const data = await response.json();
    const transcript = data.results
      ?.map((r: { alternatives?: { transcript?: string }[] }) => r.alternatives?.[0]?.transcript)
      .filter(Boolean)
      .join(" ") || "";

    return NextResponse.json({ text: transcript });
  } catch (error) {
    console.error("STT error:", error);
    return NextResponse.json(
      { error: "음성 인식 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

function getEncoding(mimeType: string): string {
  if (mimeType.includes("webm")) return "WEBM_OPUS";
  if (mimeType.includes("ogg")) return "OGG_OPUS";
  if (mimeType.includes("mp4") || mimeType.includes("m4a")) return "MP4";
  if (mimeType.includes("wav")) return "LINEAR16";
  if (mimeType.includes("flac")) return "FLAC";
  return "WEBM_OPUS";
}
