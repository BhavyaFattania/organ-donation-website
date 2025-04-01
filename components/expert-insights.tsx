"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function ExpertInsights() {
  const experts = [
    {
      name: "Dr. Arvind Kumar",
      role: "Chairman, Institute of Chest Surgery",
      specialty: "Chest Onco Surgery and Lung Transplantation",
      image: "/placeholder.svg?height=100&width=100",
      insight:
        "But if we compare it with the Western countries, our numbers are abysmally low, Dr. Arvind Kumar, Chairman, Institute of Chest Surgery- Chest Onco Surgery and Lung Transplantation, Medanta, Gurugram.",
      url: "https://www.google.com/amp/s/timesofindia.indiatimes.com/life-style/health-fitness/health-news/organ-donation-day-doctor-explains-why-india-still-lags-behind-in-organ-donation-myths-we-need-to-stop-believing-in/amp_articleshow/102685583.cms", // Example URL
    },
    {
      name: "LS Changsan",
      role: "Ministry of Health",
      specialty: "Politics",
      image: "/placeholder.svg?height=100&width=100",
      insight:
        "OrganV donation needs to become a way of life for us so that we can give a new lease of life to those suffering from organ failure.",
      url: "https://mohfw.gov.in/?q=/press-info/7600", // Example URL
    },
    {
      name: "Dr. Mansukh Mandaviya",
      role: "Ministry of Health",
      specialty: "Politics",
      image: "/placeholder.svg?height=100&width=100",
      insight:
        "“There cannot be a greater service to humanity than giving life to another person”.",
      url: "https://pib.gov.in/PressReleaseIframePage.aspx?PRID=1945333", // Example URL
    },
    {
      name: "Jaya Jairam",
      role: "Project Director",
      specialty: "Business",
      image: "/placeholder.svg?height=100&width=100",
      insight:
        "Enabling organ exchange between unrelated individuals for a swap or exchange is certainly a welcome move, provided the donor's intent is verified to be altruistic and ethical",
      url: "https://www.ndtv.com/opinion/organ-donation-other-indian-states-can-learn-a-lot-from-gujarat-5908448", // Example URL
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-20" id="expertinsights">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Expert Insights</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">
            Learn from leading transplant specialists and medical professionals
          </p>
        </div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {experts.map((expert, index) => (
            <motion.div key={index} variants={item}>
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={expert.image} alt={expert.name} />
                      <AvatarFallback>
                        {expert.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{expert.name}</CardTitle>
                      <CardDescription>{expert.role}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <Badge variant="outline" className="mb-3">
                    {expert.specialty}
                  </Badge>
                  <p className="text-sm text-muted-foreground">"{expert.insight}"</p>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.location.href = expert.url}
                  >
                    Know More
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}