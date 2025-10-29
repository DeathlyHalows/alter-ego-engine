import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, Brain, MessageSquare, Sparkles } from "lucide-react";

interface PersonalityDashboardProps {
  userId: string;
}

const PersonalityDashboard = ({ userId }: PersonalityDashboardProps) => {
  const [stats, setStats] = useState({
    trainingDataCount: 0,
    conversationCount: 0,
    messageCount: 0,
  });

  useEffect(() => {
    loadStats();
  }, [userId]);

  const loadStats = async () => {
    const [trainingData, conversations, messages] = await Promise.all([
      supabase.from("shadow_training").select("*", { count: "exact" }).eq("user_id", userId),
      supabase.from("conversations").select("*", { count: "exact" }).eq("user_id", userId),
      supabase
        .from("messages")
        .select("*, conversations!inner(user_id)", { count: "exact" })
        .eq("conversations.user_id", userId),
    ]);

    setStats({
      trainingDataCount: trainingData.count || 0,
      conversationCount: conversations.count || 0,
      messageCount: messages.count || 0,
    });
  };

  const trainingProgress = Math.min((stats.trainingDataCount / 10) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-primary neon-text" />
          <div>
            <h2 className="text-xl font-bold">Shadow Insights</h2>
            <p className="text-sm text-muted-foreground">Your digital twin's development</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">{stats.trainingDataCount}</p>
                <p className="text-sm text-muted-foreground">Training Samples</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-2xl font-bold">{stats.conversationCount}</p>
                <p className="text-sm text-muted-foreground">Conversations</p>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.messageCount}</p>
                <p className="text-sm text-muted-foreground">Total Messages</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="font-medium">Shadow Training Progress</p>
            <p className="text-sm text-muted-foreground">{Math.round(trainingProgress)}%</p>
          </div>
          <Progress value={trainingProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {stats.trainingDataCount < 10
              ? `Add ${10 - stats.trainingDataCount} more samples to fully train your shadow`
              : "Your shadow is well-trained!"}
          </p>
        </div>
      </Card>

      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          About Your Shadow
        </h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Your digital shadow learns from every interaction and training sample you provide. The
            more you interact, the better it understands your unique personality, communication
            style, and decision-making patterns.
          </p>
          <p>
            <strong className="text-foreground">Mirror Mode:</strong> When enabled, your shadow
            challenges your perspectives and encourages critical thinking, helping you grow through
            thoughtful debate.
          </p>
          <p>
            <strong className="text-foreground">Privacy:</strong> All your data is encrypted and
            securely stored. Only you can access your shadow and training data.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default PersonalityDashboard;
