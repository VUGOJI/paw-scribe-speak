import { useState } from "react";
import { Check, Crown, Star, Zap, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import Navigation from "@/components/Navigation";

const Premium = () => {
  const [isYearly, setIsYearly] = useState(false);

  const features = [
    {
      icon: Zap,
      title: "Unlimited Translations",
      description: "No daily limits - translate as much as you want!",
      free: "3 per day",
      premium: "Unlimited",
    },
    {
      icon: Share2,
      title: "No Watermark",
      description: "Share clean, professional results",
      free: "With watermark",
      premium: "Clean shares",
    },
    {
      icon: Star,
      title: "Premium Voices",
      description: "Celebrity & character voice options",
      free: "1 voice",
      premium: "20+ voices",
    },
    {
      icon: Heart,
      title: "Pet Horoscope",
      description: "Daily personality insights for your pets",
      free: "Not included",
      premium: "Daily horoscope",
    },
    {
      icon: Crown,
      title: "Exclusive Badges",
      description: "Unlock special achievements and rewards",
      free: "Basic badges",
      premium: "Exclusive badges",
    },
  ];

  const monthlyPrice = 4.99;
  const yearlyPrice = 39.99;
  const yearlyMonthlyEquivalent = yearlyPrice / 12;
  const savings = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <div className="text-center p-4 pt-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pet-orange to-accent rounded-full flex items-center justify-center">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Go Premium</h1>
        <p className="text-muted-foreground">
          Unlock unlimited translations and exclusive features
        </p>
      </div>

      {/* Pricing Toggle */}
      <div className="px-4 mb-6">
        <Card className="pet-card">
          <div className="flex items-center justify-center gap-4">
            <span className={`font-medium ${!isYearly ? 'text-primary' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`font-medium ${isYearly ? 'text-primary' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            {isYearly && (
              <div className="bg-success text-white px-2 py-1 rounded-full text-xs font-medium">
                Save {savings}%
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Pricing Card */}
      <div className="px-4 mb-6">
        <Card className="pet-card premium-glow border-2 border-accent/20">
          <div className="text-center space-y-4">
            <div className="text-4xl font-bold text-foreground">
              ${isYearly ? yearlyMonthlyEquivalent.toFixed(2) : monthlyPrice}
              <span className="text-lg font-normal text-muted-foreground">
                /month
              </span>
            </div>
            
            {isYearly && (
              <div className="text-sm text-muted-foreground">
                Billed annually (${yearlyPrice}/year)
              </div>
            )}

            <Button className="w-full premium-glow text-white border-none text-lg py-6">
              <Crown className="w-5 h-5 mr-2" />
              Start Premium
            </Button>

            <p className="text-xs text-muted-foreground">
              Cancel anytime • 7-day free trial
            </p>
          </div>
        </Card>
      </div>

      {/* Features Comparison */}
      <div className="px-4 space-y-3">
        <h3 className="text-lg font-semibold text-center mb-4">Premium Features</h3>
        
        {features.map((feature) => (
          <Card key={feature.title} className="pet-card">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-foreground">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
                
                <div className="flex justify-between text-xs">
                  <div>
                    <span className="text-muted-foreground">Free: </span>
                    <span className="text-destructive">{feature.free}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Premium: </span>
                    <span className="text-success font-medium">{feature.premium}</span>
                  </div>
                </div>
              </div>
              
              <Check className="w-5 h-5 text-success flex-shrink-0" />
            </div>
          </Card>
        ))}
      </div>

      {/* Testimonial */}
      <div className="px-4 mt-6">
        <Card className="pet-card bg-gradient-to-br from-primary-soft to-secondary-soft">
          <div className="text-center space-y-3">
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-accent fill-accent" />
              ))}
            </div>
            <p className="text-sm italic text-foreground">
              "Finally understand what Buddy is really thinking! The premium voices are hilarious."
            </p>
            <p className="text-xs text-muted-foreground">- Sarah M., Dog Mom</p>
          </div>
        </Card>
      </div>

      <Navigation />
    </div>
  );
};

export default Premium;