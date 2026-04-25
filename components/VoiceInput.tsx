"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

type RecordState = "idle" | "recording" | "processing";

export default function VoiceInput({ onAnalyze, isLoading }: VoiceInputProps) {
  const [recordState, setRecordState] = useState<RecordState>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        await sendToSTT(blob);
      };

      mediaRecorder.start();
      setRecordState("recording");
    } catch {
      setError("마이크 접근 권한이 필요합니다.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecordState("processing");
  };

  const sendToSTT = async (blob: Blob) => {
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const res = await fetch("/api/stt", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);
      if (!data.text) throw new Error("음성을 인식하지 못했습니다.");

      setTranscript(data.text);
      setRecordState("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "STT 오류가 발생했습니다.");
      setRecordState("idle");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 py-6">
        <button
          onClick={recordState === "recording" ? stopRecording : startRecording}
          disabled={recordState === "processing" || isLoading}
          className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl transition-all shadow-lg
            ${recordState === "recording"
              ? "bg-red-500 hover:bg-red-600 animate-pulse scale-110"
              : "bg-primary hover:bg-primary/90"
            }
            disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {recordState === "recording" ? "⏹" : recordState === "processing" ? "⏳" : "🎤"}
        </button>
        <p className="text-sm text-muted-foreground">
          {recordState === "recording" ? "녹음 중... 클릭하면 중지" : recordState === "processing" ? "음성 인식 중..." : "버튼을 눌러 녹음 시작"}
        </p>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {transcript && (
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-lg text-sm">
            <span className="text-xs text-muted-foreground block mb-1">인식된 텍스트</span>
            {transcript}
          </div>
          <Button
            onClick={() => onAnalyze(transcript)}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? "분석 중..." : "🔍 번역하기"}
          </Button>
        </div>
      )}
    </div>
  );
}
