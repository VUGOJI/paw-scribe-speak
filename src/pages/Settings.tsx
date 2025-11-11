import { Bell, HelpCircle, Share2, Star, Crown, LogOut, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import TreatPoints from "@/components/TreatPoints";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "Come back soon! 👋",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };
  const settingsGroups = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Profile",
          description: "Manage your account details",
          action: "navigate",
        },
        {
          icon: Crown,
          label: "Premium Status",
          description: "Free Plan • Upgrade to Premium",
          action: "navigate",
          highlight: true,
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          description: "Control your data and privacy",
          action: "navigate",
        },
      ],
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Push Notifications",
          description: "Get notified about translations",
          action: "toggle",
          enabled: true,
        },
        {
          icon: Star,
          label: "Achievement Alerts",
          description: "Celebrate new badges and milestones",
          action: "toggle",
          enabled: true,
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help & FAQ",
          description: "Get answers to common questions",
          action: "navigate",
        },
        {
          icon: Share2,
          label: "Share Pet Translator",
          description: "Tell your friends about the app",
          action: "share",
        },
        {
          icon: Star,
          label: "Rate the App",
          description: "Leave a review in the App Store",
          action: "rate",
        },
      ],
    },
  ];

  const handleItemClick = (action: string, label: string) => {
    switch (action) {
      case "share":
        if (navigator.share) {
          navigator.share({
            title: "Pet Translator App",
            text: "Check out this amazing app that translates what your pets are saying!",
            url: window.location.origin,
          });
        }
        break;
      case "rate":
        // Open app store rating (would be platform-specific in a real app)
        window.open("https://apps.apple.com", "_blank");
        break;
      default:
        console.log(`Navigate to ${label}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>
        <TreatPoints points={1247} />
      </div>

      {/* User Info Card */}
      <div className="px-4 mb-6">
        <Card className="pet-card">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {user?.user_metadata?.display_name || user?.user_metadata?.username || "Pet Parent"}
              </h3>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-primary">Free Plan</div>
              <div className="text-xs text-muted-foreground">2/3 daily translations</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Settings Groups */}
      <div className="px-4 space-y-6">
        {settingsGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-lg font-semibold text-foreground mb-3">{group.title}</h3>
            <Card className="pet-card p-0 overflow-hidden">
              {group.items.map((item, index) => (
                <div key={item.label}>
                  <div
                    className={`flex items-center gap-4 p-4 transition-colors duration-200 ${
                      item.action !== "toggle" ? "hover:bg-muted/50 cursor-pointer" : ""
                    } ${item.highlight ? "bg-primary-soft/20" : ""}`}
                    onClick={() => item.action !== "toggle" && handleItemClick(item.action, item.label)}
                  >
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <item.icon className={`w-5 h-5 ${item.highlight ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className={`font-medium ${item.highlight ? "text-primary" : "text-foreground"}`}>
                        {item.label}
                        {item.highlight && <Crown className="w-4 h-4 inline ml-1 text-accent" />}
                      </h4>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    
                    {item.action === "toggle" && (
                      <Switch
                        checked={item.enabled}
                        onCheckedChange={() => {}}
                        className="data-[state=checked]:bg-primary"
                      />
                    )}
                  </div>
                  
                  {index < group.items.length - 1 && <Separator />}
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      {/* Sign Out */}
      <div className="px-4 mt-8">
        <Button
          variant="outline"
          className="w-full text-destructive border-destructive hover:bg-destructive hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>

      {/* App Version */}
      <div className="text-center mt-6 mb-8">
        <p className="text-xs text-muted-foreground">
          Pet Translator v1.0.0
        </p>
      </div>

      <Navigation />
    </div>
  );
};

export default Settings;