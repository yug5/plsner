"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Utensils,
  Bed,
  Ticket,
  Download,
  Share2,
  ArrowLeft,
  Loader2,
  Landmark,
  ShoppingBag,
  Waves,
} from "lucide-react";
import { ItineraryMap } from "@/components/itinerary-map";
import { ItineraryTimeline } from "@/components/itinerary-timeline";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shareItinerary, downloadItineraryPDF } from "@/lib/actions";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface ItineraryResultProps {
  itinerary: string;
  onReset: () => void;
  destination: string;
  startDate: string;
  endDate: string;
}

interface Activity {
  time: string;
  title: string;
  description: string;
  type: string;
}

interface Day {
  day: number;
  activities: Activity[];
}

export function ItineraryResult({
  itinerary,
  onReset,
  destination,
  startDate,
  endDate,
}: ItineraryResultProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [email, setEmail] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [parsedDays, setParsedDays] = useState<Day[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Parse the itinerary text to extract structured data
    const days: Day[] = [];

    // Regular expressions to match day headers and activities
    const dayRegex = /<h3>Day (\d+).*?<\/h3>/g;
    const activityRegex =
      /<p><strong>(Morning|Afternoon|Evening|[\d:]+\s*(AM|PM)?):?<\/strong>\s*(.*?)(?:<\/p>|$)/g;

    let dayMatch;
    let currentDay = 0;

    // Find all day headers
    while ((dayMatch = dayRegex.exec(itinerary)) !== null) {
      const dayNumber = Number.parseInt(dayMatch[1], 10);
      const dayContent = itinerary.slice(dayMatch.index + dayMatch[0].length);
      const nextDayMatch = dayRegex.exec(dayContent);

      // Extract content for this day only
      const endIndex = nextDayMatch
        ? dayMatch.index + dayMatch[0].length + nextDayMatch.index
        : undefined;
      const dayText = itinerary.slice(dayMatch.index, endIndex);

      // Reset activity regex
      activityRegex.lastIndex = 0;

      const activities: Activity[] = [];
      let activityMatch;

      // Find all activities in this day
      while ((activityMatch = activityRegex.exec(dayText)) !== null) {
        const timeStr = activityMatch[1].trim();
        const description = activityMatch[3].trim();

        // Extract title from description (first sentence or phrase)
        const titleMatch = description.match(/^(.*?)(?:\.|:)/);
        const title = titleMatch
          ? titleMatch[1].trim()
          : description.substring(0, 40) + "...";

        // Determine activity type based on keywords
        let type = "activity";
        const lowerDesc = description.toLowerCase();

        if (
          lowerDesc.includes("breakfast") ||
          lowerDesc.includes("lunch") ||
          lowerDesc.includes("dinner") ||
          lowerDesc.includes("restaurant") ||
          lowerDesc.includes("café") ||
          lowerDesc.includes("food") ||
          lowerDesc.includes("meal")
        ) {
          type = "food";
        } else if (
          lowerDesc.includes("museum") ||
          lowerDesc.includes("gallery") ||
          lowerDesc.includes("monument") ||
          lowerDesc.includes("palace") ||
          lowerDesc.includes("temple") ||
          lowerDesc.includes("fort") ||
          lowerDesc.includes("historical")
        ) {
          type = "attraction";
        } else if (
          lowerDesc.includes("hotel") ||
          lowerDesc.includes("resort") ||
          lowerDesc.includes("accommodation") ||
          lowerDesc.includes("check-in") ||
          lowerDesc.includes("check in") ||
          lowerDesc.includes("stay")
        ) {
          type = "accommodation";
        } else if (
          lowerDesc.includes("shopping") ||
          lowerDesc.includes("market") ||
          lowerDesc.includes("bazaar") ||
          lowerDesc.includes("mall")
        ) {
          type = "shopping";
        } else if (
          lowerDesc.includes("beach") ||
          lowerDesc.includes("swim") ||
          lowerDesc.includes("ocean") ||
          lowerDesc.includes("sea")
        ) {
          type = "beach";
        } else if (
          lowerDesc.includes("park") ||
          lowerDesc.includes("garden") ||
          lowerDesc.includes("nature") ||
          lowerDesc.includes("hike") ||
          lowerDesc.includes("trek")
        ) {
          type = "nature";
        }

        // Format time string
        let time = timeStr;
        if (timeStr.toLowerCase() === "morning") {
          time = "09:00 AM";
        } else if (timeStr.toLowerCase() === "afternoon") {
          time = "01:00 PM";
        } else if (timeStr.toLowerCase() === "evening") {
          time = "07:00 PM";
        }

        activities.push({
          time,
          title,
          description,
          type,
        });
      }

      // Reset regex for next iteration
      if (nextDayMatch) {
        dayRegex.lastIndex =
          dayMatch.index + dayMatch[0].length + nextDayMatch.index;
      }

      days.push({
        day: dayNumber,
        activities,
      });

      currentDay = dayNumber;
    }

    // If no days were found using the regex, create a fallback structure
    if (days.length === 0) {
      // Create a simple 3-day structure
      for (let i = 1; i <= 3; i++) {
        days.push({
          day: i,
          activities: [
            {
              time: "09:00 AM",
              title: `Day ${i} Morning Activities`,
              description: `Explore the sights and sounds of ${destination} in the morning of day ${i}.`,
              type:
                i % 3 === 0 ? "food" : i % 3 === 1 ? "attraction" : "activity",
            },
            {
              time: "01:00 PM",
              title: `Day ${i} Afternoon Activities`,
              description: `Continue your adventure in ${destination} during the afternoon of day ${i}.`,
              type:
                i % 3 === 1 ? "food" : i % 3 === 2 ? "attraction" : "activity",
            },
            {
              time: "07:00 PM",
              title: `Day ${i} Evening Activities`,
              description: `Enjoy the evening atmosphere of ${destination} on day ${i}.`,
              type:
                i % 3 === 2 ? "food" : i % 3 === 0 ? "attraction" : "activity",
            },
          ],
        });
      }
    }

    setParsedDays(days);
  }, [itinerary, destination]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "food":
        return <Utensils className="h-4 w-4" />;
      case "attraction":
        return <Landmark className="h-4 w-4" />;
      case "accommodation":
        return <Bed className="h-4 w-4" />;
      case "shopping":
        return <ShoppingBag className="h-4 w-4" />;
      case "beach":
        return <Waves className="h-4 w-4" />;
      case "nature":
        return <Ticket className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleShareItinerary = async () => {
    if (!email) return;

    setIsSharing(true);
    try {
      const result = await shareItinerary(itinerary, email);
      if (result.success) {
        toast({
          title: "Itinerary shared successfully!",
          description: result.message,
        });
        setShareDialogOpen(false);
      }
    } catch (error) {
      toast({
        title: "Failed to share itinerary",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const result = await downloadItineraryPDF(itinerary);
      if (result.success) {
        toast({
          title: "PDF Generated Successfully",
          description: "Your itinerary PDF is ready to download.",
          action: (
            <ToastAction altText="Download" asChild>
              <a href={result.url} download={`${destination}-itinerary.pdf`}>
                Download
              </a>
            </ToastAction>
          ),
        });
      }
    } catch (error) {
      toast({
        title: "Failed to generate PDF",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Card className="border-2 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {destination} Itinerary
            </CardTitle>
            <CardDescription>
              {formatDate(startDate)} - {formatDate(endDate)}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onReset}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Planner
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="overview"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full">
            <TabsTrigger className="w-full" value="overview">
              Overview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="mt-6 space-y-6">
            <div className="prose dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: itinerary.replace(/\n/g, "<br />"),
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t p-6">
        <Button
          variant="outline"
          onClick={handleDownloadPDF}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </>
          )}
        </Button>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Share2 className="mr-2 h-4 w-4" />
              Share Itinerary
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Itinerary</DialogTitle>
              <DialogDescription>
                Enter an email address to share this itinerary.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="recipient@example.com"
                  className="col-span-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleShareItinerary}
                disabled={isSharing || !email}
              >
                {isSharing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Share"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
