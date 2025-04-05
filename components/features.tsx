import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Map, Zap, Globe, Palette, Share2 } from "lucide-react"

export function Features() {
  return (
    <section className="py-16" id="features">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what makes our AI travel planner the perfect companion for your next adventure.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Save Time</CardTitle>
              <CardDescription>Plan your entire trip in minutes, not hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our AI does the research for you, finding the best attractions, restaurants, and activities based on
                your preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Map className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Interactive Maps</CardTitle>
              <CardDescription>Visualize your journey with detailed maps.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                See all your destinations on an interactive map, making it easy to plan efficient routes and maximize
                your time.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Personalized Recommendations</CardTitle>
              <CardDescription>Get suggestions tailored to your interests.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Whether you love art, food, adventure, or relaxation, our AI creates itineraries that match your unique
                preferences.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Global Coverage</CardTitle>
              <CardDescription>Plan trips to destinations worldwide.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Our system covers thousands of destinations across the globe, from major cities to hidden gems off the
                beaten path.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Budget Friendly</CardTitle>
              <CardDescription>Create plans that match your spending limits.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Set your budget and our AI will suggest activities and accommodations that won't break the bank.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Share2 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Easy Sharing</CardTitle>
              <CardDescription>Share your itinerary with travel companions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Easily share your plans via email or download as a PDF to keep everyone in your group informed and
                excited.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

