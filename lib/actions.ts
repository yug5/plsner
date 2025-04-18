"use server";

import { generateText } from "ai";
import { createMistral } from "@ai-sdk/mistral";

interface ItineraryParams {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: string;
  budget: number;
  interests?: string;
}

// USD to INR conversion rate (approximate)
const USD_TO_INR_RATE = 75;

const mistral = createMistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateItinerary(
  params: ItineraryParams
): Promise<string> {
  try {
    // Calculate trip duration
    const start = new Date(params.startDate);
    const end = new Date(params.endDate);
    const tripDays =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Convert budget to INR for display
    const budgetInINR = params.budget * USD_TO_INR_RATE;

    const prompt = `
      Create a concise travel itinerary for ${params.destination} (${tripDays} days).
      Travelers: ${params.travelers}, Budget: ₹${budgetInINR.toLocaleString("en-IN")}
      Interests: ${params.interests || "General sightseeing"}

      Format as HTML with:
      - Day-by-day schedule (morning/afternoon/evening)
      - Key attractions and activities
      - Restaurant recommendations
      - Estimated costs in ₹
      - Transportation tips
      
      Keep it brief and practical.
    `;

    try {
      // Call our API route instead of Mistral directly
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/mistral`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mistral-small-latest',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } catch (error) {
      console.error(
        "Error using Mistral AI, falling back to mock response:",
        error
      );

      // Mock response with INR currency (used when API call fails)
      const mockResponse = `
        <h2>Your ${tripDays}-Day ${params.destination} Itinerary</h2>
        
        <h3>Day 1: Arrival and Orientation</h3>
        <p><strong>Morning:</strong> Arrive at ${params.destination
        } and check into your accommodation. Take some time to freshen up and get settled.</p>
        <p><strong>Afternoon:</strong> Take a leisurely walk around your neighborhood to get oriented. Visit a local café for a light lunch (₹1,125-1,500 per person).</p>
        <p><strong>Evening:</strong> Enjoy dinner at a popular local restaurant that showcases regional cuisine (₹2,250-3,000 per person).</p>
        
        <h3>Day 2: Cultural Immersion</h3>
        <p><strong>Morning:</strong> Visit the main historical attractions in the city center. Consider a guided walking tour (₹1,875 per person).</p>
        <p><strong>Afternoon:</strong> Explore local museums and cultural sites. Many museums offer discounted afternoon tickets (₹1,125-1,500 per person).</p>
        <p><strong>Evening:</strong> Experience local nightlife with dinner at a trendy restaurant followed by drinks at a rooftop bar (₹3,750-4,500 per person).</p>
        
        <h3>Day 3: Nature and Relaxation</h3>
        <p><strong>Morning:</strong> Take a day trip to nearby natural attractions. Consider renting a car or joining a tour group (₹3,000-4,500 per person).</p>
        <p><strong>Afternoon:</strong> Enjoy outdoor activities like hiking, swimming, or simply relaxing in nature. Pack a picnic lunch to save on costs.</p>
        <p><strong>Evening:</strong> Return to the city for a farewell dinner at a highly-rated restaurant (₹2,625-3,375 per person).</p>
        
        <h3>Transportation Tips:</h3>
        <ul>
          <li>Public transportation is efficient and affordable in ${params.destination
        }. Consider getting a multi-day pass.</li>
          <li>Taxis are readily available but can be expensive for longer trips.</li>
          <li>Many attractions are within walking distance of the city center.</li>
        </ul>
        
        <h3>Special Events During Your Stay:</h3>
        <p>Based on your travel dates, you might be able to experience local festivals or seasonal events. Check with your accommodation for up-to-date information.</p>
        
        <h3>Estimated Total Cost:</h3>
        <p>For ${params.travelers
        } traveler(s) over ${tripDays} days: approximately ₹${(
          Math.min(
            params.budget,
            300 * Number.parseInt(params.travelers) * tripDays
          ) * USD_TO_INR_RATE
        ).toLocaleString("en-IN")} - ₹${(
          Math.min(
            params.budget,
            400 * Number.parseInt(params.travelers) * tripDays
          ) * USD_TO_INR_RATE
        ).toLocaleString("en-IN")}</p>
      `;
      return mockResponse;
    }
  } catch (error) {
    console.error("Failed to generate itinerary:", error);
    throw new Error("Failed to generate itinerary. Please try again.");
  }
}

export async function shareItinerary(
  itinerary: string,
  email: string
): Promise<{ success: boolean; message: string }> {
  // This would connect to an email service in a real application
  console.log(`Sharing itinerary with ${email}`);

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    success: true,
    message: `Itinerary has been shared to ${email}`,
  };
}

export async function downloadItineraryPDF(
  itinerary: string
): Promise<{ success: boolean; url: string }> {
  // This would generate a PDF in a real application
  console.log("Generating PDF for download");

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return {
    success: true,
    url: "#download-success", // In a real app, this would be a URL to the generated PDF
  };
}