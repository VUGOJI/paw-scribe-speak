import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Volume2, Share2, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import PetAnimation from "@/components/PetAnimation";
import Navigation from "@/components/Navigation";
import { useToast } from "@/hooks/use-toast";

const TranslationResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);

  const { translation, petType = "dog", mode, isNew } = location.state || {};

  useEffect(() => {
    // If no translation data, redirect to home
    if (!translation) {
      navigate("/");
      return;
    }

    // Show celebration toast for new translations
    if (isNew) {
      toast({
        title: "Translation complete! 🎉",
        description: "Your pet has spoken!",
      });
    }
  }, [translation, navigate, isNew, toast]);

  const handlePlayAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => setIsPlaying(false), 3000);
    
    toast({
      title: "Playing translation 🔊",
      description: "Listen to what your pet is saying!",
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Pet Translator",
        text: `My pet says: "${translation}"`,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers without native sharing
      navigator.clipboard.writeText(`My pet says: "${translation}"`);
      toast({
        title: "Copied to clipboard! 📋",
        description: "Share your pet's message with friends!",
      });
    }
  };

  const handleTryAgain = () => {
    navigate("/");
  };

  if (!translation) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" onClick={() => navigate("/")} className="p-2">
          <Home className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold">Translation Result</h1>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center px-4 space-y-6">
        {/* Pet Animation */}
        <PetAnimation 
          petType={petType} 
          isListening={false}
          className="mt-4"
        />

        {/* Translation Card */}
        <Card className="pet-card w-full max-w-md animate-fade-in-up">
          <div className="text-center space-y-4">
            <div className="text-lg font-semibold text-muted-foreground">
              Your {petType} says:
            </div>
            
            <div className="text-xl font-bold text-foreground leading-relaxed">
              "{translation}"
            </div>

            {mode && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary-soft rounded-full">
                <span className="text-sm font-medium text-primary">
                  {mode.charAt(0).toUpperCase() + mode.slice(1)} Mode
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full max-w-md">
          <Button
            onClick={handlePlayAudio}
            disabled={isPlaying}
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-white border-none hover:opacity-90"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isPlaying ? "Playing..." : "Play Audio"}
          </Button>
          
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Try Again Button */}
        <Button
          onClick={handleTryAgain}
          variant="outline"
          className="w-full max-w-md"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Try Another Translation
        </Button>

        {/* Fun Facts */}
        <Card className="pet-card w-full max-w-md">
          <div className="text-center space-y-2">
            <h4 className="font-semibold text-primary">Did you know?</h4>
            <p className="text-sm text-muted-foreground">
              {petType === "dog" && "Dogs can understand up to 250 words and gestures! 🐕"}
              {petType === "cat" && "Cats have over 100 vocal sounds, while dogs only have 10! 🐱"}
              {petType === "bird" && "Some birds can learn and mimic human speech perfectly! 🦜"}
            </p>
          </div>
        </Card>

        {/* Earn Points Notification */}
        <div className="bg-gradient-to-r from-accent-soft to-accent text-accent-foreground px-4 py-3 rounded-lg w-full max-w-md text-center">
          <div className="text-sm font-medium">
            🎉 You earned 10 Treat Points!
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default TranslationResult;