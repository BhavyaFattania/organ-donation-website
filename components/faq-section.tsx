"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FaqSection() {
  const faqs = [
    {
      question: "Who can be an organ donor?",
      answer:
        "Almost anyone can be an organ donor, regardless of age or medical history. At the time of death, medical professionals will determine which organs and tissues are viable for donation. Even people with chronic conditions or a history of disease can often donate some organs or tissues.",
    },
    {
      question: "Does my religion support organ donation?",
      answer:
        "Most major religions support organ donation and consider it an act of charity and goodwill. These include Christianity, Islam, Judaism, Hinduism, Buddhism, and many others. If you're unsure about your religion's stance, we encourage you to speak with your religious leader.",
    },
    {
      question: "Will doctors try less hard to save me if they know I'm a donor?",
      answer:
        "No. This is a common misconception. Medical professionals are committed to saving lives, and the team treating you is completely separate from the transplant team. Organ donation is only considered after all life-saving efforts have been exhausted and death has been declared.",
    },
    {
      question: "Will organ donation affect funeral arrangements?",
      answer:
        "No. Organ donation does not interfere with funeral arrangements, including open-casket services. The donation process is performed with the utmost respect and care, and the body is treated with dignity throughout the process.",
    },
    {
      question: "Is there a cost to the donor's family for donation?",
      answer:
        "No. There is absolutely no cost to the donor's family for organ or tissue donation. All costs related to donation are covered by the organ procurement organization.",
    },
    {
      question: "How do I register to become an organ donor?",
      answer:
        "You can register to become an organ donor through your state's donor registry, which is often linked to your driver's license or state ID. You can also register online through the National Donate Life Registry. Additionally, it's important to inform your family of your decision to donate.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30" id="faqs">
      <div className="container px-4 md:px-6" >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
          <p className="mt-4 text-muted-foreground md:text-xl">Find answers to common questions about organ donation</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>General Questions</CardTitle>
              <CardDescription>Basic information about organ donation</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.slice(0, 3).map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Process Questions</CardTitle>
              <CardDescription>Information about the donation process</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.slice(3, 6).map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index + 3}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

