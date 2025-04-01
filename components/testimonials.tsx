"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      quote:
        "“Today I am alive because a family decided to grant me life by donating organs of their near ones. By doing so, God alone knows what a great deed they have done.”",
      name: "Mrs. Anita Malhotra",
      role: "Recipient",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "Mr. Devi Ram, a mechanic is the first Heart transplant recipient in India. He underwent a heart transplant on 3rd August 1994.He is now leading a normal life and earning for his family.",
      name: "Mr. Devi Ram",
      role: "Recipient",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      quote:
        "My life changed after I recieved a kidney, I gained my freedom back again and it was a relief not to go through dialysis 2 times a week",
      name: "Mr Anand",
      role: "Recipient",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="py-20" id="testimonials">
      <div className="container px-4 md:px-6" >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Stories of Hope</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Real experiences from donors, recipients, and families
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={testimonials[currentIndex].image} alt={testimonials[currentIndex].name} />
                        <AvatarFallback>
                          {testimonials[currentIndex].name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1">
                        <Quote className="h-4 w-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-center text-lg italic mb-6">
                    "{testimonials[currentIndex].quote}"
                  </blockquote>

                  <div className="text-center">
                    <p className="font-semibold">{testimonials[currentIndex].name}</p>
                    <p className="text-sm text-muted-foreground">{testimonials[currentIndex].role}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-6 gap-2">
            <Button variant="outline" size="icon" onClick={prevTestimonial}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="outline"
                size="icon"
                className={`w-2 h-2 rounded-full p-0 ${currentIndex === index ? "bg-primary" : "bg-muted"}`}
                onClick={() => setCurrentIndex(index)}
              >
                <span className="sr-only">Go to slide {index + 1}</span>
              </Button>
            ))}
            <Button variant="outline" size="icon" onClick={nextTestimonial}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

