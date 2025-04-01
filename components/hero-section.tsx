"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    {
      role: "system",
      content: "Hello! I'm here to answer your questions about organ donation. How can I help you today?",
    },
  ])
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return

    // Add user message to chat
    const updatedChatHistory = [...chatHistory, { role: "user", content: message }]
    setChatHistory(updatedChatHistory)
    setIsLoading(true)

    try {
      // Make API call to Flask backend
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: chatHistory
        })
      })

      // Stream the response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let responseText = ""

      while (true) {
        const { done, value } = await reader?.read() || {}
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        responseText += chunk

        // Update chat history with streaming response
        setChatHistory(prev => {
          const lastMessage = prev[prev.length - 1]
          if (lastMessage.role === "system") {
            // Update last system message
            return prev.map((msg, index) =>
              index === prev.length - 1
                ? { ...msg, content: responseText }
                : msg
            )
          } else {
            // Add new system message
            return [
              ...prev,
              { role: "system", content: responseText }
            ]
          }
        })
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error sending message:", error)
      setChatHistory(prev => [
        ...prev,
        {
          role: "system",
          content: "Sorry, there was an error processing your message. Please try again."
        }
      ])
      setIsLoading(false)
    }

    setMessage("")
  }

  const toggleListening = () => {
    setIsListening(!isListening)

    // Implement speech recognition logic here if needed
    // This is a placeholder similar to the previous implementation
    if (!isListening) {
      setTimeout(() => {
        setChatHistory([...chatHistory, { role: "user", content: "How does organ donation work?" }])
        handleSendMessage()
        setIsListening(false)
      }, 2000)
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
                <div className="h-[300px] overflow-y-auto p-4 space-y-4">
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
                </div>
                <div className="p-4 border-t flex gap-2">
                  <Input
                    placeholder="Type your question..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    disabled={isLoading}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant={isListening ? "destructive" : "secondary"}
                    onClick={toggleListening}
                    disabled={isLoading}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
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