"use client"

import { Button } from "@/components/ui/button"
import { TravelIllustration } from "@/components/travel-illustration"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()

  const scrollToPlanner = () => {
    const plannerSection = document.getElementById("planner")
    if (plannerSection) {
      plannerSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById("how-it-works")
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="py-12 md:py-20">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12 items-center">
        <div className="space-y-6 stagger-animation">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Plan your perfect trip with <span className="text-primary">AI</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-[600px]">
            Create personalized travel itineraries based on your interests, budget, and schedule. Let our AI do the
            planning while you focus on enjoying your journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="font-medium" onClick={scrollToPlanner}>
              Start Planning
            </Button>
            <Button size="lg" variant="outline" className="font-medium" onClick={scrollToHowItWorks}>
              Learn More
            </Button>
          </div>
        </div>
        <div className="relative h-[300px] md:h-[400px] lg:h-[500px]">
          <TravelIllustration />
        </div>
      </div>
    </section>
  )
}

