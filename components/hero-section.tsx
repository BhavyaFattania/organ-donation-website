"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function HeroSection() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "Hello! I'm here to answer your questions about organ donation. How can I help you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatContainerRef = useRef<HTMLDivElement | null>(null)
  
  // Store your Groq API Key in .env.local - NEVER expose it in client-side code directly
  const GROQ_API_KEY = process.env.NEXT_PUBLIC_GROQ_API_KEY

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  // Fallback function if API is unavailable
  const generateFallbackResponse = (userQuery: string) => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('how') && query.includes('donate')) {
      return "To become an organ donor, you need to register with your national donor registry. In India, you can visit https://notto.abdm.gov.in/ to learn more about the registration process.";
    } else if (query.includes('who') && query.includes('donate')) {
      return "Almost anyone, regardless of age or medical history, can be considered for organ donation. There are very few conditions that would absolutely prevent you from donating some organs and tissues.";
    } else {
      return "I'm an offline organ donation chatbot. For more information, please visit the National Organ & Tissue Transplant Organization (NOTTO) website at https://notto.abdm.gov.in/";
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    setError(null)
    
    // Add user message to chat
    const userMessage = { role: "user", content: message }
    setChatHistory(prev => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)
    
    try {
      // Format history for API - converting 'system' role to 'assistant'
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role === "system" ? "assistant" : msg.role,
        content: msg.content
      }));
      
      // Add the new user message to the formatted history
      formattedHistory.push(userMessage);
      
      // Add empty assistant message to start streaming into
      setChatHistory(prev => [...prev, { role: "assistant", content: "" }])
      
      if (!GROQ_API_KEY) {
        throw new Error("Groq API key is not configured")
      }
      
      // Make direct request to Groq API
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: formattedHistory,
          temperature: 1,
          max_tokens: 1024,
          top_p: 1,
          stream: true
        })
      });
      
      if (!response.ok) {
        throw new Error(`Groq API error: ${response.status}`)
      }
      
      const responseBody = response.body;
      if (!responseBody) {
        throw new Error("Response body is null")
      }
      
      const reader = responseBody.getReader();
      const decoder = new TextDecoder("utf-8");
      let assistantResponse = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Process the streaming response
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim() !== "");
        
        for (const line of lines) {
          // Skip the "data: [DONE]" message
          if (line === "data: [DONE]") continue;
          
          // Remove the "data: " prefix
          const jsonStr = line.replace(/^data: /, "").trim();
          
          try {
            if (jsonStr) {
              const json = JSON.parse(jsonStr);
              const contentDelta = json.choices[0]?.delta?.content || "";
              if (contentDelta) {
                assistantResponse += contentDelta;
                
                // Update the last message in chatHistory (which is the assistant's response)
                setChatHistory(prev => {
                  const newHistory = [...prev];
                  newHistory[newHistory.length - 1].content = assistantResponse;
                  return newHistory;
                });
              }
            }
          } catch (e) {
            console.error("Error parsing JSON from stream:", e);
          }
        }
      }
      
    } catch (err: unknown) {
      console.error("Chat error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      
      // Use fallback if API fails
      const fallbackResponse = generateFallbackResponse(message);
      setChatHistory(prev => {
        // Replace the empty assistant message with fallback
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].content = `[API Error: ${errorMessage}] ${fallbackResponse}`;
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
                      chat.role === "user" 
                        ? "bg-primary text-primary-foreground ml-auto" 
                        : "bg-muted"
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
                  <div className="text-sm text-destructive text-center">
                    {error}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
  )
}