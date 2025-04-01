"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DonationForm } from "@/components/donation-form";
import { ModeToggle } from "@/components/mode-toggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerOffset = 64; // Navbar height (h-16 = 4rem = 64px)
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      console.log(`Element #${elementId} not found`);
    }
  };

  const navItems = [
    { name: "Home", id: "home" },
    { name: "Know More", id: "knowmore" },
    { name: "Statistics", id: "statistics" },
    { name: "Expert Insights", id: "expertinsights" },
    { name: "FAQs", id: "faqs" },
    { name: "Testimonials", id: "testimonials" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">HopeBridge</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </button>
          ))}
          <a
            href="https://healthahon.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            Community
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <ModeToggle />

          <Dialog>
            <DialogTrigger asChild>
              <Button className="hidden md:inline-flex">Donate Now</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Become a Donor</DialogTitle>
              </DialogHeader>
              <DonationForm />
            </DialogContent>
          </Dialog>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 py-6">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      setIsOpen(false);
                      scrollToSection(item.id);
                    }}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {item.name}
                  </button>
                ))}
                <a
                  href="https://healthahon.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-medium transition-colors hover:text-primary"
                >
                  Community
                </a>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="mt-4" onClick={() => setIsOpen(false)}>
                      Donate Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Become a Donor</DialogTitle>
                    </DialogHeader>
                    <DonationForm />
                  </DialogContent>
                </Dialog>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
