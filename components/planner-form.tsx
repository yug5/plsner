"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2, MapPin, Calendar, Users, Sparkles, IndianRupee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { generateItinerary } from "@/lib/actions"
import { ItineraryResult } from "@/components/itinerary-result"
import { useToast } from "@/components/ui/use-toast"

// USD to INR conversion rate (approximate)
const USD_TO_INR_RATE = 75

const formSchema = z.object({
  destination: z.string().min(2, {
    message: "Destination must be at least 2 characters.",
  }),
  startDate: z.string().min(1, {
    message: "Please select a start date.",
  }),
  endDate: z.string().min(1, {
    message: "Please select an end date.",
  }),
  travelers: z.string().min(1, {
    message: "Please enter number of travelers.",
  }),
  budget: z.number().min(1, {
    message: "Please set your budget.",
  }),
  interests: z.string().optional(),
})

export function PlannerForm() {
  const [itinerary, setItinerary] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: "",
      startDate: "",
      endDate: "",
      travelers: "1",
      budget: 500,
      interests: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsGenerating(true)
    const timeoutId = setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Request Timeout",
        description: "The request took too long. Please try again.",
        variant: "destructive",
      })
    }, 30000) // 30 second timeout

    try {
      toast({
        title: "Generating Itinerary",
        description: "Our AI is creating your personalized travel plan. This may take a moment...",
      })

      const result = await generateItinerary(values)
      clearTimeout(timeoutId)
      setItinerary(result)
    } catch (error) {
      console.error("Failed to generate itinerary:", error)
      clearTimeout(timeoutId)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate itinerary. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <section className="py-12" id="planner">
      <div className="mx-auto max-w-4xl">
        {!itinerary ? (
          <Card className="border-2 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-primary" />
                Create Your Perfect Itinerary
              </CardTitle>
              <CardDescription>
                Fill in the details below and our AI will generate a personalized travel plan for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="destination"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Destination</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" placeholder="Paris, Tokyo, New York..." {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="travelers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Travelers</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" type="number" min="1" placeholder="1" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>End Date</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input className="pl-9" type="date" {...field} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1">
                          Budget <IndianRupee className="h-4 w-4" /> (INR)
                        </FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Slider
                              min={7500}
                              max={750000}
                              step={7500}
                              defaultValue={[field.value * USD_TO_INR_RATE]}
                              onValueChange={(value) => field.onChange(value[0] / USD_TO_INR_RATE)}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>₹7,500</span>
                              <span className="font-medium text-primary">
                                ₹{Math.round(field.value * USD_TO_INR_RATE).toLocaleString("en-IN")}
                              </span>
                              <span>₹7,50,000</span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interests & Preferences</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us what you enjoy: museums, outdoor activities, local cuisine, shopping, etc."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The more details you provide, the better we can tailor your itinerary.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" size="lg" disabled={isGenerating}>
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating your itinerary...
                      </>
                    ) : (
                      "Generate Itinerary"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        ) : (
          <div className="animate-slide-up">
            <ItineraryResult
              itinerary={itinerary}
              onReset={() => setItinerary(null)}
              destination={form.getValues("destination")}
              startDate={form.getValues("startDate")}
              endDate={form.getValues("endDate")}
            />
          </div>
        )}
      </div>
    </section>
  )
}

