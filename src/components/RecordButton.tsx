import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecordButtonProps {
  onStartRecording: () => Promise<void>;
  onStopRecording: () => Promise<void>;
  isRecording: boolean;
}

const RecordButton = ({ onStartRecording, onStopRecording, isRecording }: RecordButtonProps) => {
  const handleClick = async () => {
    if (isRecording) {
      await onStopRecording();
    } else {
      await onStartRecording();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        className={cn(
          "record-button flex items-center justify-center relative overflow-hidden",
          isRecording && "animate-pulse-soft"
        )}
      >
        {/* Animated ripple effect when recording */}
        {isRecording && (
          <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
        )}
        
        {isRecording ? (
          <Square className="w-8 h-8 text-white fill-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>
      
      <p className="text-sm text-muted-foreground font-medium">
        {isRecording ? "Tap to stop recording" : "Tap to start recording"}
      </p>
    </div>
  );
};

export default RecordButton;