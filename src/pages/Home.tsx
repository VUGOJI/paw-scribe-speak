import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Volume2, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import RecordButton from "@/components/RecordButton";
import PetAnimation from "@/components/PetAnimation";
import TreatPoints from "@/components/TreatPoints";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";
import heroBackground from "@/assets/hero-background.png";

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [currentPet] = useState<"dog" | "cat" | "bird">("dog");
  const [treatPoints] = useState(1247);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartRecording = () => {
    setIsRecording(true);
    toast({
      title: "Recording started! 🎤",
      description: "Listening to your pet...",
    });
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    // Simulate processing time
    setTimeout(() => {
      navigate("/result", { 
        state: { 
          translation: "I'm so hungry! Where are my treats, human?",
          petType: currentPet,
          isNew: true
        }
      });
    }, 1500);
    
    toast({
      title: "Processing... 🧠",
      description: "Translating your pet's message!",
    });
  };

  const quickModes = [
    { emoji: "🍖", label: "Hungry", color: "bg-pet-orange" },
    { emoji: "🎾", label: "Playful", color: "bg-primary" },
    { emoji: "😾", label: "Moody", color: "bg-pet-purple" },
    { emoji: "💤", label: "Sleepy", color: "bg-secondary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pet Translator</h1>
          <p className="text-sm text-muted-foreground">What's your pet saying?</p>
        </div>
        <TreatPoints points={treatPoints} />
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
                className={`h-16 flex flex-col gap-1 ${mode.color} text-white border-none hover:opacity-90 transition-all duration-300`}
                onClick={() => {
                  navigate("/result", { 
                    state: { 
                      translation: `I'm feeling ${mode.label.toLowerCase()}!`,
                      petType: currentPet,
                      mode: mode.label.toLowerCase(),
                      isNew: true
                    }
                  });
                }}
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