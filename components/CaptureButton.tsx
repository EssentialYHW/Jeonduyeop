"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";

interface CaptureButtonProps {
  targetId: string;
  filename?: string;
}

export default function CaptureButton({ targetId, filename = "전두엽-분석결과" }: CaptureButtonProps) {
  const [busy, setBusy] = useState(false);

  const handleCapture = async () => {
    const node = document.getElementById(targetId);
    if (!node) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(node, {
        backgroundColor: getComputedStyle(document.body).backgroundColor,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${filename}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("Capture failed:", e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button onClick={handleCapture} disabled={busy} variant="outline" size="sm" className="text-xs">
      {busy ? "📸 캡처 중..." : "📸 이미지로 저장"}
    </Button>
  );
}
