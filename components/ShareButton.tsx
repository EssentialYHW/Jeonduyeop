"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnalysisResult, ConversationResult } from "@/types";

interface ShareButtonProps {
  result: AnalysisResult | ConversationResult;
  type: "analysis" | "conversation";
  text?: string;
}

export default function ShareButton({ result, type, text }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const handleShare = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result, type, text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const shareUrl = `${window.location.origin}${data.url}`;
      await navigator.clipboard.writeText(shareUrl);
      setStatus("done");
      setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2000);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-7 px-2 text-xs"
      onClick={handleShare}
      disabled={status === "loading"}
      title="링크 공유"
    >
      {status === "loading" && "⏳"}
      {status === "done" && "✅ 복사됨"}
      {status === "error" && "❌ 실패"}
      {status === "idle" && "🔗 공유"}
    </Button>
  );
}
