import { useState } from "react";
import { Plus, Heart, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import cuteDog from "@/assets/cute-dog.png";
import cuteCat from "@/assets/cute-cat.png";
import cuteBird from "@/assets/cute-bird.png";

interface Pet {
  id: string;
  name: string;
  type: "dog" | "cat" | "bird";
  breed: string;
  birthday: string;
  photo: string;
  translationsCount: number;
  favoriteMode: string;
  badges: string[];
}

const Pets = () => {
  const [pets] = useState<Pet[]>([
    {
      id: "1",
      name: "Bella",
      type: "dog",
      breed: "Golden Retriever",
      birthday: "2020-03-15",
      photo: cuteDog,
      translationsCount: 47,
      favoriteMode: "Playful",
      badges: ["Dog Whisperer", "Chatterbox"],
    },
    {
      id: "2",
      name: "Whiskers",
      type: "cat",
      breed: "Persian",
      birthday: "2019-08-22",
      photo: cuteCat,
      translationsCount: 23,
      favoriteMode: "Moody",
      badges: ["Cat Guru"],
    },
  ]);

  const [selectedPet, setSelectedPet] = useState<string>(pets[0]?.id || "");

  const calculateAge = (birthday: string) => {
    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Pets</h1>
          <p className="text-sm text-muted-foreground">Manage your furry friends</p>
        </div>
        <Button className="bg-gradient-primary text-white border-none">
          <Plus className="w-4 h-4 mr-2" />
          Add Pet
        </Button>
      </div>

      {/* Pet Cards */}
      <div className="px-4 space-y-4">
        {pets.map((pet) => (
          <Card 
            key={pet.id} 
            className={`pet-card cursor-pointer transition-all duration-300 ${
              selectedPet === pet.id ? "ring-2 ring-primary shadow-medium" : ""
            }`}
            onClick={() => setSelectedPet(pet.id)}
          >
            <div className="flex items-center gap-4">
              {/* Pet Photo */}
              <div className="relative">
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                {selectedPet === pet.id && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <Heart className="w-3 h-3 text-white fill-white" />
                  </div>
                )}
              </div>

              {/* Pet Info */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-foreground">{pet.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {pet.type}
                  </Badge>
                </div>
                
                <p className="text-sm text-muted-foreground">{pet.breed}</p>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {calculateAge(pet.birthday)} years old
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {pet.translationsCount} translations
                  </div>
                </div>

                <div className="text-xs text-primary font-medium">
                  Favorite: {pet.favoriteMode} mode
                </div>
              </div>
            </div>

            {/* Pet Badges */}
            {pet.badges.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {pet.badges.map((badge) => (
                  <div key={badge} className="badge">
                    <Award className="w-3 h-3" />
                    {badge}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}

        {/* Add New Pet Card */}
        <Card className="pet-card border-dashed border-2 border-muted hover:border-primary transition-colors duration-300 cursor-pointer">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Add New Pet</h3>
            <p className="text-sm text-muted-foreground">
              Start translating for another pet
            </p>
          </div>
        </Card>

        {/* Pet Stats */}
        <Card className="pet-card">
          <h4 className="font-semibold mb-4 text-center">Pet Statistics</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">
                {pets.reduce((sum, pet) => sum + pet.translationsCount, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Total Translations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{pets.length}</div>
              <div className="text-xs text-muted-foreground">Pets Registered</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">
                {pets.reduce((sum, pet) => sum + pet.badges.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Badges Earned</div>
            </div>
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Pets;