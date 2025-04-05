import { Hero } from "@/components/hero"
import { Navigation } from "@/components/navigation"
import { PlannerForm } from "@/components/planner-form"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900" id="home">
      <Navigation />
      <div className="container px-4 mx-auto">
        <Hero />
      </div>
      <Features />
      <HowItWorks />
      <div className="container px-4 mx-auto">
        <PlannerForm />
      </div>
    </main>
  )
}

