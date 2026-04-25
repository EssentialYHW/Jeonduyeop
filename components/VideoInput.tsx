"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface VideoInputProps {
  onAnalyze: (text: string) => void;
  isLoading: boolean;
}

type Mode = "file" | "url";

export default function VideoInput({ onAnalyze, isLoading }: VideoInputProps) {
  const [mode, setMode] = useState<Mode>("file");
  const [transcript, setTranscript] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setError("");
    setTranscript("");
  };

  const handleFile = async (file: File) => {
    if (!file) return;
    reset();
    setFileName(file.name);
    setProcessing(true);
    try {
      const formData = new FormData();
      formData.append("audio", file, file.name);
      const res = await fetch("/api/stt", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.text) throw new Error("음성을 인식하지 못했습니다.");
      setTranscript(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "처리 중 오류가 발생했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const handleUrl = async () => {
    if (!url.trim()) return;
    reset();
    setProcessing(true);
    try {
      const res = await fetch("/api/youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.text) throw new Error("영상에서 발화를 추출하지 못했습니다.");
      setTranscript(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "URL 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  const switchMode = (next: Mode) => {
    if (mode === next) return;
    setMode(next);
    reset();
  };

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg">
        <button
          onClick={() => switchMode("file")}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
            mode === "file" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
          }`}
        >
          📁 파일 업로드
        </button>
        <button
          onClick={() => switchMode("url")}
          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
            mode === "url" ? "bg-background shadow-sm font-medium" : "text-muted-foreground"
          }`}
        >
          🔗 YouTube 링크
        </button>
      </div>

      {mode === "file" ? (
        <div
          className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*,audio/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="text-3xl mb-2">{processing ? "⏳" : "🎬"}</div>
          <p className="text-sm text-muted-foreground">
            {processing
              ? "음성 추출 중..."
              : fileName || "영상/음성 파일을 드래그하거나 클릭해서 업로드"}
          </p>
          <p className="text-[11px] text-muted-foreground mt-1">MP4, MOV, AVI, MP3, WAV</p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUrl();
              }}
              placeholder="https://youtube.com/watch?v=..."
              disabled={processing}
              className="flex-1 px-3 py-2 text-sm rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50"
            />
            <Button onClick={handleUrl} disabled={!url.trim() || processing} size="default">
              {processing ? "⏳" : "분석"}
            </Button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center">
            🤖 Gemini가 영상 내용을 직접 받아씁니다 (10초~1분 정도 소요)
          </p>
        </div>
      )}

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {transcript && (
        <div className="space-y-2">
          <div className="p-3 bg-muted rounded-lg text-sm max-h-32 overflow-y-auto">
            <span className="text-xs text-muted-foreground block mb-1">📝 추출된 발화</span>
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
