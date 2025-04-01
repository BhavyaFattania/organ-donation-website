"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content: "Hello! I'm here to answer your questions about organ donation. How can I help you today?",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const chatContainerRef = useRef(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatHistory])

  // Fallback function if API is unavailable
  const generateFallbackResponse = (userQuery) => {
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
    const userQuery = message;
    setChatHistory(prev => [...prev, userMessage])
    setMessage("")
    setIsLoading(true)

    try {
      // Format history for API - converting 'system' role to 'assistant'
      const formattedHistory = chatHistory.map(msg => ({
        role: msg.role === "system" ? "assistant" : msg.role,
        content: msg.content
      }));

      console.log("Sending request with:", {
        message: userQuery,
        historyLength: formattedHistory.length
      })

      // Make API call to Flask backend
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userQuery,
          history: formattedHistory
        }),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(15000)
      })

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`)
      }

      // Stream the response
      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error("Response body reader could not be created")
      }
      
      const decoder = new TextDecoder()
      let responseText = ""

      // Add empty assistant message to start streaming into
      setChatHistory(prev => [...prev, { role: "assistant", content: "" }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        responseText += chunk

        // Update chat history with streaming response
        setChatHistory(prev => {
          const newHistory = [...prev]
          // Update the last message which should be the system response
          newHistory[newHistory.length - 1] = {
            role: "assistant",
            content: responseText
          }
          return newHistory
        })
      }

      // If we got no response content
      if (!responseText.trim()) {
        setChatHistory(prev => {
          const newHistory = [...prev]
          newHistory[newHistory.length - 1] = {
            role: "assistant",
            content: "I'm sorry, I couldn't generate a response. Please try asking something else."
          }
          return newHistory
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setError(`Error: ${error.message}`)
      
      // Add fallback response when API fails
      const fallbackResponse = generateFallbackResponse(userQuery);
      setChatHistory(prev => [
        ...prev,
        {
          role: "assistant",
          content: fallbackResponse
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative py-20 overflow-hidden" id="home">
      <div className="container px-4 md:px-6" >
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4"
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Give the Gift of Life
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                One organ donor can save up to eight lives and enhance the lives of up to 75 others through tissue
                donation.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button size="lg" className="inline-flex items-center" onClick={() => window.location.href = "https://notto.abdm.gov.in/"}>
                Learn About Donation
              </Button>
              <Button size="lg" variant="outline" onClick={() => window.location.href = "https://www.bc.edu/content/dam/files/research_sites/cjl/pdf/Richie%20Organ%20Donation.pdf"}>
                Check Registry Status
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary/10 p-4">
                  <h3 className="font-semibold text-lg">Ask About Organ Donation</h3>
                </div>
                <div 
                  ref={chatContainerRef}
                  className="h-[300px] overflow-y-auto p-4 space-y-4"
                >
                  {chatHistory.map((chat, index) => (
                    <div key={index} className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${chat.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                      >
                        {chat.content}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-muted animate-pulse">
                        Generating response...
                      </div>
                    </div>
                  )}
                  {error && (
                    <div className="flex justify-center">
                      <div className="max-w-[80%] rounded-lg p-3 bg-red-100 text-red-800 text-sm">
                        {error}
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t flex gap-2">
                  <Input
                    placeholder="Type your question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}