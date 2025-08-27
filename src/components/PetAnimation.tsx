import { useState, useEffect } from "react";
import cuteDog from "@/assets/cute-dog.png";
import cuteCat from "@/assets/cute-cat.png";
import cuteBird from "@/assets/cute-bird.png";

interface PetAnimationProps {
  petType?: "dog" | "cat" | "bird";
  isListening?: boolean;
  className?: string;
}

const PetAnimation = ({ petType = "dog", isListening = false, className = "" }: PetAnimationProps) => {
  const [animationClass, setAnimationClass] = useState("");

  const petImages = {
    dog: cuteDog,
    cat: cuteCat,
    bird: cuteBird,
  };

  useEffect(() => {
    if (isListening) {
      setAnimationClass("pet-animation bounce");
    } else {
      setAnimationClass("pet-animation wiggle");
    }
  }, [isListening]);

  return (
    <div className={`flex justify-center ${className}`}>
      <img
        src={petImages[petType]}
        alt={`Cute ${petType}`}
        className={`w-32 h-32 object-contain ${animationClass}`}
      />
    </div>
  );
};

export default PetAnimation;