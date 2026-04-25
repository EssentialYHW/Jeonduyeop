"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TextInput from "./TextInput";
import VoiceInput from "./VoiceInput";
import VideoInput from "./VideoInput";
import ConversationInput from "./ConversationInput";

export type InputSource = "text" | "voice" | "video" | "conversation";

interface InputSelectorProps {
  onAnalyze: (text: string, source: InputSource) => void;
  isLoading: boolean;
}

export default function InputSelector({ onAnalyze, isLoading }: InputSelectorProps) {
  return (
    <Tabs defaultValue="text">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="text" className="text-xs">✏️ 텍스트</TabsTrigger>
        <TabsTrigger value="voice" className="text-xs">🎤 음성</TabsTrigger>
        <TabsTrigger value="video" className="text-xs">🎬 영상</TabsTrigger>
        <TabsTrigger value="conversation" className="text-xs">💬 대화</TabsTrigger>
      </TabsList>
      <TabsContent value="text" className="mt-4">
        <TextInput onAnalyze={(t) => onAnalyze(t, "text")} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="voice" className="mt-4">
        <VoiceInput onAnalyze={(t) => onAnalyze(t, "voice")} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="video" className="mt-4">
        <VideoInput onAnalyze={(t) => onAnalyze(t, "video")} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="conversation" className="mt-4">
        <ConversationInput onAnalyze={(t) => onAnalyze(t, "conversation")} isLoading={isLoading} />
      </TabsContent>
    </Tabs>
  );
}
