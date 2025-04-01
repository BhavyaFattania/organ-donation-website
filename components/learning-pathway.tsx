"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, CheckCircle, Clock, Medal } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function LearningPathway() {
  const [activeStep, setActiveStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const steps = [
    {
      id: 1,
      title: "Understanding Organ Donation",
      description: "Learn the basics of organ donation and its impact on saving lives.",
      icon: BookOpen,
      content:
        "Organ donation is the process of surgically removing an organ or tissue from one person (the organ donor) and placing it into another person (the recipient). Transplantation is necessary because the recipient's organ has failed or has been damaged by disease or injury.",
      challenge: "Test your  knowledge about the different types of organs that can be donated.",
      bookletUrl: "https://drive.google.com/file/d/1_k3VfMnb5d5ffMiRoTt3HIVzm-gyWikN/view?usp=drive_link",
      bookletImageUrl: "https://drive.google.com/file/d/1_k3VfMnb5d5ffMiRoTt3HIVzm-gyWikN/view?usp=drive_link",
      videoUrl: "https://youtu.be/V9oXkucoJUE?si=d8iGg0_MYM-dC2ZX",
      videoImageUrl: "https://i.ytimg.com/vi/V9oXkucoJUE/maxresdefault.jpg",
    },
    {
      id: 2,
      title: "The Donation Process",
      description: "Understand how the donation process works from registration to transplantation.",
      icon: Clock,
      content:
        "The donation process involves several steps: registration as a donor, medical evaluation, matching with a recipient, organ recovery, and transplantation. The entire process is handled with the utmost care and respect for both the donor and recipient.",
      challenge: "Identify the key steps in the organ donation process in the correct order.",
      bookletUrl: "https://drive.google.com/file/d/1HypYQEjwvjOWn3GCdg3fx6HM7kmLW_ws/view?usp=drive_link",
      bookletImageUrl: "https://drive.google.com/file/d/1kDMtjNqjkp9oHiqycaa6KaBchiHfBJDW/view?usp=drive_link",
      videoUrl: "https://youtu.be/igTmwJQutFM?si=yNNbTr645IcZXHhE",
      videoImageUrl: "https://i.ytimg.com/vi/igTmwJQutFM/maxresdefault.jpg",
    },
    {
      id: 3,
      title: "Myths and Facts",
      description: "Dispel common misconceptions about organ donation.",
      icon: CheckCircle,
      content:
        "There are many myths surrounding organ donation. For example, many people believe that doctors won't try as hard to save someone who is registered as an organ donor, which is completely false. Medical professionals are committed to saving lives, and organ donation only becomes a consideration after all life-saving efforts have been exhausted.",
      challenge: "Identify which statements about organ donation are myths and which are facts.",
      bookletUrl: "https://drive.google.com/file/d/1RzRE07x9cbE-sJmnkWIykR_bqcvMZy3S/view?usp=drive_link",
      bookletImageUrl: "https://drive.google.com/file/d/1RzRE07x9cbE-sJmnkWIykR_bqcvMZy3S/view?usp=drive_link",
      videoUrl: "https://youtu.be/rBzjBgqrIgM?si=8xnR2YfTnOo523oD",
      videoImageUrl: "https://i.ytimg.com/vi/rBzjBgqrIgM/maxresdefault.jpg",
    },
    {
      id: 4,
      title: "Becoming an Advocate",
      description: "Learn how to promote organ donation in your community.",
      icon: Medal,
      content:
        "Advocates play a crucial role in promoting organ donation. By sharing accurate information, addressing concerns, and encouraging registration, advocates help increase the number of registered donors and ultimately save more lives.",
      challenge: "Create a brief advocacy plan for promoting organ donation in your community.",
      bookletUrl: "https://www.mohanfoundation.org/organ-donation-ambassador.asp",
      bookletImageUrl: "https://drive.google.com/file/d/1sFDkXJF0Llbu9Yn4qcePNQwKhN738zyl/view?usp=drive_link",
      videoUrl: "https://youtu.be/SYM5xMxUMfA?si=NhT8m_zlLcDdBz5x",
      videoImageUrl: "https://youtu.be/SYM5xMxUMfA?si=NhT8m_zlLcDdBz5x",
    },
  ]

  const handleNextStep = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1)
    }
  }

  const completeStep = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }
  }

  const currentStep = steps.find((step) => step.id === activeStep) || steps[0]

  return (
    <section className="py-20 bg-background" id="knowmore">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Learning Pathway</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Follow our structured learning path to understand organ donation and its impact
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Steps Navigation */}
          <div className="lg:col-span-3">
            <div className="space-y-2">
              {steps.map((step) => (
                <Button
                  key={step.id}
                  variant={activeStep === step.id ? "default" : "outline"}
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => setActiveStep(step.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`rounded-full p-1.5 ${completedSteps.includes(step.id)
                        ? "bg-green-500"
                        : activeStep === step.id
                          ? "bg-primary"
                          : "bg-muted"
                        }`}
                    >
                      <step.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{step.title}</p>
                      {completedSteps.includes(step.id) && (
                        <Badge variant="outline" className="mt-1 bg-green-500/10 text-green-500 border-green-500/20">
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl">{currentStep.title}</CardTitle>
                        <CardDescription className="mt-2">{currentStep.description}</CardDescription>
                      </div>
                      <currentStep.icon className="h-8 w-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="learn">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="learn">Learn</TabsTrigger>
                        <TabsTrigger value="resources">Resources</TabsTrigger>
                      </TabsList>
                      <TabsContent value="learn" className="space-y-4 pt-4">
                        <div className="prose dark:prose-invert max-w-none">
                          <p>{currentStep.content}</p>
                          <p>
                            Organ donation saves thousands of lives each year, but there are still many people waiting
                            for transplants. By understanding the process and becoming a registered donor, you can make
                            a significant impact.
                          </p>
                        </div>

                        <div className="mt-6">
                          <Dialog>
                            <DialogTrigger asChild>
                              {/* <Button>
                                Take Challenge <ArrowRight className="ml-2 h-4 w-4" />
                              </Button> */}
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Challenge: {currentStep.title}</DialogTitle>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="mb-4">{currentStep.challenge}</p>
                                <div className="space-y-2">
                                  {/* Simplified challenge UI */}
                                  <div className="p-3 border rounded-md hover:bg-muted cursor-pointer">
                                    Challenge option 1
                                  </div>
                                  <div className="p-3 border rounded-md hover:bg-muted cursor-pointer">
                                    Challenge option 2
                                  </div>
                                  <div className="p-3 border rounded-md hover:bg-muted cursor-pointer">
                                    Challenge option 3
                                  </div>
                                </div>
                                <Button
                                  className="mt-4 w-full"
                                  onClick={() => {
                                    completeStep(currentStep.id)
                                  }}
                                >
                                  Submit Answer
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TabsContent>
                      <TabsContent value="resources" className="space-y-4 pt-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="text-lg">Educational Booklet</CardTitle>
                            </CardHeader>
                            <div className="px-4">
                              <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
                                <img
                                  src={currentStep.bookletImageUrl}
                                  alt={`${currentStep.title} booklet preview`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="mb-4 text-sm text-gray-600">
                                Learn the fundamentals with our comprehensive educational booklet...
                              </p>
                            </div>
                            <CardFooter className="p-4 pt-0">
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.location.href = currentStep.bookletUrl}
                              >
                                <BookOpen className="mr-2 h-4 w-4" /> Read Now
                              </Button>
                            </CardFooter>
                          </Card>

                          <Card>
                            <CardHeader className="p-4">
                              <CardTitle className="text-lg">Video Guide</CardTitle>
                            </CardHeader>
                            <div className="px-4">
                              <div className="mb-4 h-40 w-full overflow-hidden rounded-lg bg-gray-100">
                                <img
                                  src={currentStep.videoImageUrl}
                                  alt={`${currentStep.title} video preview`}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="mb-4 text-sm text-gray-600">
                                Watch our step-by-step video guide to get started quickly...
                              </p>
                            </div>
                            <CardFooter className="p-4 pt-0">
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => window.location.href = currentStep.videoUrl}
                              >
                                <Clock className="mr-2 h-4 w-4" /> Watch Video
                              </Button>
                            </CardFooter>
                          </Card>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handlePrevStep} disabled={activeStep === 1}>
                      Previous
                    </Button>
                    <Button onClick={handleNextStep} disabled={activeStep === steps.length}>
                      Next
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}