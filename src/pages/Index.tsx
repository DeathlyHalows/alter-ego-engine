import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Brain, MessageSquare, Sparkles, Lock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkSession();
  }, [navigate]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10" />

        <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
          <Shield className="w-24 h-24 mx-auto text-primary neon-text animate-pulse" />

          <h1 className="text-5xl md:text-7xl font-bold gradient-text mb-4">ShadowMe</h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Create your intelligent digital shadow that learns, mirrors, and evolves with you
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              variant="hero"
              onClick={() => navigate("/auth")}
              className="hover-glow"
            >
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 gradient-text">
            Three Core Powers
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="glass-card p-6 hover-glow">
              <Brain className="w-12 h-12 text-accent mb-4" />
              <h3 className="text-xl font-bold mb-3">Learn Your Essence</h3>
              <p className="text-muted-foreground">
                Feed your shadow with text samples, thoughts, and preferences. Watch it absorb your
                unique personality and communication style.
              </p>
            </Card>

            <Card className="glass-card p-6 hover-glow">
              <MessageSquare className="w-12 h-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Real Conversations</h3>
              <p className="text-muted-foreground">
                Chat with your digital twin through an intuitive interface. Experience how it
                mirrors your tone, style, and decision-making patterns.
              </p>
            </Card>

            <Card className="glass-card p-6 hover-glow">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Mirror Mode</h3>
              <p className="text-muted-foreground">
                Enable challenge mode where your shadow questions your ideas, encouraging critical
                thinking and personal growth.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <Lock className="w-16 h-16 mx-auto text-primary neon-text mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
            Privacy-First Design
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Your data is encrypted and securely stored. Only you have access to your shadow. We
            never share or sell your personal information.
          </p>
          <Button size="lg" variant="hero" onClick={() => navigate("/auth")}>
            Create Your Shadow
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/30">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 ShadowMe. Your intelligent digital companion.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
