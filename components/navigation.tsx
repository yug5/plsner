"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Plane } from "lucide-react"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  const scrollToPlanner = () => {
    const plannerSection = document.getElementById("planner")
    if (plannerSection) {
      plannerSection.scrollIntoView({ behavior: "smooth" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white/80 dark:bg-gray-950/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold">
          <Plane className="w-6 h-6 text-primary" />
          <span>Plsner</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <button
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => scrollToSection("home")}
          >
            Home
          </button>
          <button
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => scrollToSection("features")}
          >
            Features
          </button>
          <button
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => scrollToSection("how-it-works")}
          >
            How It Works
          </button>
          <ModeToggle />
          <Button onClick={scrollToPlanner}>Get Started</Button>
        </nav>

        <div className="flex items-center gap-4 md:hidden">
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b animate-slide-up">
          <div className="container px-4 py-4 mx-auto space-y-4">
            <button
              className="block py-2 text-sm font-medium hover:text-primary transition-colors w-full text-left"
              onClick={() => scrollToSection("home")}
            >
              Home
            </button>
            <button
              className="block py-2 text-sm font-medium hover:text-primary transition-colors w-full text-left"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>
            <button
              className="block py-2 text-sm font-medium hover:text-primary transition-colors w-full text-left"
              onClick={() => scrollToSection("how-it-works")}
            >
              How It Works
            </button>
            <Button className="w-full" onClick={scrollToPlanner}>
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

