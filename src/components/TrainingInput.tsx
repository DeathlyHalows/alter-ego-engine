import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Brain, Plus } from "lucide-react";

interface TrainingInputProps {
  userId: string;
}

const TrainingInput = ({ userId }: TrainingInputProps) => {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("shadow_training").insert({
        user_id: userId,
        content: content.trim(),
        category: category.trim() || null,
      });

      if (error) throw error;

      toast({
        title: "Training data added!",
        description: "Your shadow is learning from this input.",
      });

      setContent("");
      setCategory("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-6 h-6 text-primary neon-text" />
          <div>
            <h2 className="text-xl font-bold">Train Your Shadow</h2>
            <p className="text-sm text-muted-foreground">
              Share your thoughts, writing style, and personality
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              placeholder="e.g., Personal thoughts, Work style, Beliefs..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your Input</Label>
            <Textarea
              id="content"
              placeholder="Share anything: your thoughts, writing samples, decision-making patterns, favorite quotes, or perspectives on topics..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !content.trim()}
            variant="hero"
          >
            <Plus className="w-4 h-4 mr-2" />
            {loading ? "Adding..." : "Add Training Data"}
          </Button>
        </form>
      </Card>

      <Card className="glass-card p-6">
        <h3 className="font-semibold mb-3">Training Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Share authentic content that represents your personality</li>
          <li>• Include various writing samples (emails, thoughts, stories)</li>
          <li>• Describe how you make decisions and solve problems</li>
          <li>• Add your values, beliefs, and perspectives</li>
          <li>• The more diverse your input, the better your shadow learns</li>
        </ul>
      </Card>
    </div>
  );
};

export default TrainingInput;
