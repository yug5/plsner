import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Sparkles, Compass } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="py-16 bg-muted/50" id="how-it-works">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our AI-powered travel planner creates personalized itineraries in just a few simple steps.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>1. Choose Destination</CardTitle>
              <CardDescription>Select where you want to go for your next adventure.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Enter your destination city or country. Our system supports thousands of locations worldwide.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>2. Set Your Dates</CardTitle>
              <CardDescription>Choose when you'll be traveling and for how long.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select your travel dates and number of travelers. This helps us create an itinerary that fits your
                schedule.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>3. Share Preferences</CardTitle>
              <CardDescription>Tell us what you enjoy doing while traveling.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Let us know your interests, budget, and any specific activities you'd like to include in your trip.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>4. Get Your Itinerary</CardTitle>
              <CardDescription>Receive a personalized travel plan in seconds.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI generates a detailed day-by-day itinerary with activities, restaurants, and attractions tailored
                to your preferences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

