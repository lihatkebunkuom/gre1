import { useState, useEffect } from "react";
import { Play, Square, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TTSProps {
  text: string;
  lang?: string;
  rate?: number; // 0.5 - 2
  autoPlay?: boolean;
}

export const TextToSpeechPlayer = ({ 
  text, 
  lang = "id-ID", 
  rate = 1, 
  autoPlay = false 
}: TTSProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate; // Kecepatan baca
    
    // Event listeners
    u.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };
    
    setUtterance(u);

    // Cleanup
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [text, lang, rate]);

  const handlePlay = () => {
    if (!utterance) return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
    } else {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-full border w-fit">
      {isPlaying ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-500" onClick={handlePause}>
              <Pause className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Jeda</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:text-green-700" onClick={handlePlay}>
              <Play className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Dengarkan</TooltipContent>
        </Tooltip>
      )}

      {(isPlaying || isPaused) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={handleStop}>
              <Square className="h-3 w-3 fill-current" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Berhenti</TooltipContent>
        </Tooltip>
      )}
      
      {!isPlaying && !isPaused && (
         <div className="px-2 text-xs text-muted-foreground flex items-center gap-1">
            <Volume2 className="h-3 w-3" /> TTS
         </div>
      )}
    </div>
  );
};