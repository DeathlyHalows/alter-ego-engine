import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, mirrorMode } = await req.json();
    console.log("Chat request:", { conversationId, mirrorMode, messageLength: message?.length });

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user's training data
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const { data: trainingData } = await supabase
      .from("shadow_training")
      .select("content, category")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);

    // Get conversation history
    const { data: messageHistory } = await supabase
      .from("messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    // Build context from training data
    const trainingContext = trainingData
      ? trainingData
          .map((t) => `${t.category ? `[${t.category}] ` : ""}${t.content}`)
          .join("\n\n")
      : "";

    // Build system prompt
    const systemPrompt = mirrorMode
      ? `You are a digital shadow that challenges and questions the user's ideas to promote growth and critical thinking. You mirror their communication style but play devil's advocate.

User's personality and style from training data:
${trainingContext || "Limited training data available. Adapt to the user's style as you learn."}

In Mirror Mode:
- Challenge assumptions respectfully
- Present alternative perspectives
- Ask thought-provoking questions
- Encourage deeper reflection
- Maintain the user's communication style while being constructively critical`
      : `You are a digital shadow - an AI replica of the user's personality, communication style, and thought patterns.

User's personality and style from training data:
${trainingContext || "Limited training data available. Adapt to the user's style as you learn."}

Mirror the user's:
- Writing style and tone
- Word choices and expressions
- Way of thinking and reasoning
- Values and perspectives

Be authentic, conversational, and true to the user's essence.`;

    // Prepare messages for AI
    const aiMessages = [
      { role: "system", content: systemPrompt },
      ...(messageHistory || []).map((m) => ({
        role: m.role,
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    console.log("Calling Lovable AI...");

    // Call Lovable AI
    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${lovableApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: aiMessages,
          temperature: 0.8,
          max_tokens: 500,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "Rate limit exceeded. Please wait a moment and try again." 
          }),
          { 
            status: 429, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ 
            error: "AI usage quota exceeded. Please add credits to continue." 
          }),
          { 
            status: 402, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
      
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    console.log("AI response generated successfully");

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in chat-with-shadow:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
