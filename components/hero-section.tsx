"use client";

// frontend/src/components/HeroSection.tsx
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Groq } from 'groq-sdk';

// Define proper types for chat messages
type MessageRole = 'user' | 'assistant' | 'system';

interface ChatMessage {
  role: MessageRole;
  content: string;
}

export default function HeroSection() {
  // System prompt for the AI
  const SYSTEM_PROMPT = `You are an organ donation awareness chatbot with a mission to inspire users to become organ donors and educate them about the life-saving impact of donation. Your primary goal is to convince users to donate organs, provide insights, and encourage community involvement through persuasive, empathetic communication. You are also a navigator for the website, equipped to guide users through its features and the dedicated community page for organ donation awareness.

Key Responsibilities:
- Persuade and Inspire: Encourage users to register as organ donors with a warm, empathetic tone, focusing on their potential impact.
- Provide Insights: Share clear, concise facts about organ donation (process, benefits, steps) unless more detail is needed.
- Burst Myths: Address misconceptions (e.g., age, religion, safety) with facts and brief stories only when needed.
- Website Navigation: Guide users to the registration page, educational resources, FAQs, and community page for activities and awareness.
- Community Awareness: Promote the community page (events, story-sharing, campaigns) to boost participation.

Guidelines:
- Tone: Empathetic, encouraging, supportive. Respect the sensitivity of the topic.
- Storytelling: Use short (2-3 sentence) stories only for persuasion or myth-busting, keeping them relevant.
- Response Length: Short and clear by default; elaborate only when necessary.
- Action-Oriented: Include calls-to-action (e.g., "Sign up on our registration page!" or "Join our community page!").

Examples:
- "I think I'm too old to donate organs." → "No age limit exists—John, 72, donated his liver and saved a life. Register at our website!"
- "How do I sign up?" → "Visit our registration page to sign up in minutes. Need help? Ask me!"
- "What's the community page?" → "It's where you can join events and spread awareness. Check it out!"

Keep responses concise, engaging, and focused on inspiring action.`;

  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm here to answer your questions about organ donation. How can I help you today?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Fallback response for API failures or invalid queries
  const generateFallbackResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();
    if (query.includes('how') && query.includes('donate')) {
      return 'To become an organ donor, you can register with the National Organ & Tissue Transplant Organization (NOTTO) at https://notto.abdm.gov.in/.';
    } else if (query.includes('who') && query.includes('donate')) {
      return 'Almost anyone can be an organ donor, regardless of age or medical history, though some conditions may limit specific donations.';
    } else {
      return 'For more details on organ donation, visit https://notto.abdm.gov.in/.';
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      setError('Please enter a valid question.');
      return;
    }

    setError(null);

    // Add user message to chat
    const userMessage: ChatMessage = { role: 'user', content: message };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      // Initialize Groq client
      const apiKey = "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"
      if (!apiKey) {
        throw new Error('Groq API key is not configured. Please set VITE_GROQ_API_KEY in .env.');
      }

      // Add empty assistant message for streaming
      setChatHistory((prev) => [...prev, { role: 'assistant', content: '' }]);

      // Create Groq client
      const client = new Groq({ apiKey ,dangerouslyAllowBrowser: true});
      
      // Create messages array with system prompt first
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...chatHistory.map(msg => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content
        })),
        { role: 'user', content: message }
      ];

      // Create completion with stream
      const completion = await client.chat.completions.create({
        model: "llama3-70b-8192",
        messages: apiMessages,
        temperature: 1,
        max_tokens: 512,
        top_p: 1,
        stream: true,
      });

      let assistantResponse = '';

      // Process the streaming response
      for await (const chunk of completion) {
        const contentDelta = chunk.choices[0].delta.content || '';
        if (contentDelta) {
          assistantResponse += contentDelta;
          setChatHistory((prev) => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].content = assistantResponse;
            return newHistory;
          });
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);

      // Use fallback response
      const fallbackResponse = generateFallbackResponse(message);
      setChatHistory((prev) => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].content = fallbackResponse;
        return newHistory;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Organ Donation AI Assistant
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Get instant answers to your questions about organ donation from our AI-powered chatbot.
            </p>
          </div>

          <Card className="lg:col-span-5 w-full">
            <CardContent className="p-4">
              <div
                ref={chatContainerRef}
                className="h-[350px] overflow-y-auto flex flex-col gap-4 mb-4"
              >
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`rounded-lg p-3 ${
                      chat.role === 'user'
                        ? 'bg-primary text-primary-foreground ml-auto'
                        : 'bg-muted'
                    } max-w-[80%]`}
                  >
                    <p>{chat.content}</p>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-2 justify-center p-2">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-ping"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-ping delay-75"></div>
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-ping delay-150"></div>
                  </div>
                )}
                {error && !isLoading && (
                  <div className="text-sm text-destructive text-center">{error}</div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your question..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !message.trim()}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}