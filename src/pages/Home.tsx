import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RecordButton from "@/components/RecordButton";
import PetAnimation from "@/components/PetAnimation";
import TreatPoints from "@/components/TreatPoints";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { useTranslatePetSound } from "@/hooks/useTranslations";
import { usePets } from "@/hooks/usePets";

const Home = () => {
  const [currentPet, setCurrentPet] = useState<"dog" | "cat" | "bird">("dog");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: pets } = usePets();
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useAudioRecorder();
  const translateMutation = useTranslatePetSound();

  const handleStartRecording = async () => {
    await startRecording();
    toast({
      title: "Recording started! 🎤",
      description: "Listening to your pet...",
    });
  };

  const handleStopRecording = async () => {
    stopRecording();
    
    toast({
      title: "Processing... 🧠",
      description: "Translating your pet's message!",
    });

    // Wait a bit for the blob to be ready
    setTimeout(async () => {
      if (audioBlob) {
        try {
          // Convert blob to base64
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            const base64Data = base64Audio.split(',')[1];
            
            const activePet = pets?.find(p => p.type === currentPet) || pets?.[0];
            
            const result = await translateMutation.mutateAsync({
              petType: currentPet,
              petId: activePet?.id || 'default',
              audioData: base64Data,
            });

            clearRecording();
            navigate("/result", { 
              state: { 
                translation: result.translation,
                petType: currentPet,
                confidence: result.confidence,
                audioUrl: result.audioUrl,
                isNew: true
              }
            });
          };
        } catch (error) {
          console.error('Translation error:', error);
        }
      }
    }, 500);
  };

  const quickModes = [
    { emoji: "🍖", label: "Hungry", mode: "hungry", color: "bg-pet-orange" },
    { emoji: "🎾", label: "Playful", mode: "playful", color: "bg-primary" },
    { emoji: "😾", label: "Moody", mode: "moody", color: "bg-pet-purple" },
    { emoji: "💤", label: "Sleepy", mode: "sleepy", color: "bg-secondary" },
  ];

  const handleQuickMode = async (mode: string) => {
    try {
      const activePet = pets?.find(p => p.type === currentPet) || pets?.[0];
      
      toast({
        title: "Translating... 🧠",
        description: `Understanding your ${currentPet}'s ${mode} mood...`,
      });

      const result = await translateMutation.mutateAsync({
        petType: currentPet,
        petId: activePet?.id || 'default',
        mode: mode,
      });

      navigate("/result", { 
        state: { 
          translation: result.translation,
          petType: currentPet,
          mode: mode,
          confidence: result.confidence,
          isNew: true
        }
      });
    } catch (error) {
      console.error('Quick mode error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pet Translator</h1>
          <p className="text-sm text-muted-foreground">What's your pet saying?</p>
        </div>
        <TreatPoints points={1247} />
      </div>

      {/* Pet Selector */}
      <div className="flex justify-center gap-3 px-4 mt-4">
        {(['dog', 'cat', 'bird'] as const).map((pet) => (
          <Button
            key={pet}
            variant={currentPet === pet ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPet(pet)}
            className="capitalize"
          >
            {pet === 'dog' && '🐕'} {pet === 'cat' && '🐱'} {pet === 'bird' && '🐦'} {pet}
          </Button>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 space-y-8">
        {/* Pet Animation */}
        <PetAnimation 
          petType={currentPet} 
          isListening={isRecording}
          className="mt-8"
        />

        {/* Record Button */}
        <RecordButton
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          isRecording={isRecording}
        />

        {/* Quick Translation Modes */}
        <div className="w-full max-w-sm">
          <h3 className="text-lg font-semibold text-center mb-4">Quick Modes</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickModes.map((mode) => (
              <Button
                key={mode.label}
                variant="outline"
                disabled={translateMutation.isPending}
                className={`h-16 flex flex-col gap-1 ${mode.color} text-white border-none hover:opacity-90 transition-all duration-300 disabled:opacity-50`}
                onClick={() => handleQuickMode(mode.mode)}
              >
                <span className="text-2xl">{mode.emoji}</span>
                <span className="text-sm font-medium">{mode.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Daily Stats */}
        <Card className="pet-card w-full max-w-sm">
          <div className="text-center">
            <h4 className="font-semibold mb-2">Today's Translations</h4>
            <div className="flex justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">7</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">3</div>
                <div className="text-xs text-muted-foreground">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">12</div>
                <div className="text-xs text-muted-foreground">Points Earned</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Home;