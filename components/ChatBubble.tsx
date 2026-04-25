"use client";

interface UserBubbleProps {
  text: string;
  source?: "text" | "voice" | "video" | "conversation";
  translatedFrom?: string;
}

const SOURCE_ICON: Record<string, string> = { text: "✏️", voice: "🎤", video: "🎬", conversation: "💬" };

export function UserBubble({ text, source = "text", translatedFrom }: UserBubbleProps) {
  return (
    <div className="flex justify-end">
      <div className="flex items-end gap-1 max-w-[80%]">
        <span className="text-[10px] text-muted-foreground mb-1">읽음</span>
        <div className="bg-yellow-300 dark:bg-yellow-400 text-slate-900 px-3 py-2 rounded-2xl rounded-br-sm shadow-sm">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-xs text-slate-700/70">{SOURCE_ICON[source]} 내가 보낸 말</p>
            {translatedFrom && (
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-200 text-blue-800 rounded-full font-medium">
                🌐 {translatedFrom.toUpperCase()} → KO
              </span>
            )}
          </div>
          <p className="text-sm leading-snug whitespace-pre-wrap break-words">{text}</p>
        </div>
      </div>
    </div>
  );
}

interface AssistantBubbleProps {
  emoji: string;
  speakerType: string;
  children: React.ReactNode;
}

export function AssistantBubble({ emoji, speakerType, children }: AssistantBubbleProps) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-10 h-10 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center text-xl shrink-0 shadow-sm">
        {emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground mb-1 ml-1">전두엽 — {speakerType} 분석</p>
        <div className="space-y-2 max-w-[92%]">{children}</div>
      </div>
    </div>
  );
}

export function TypingBubble({ phrase }: { phrase: string }) {
  return (
    <div className="flex gap-2 items-start">
      <div className="w-10 h-10 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center text-xl shrink-0 shadow-sm">
        🧠
      </div>
      <div className="bg-card border rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
          <span className="text-sm text-muted-foreground">{phrase}</span>
        </div>
      </div>
    </div>
  );
}
