"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2, MapPin, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Script from "next/script"

interface ItineraryMapProps {
  destination: string
}

interface MapLocation {
  name: string
  lat: number
  lng: number
  type: string
}

export function ItineraryMap({ destination }: ItineraryMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [googleMapsError, setGoogleMapsError] = useState(false)
  const [mapLocations, setMapLocations] = useState<MapLocation[]>([])
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const { theme } = useTheme()

  // Mock function to get coordinates for a destination
  const getDestinationCoordinates = (dest: string): { lat: number; lng: number } => {
    // This would be replaced with a real geocoding API in a production app
    const destinations: Record<string, { lat: number; lng: number }> = {
      paris: { lat: 48.8566, lng: 2.3522 },
      tokyo: { lat: 35.6762, lng: 139.6503 },
      "new york": { lat: 40.7128, lng: -74.006 },
      london: { lat: 51.5074, lng: -0.1278 },
      rome: { lat: 41.9028, lng: 12.4964 },
      sydney: { lat: -33.8688, lng: 151.2093 },
      delhi: { lat: 28.6139, lng: 77.209 },
      mumbai: { lat: 19.076, lng: 72.8777 },
      bangalore: { lat: 12.9716, lng: 77.5946 },
      chennai: { lat: 13.0827, lng: 80.2707 },
      kolkata: { lat: 22.5726, lng: 88.3639 },
      jaipur: { lat: 26.9124, lng: 75.7873 },
      goa: { lat: 15.2993, lng: 74.124 },
      agra: { lat: 27.1767, lng: 78.0081 },
    }

    const lowerDest = dest.toLowerCase()

    // Find the first matching destination
    for (const key in destinations) {
      if (lowerDest.includes(key)) {
        return destinations[key]
      }
    }

    // Default coordinates (center of India) if no match
    return { lat: 20.5937, lng: 78.9629 }
  }

  // Generate some nearby points of interest
  const generatePointsOfInterest = (centerLat: number, centerLng: number): MapLocation[] => {
    const locations: MapLocation[] = []
    const poiTypes = ["restaurant", "museum", "park", "temple", "market", "hotel", "beach", "monument"]
    const poiNames = {
      restaurant: ["Gourmet Delight", "Local Flavors", "Spice Garden", "Royal Cuisine", "Seafood Paradise"],
      museum: ["Heritage Museum", "Art Gallery", "Historical Museum", "Science Center", "Cultural Museum"],
      park: ["Central Park", "Riverside Gardens", "Sunset Park", "Green Valley", "Mountain View Park"],
      temple: ["Ancient Temple", "Golden Shrine", "Sacred Temple", "Divine Temple", "Holy Sanctuary"],
      market: ["Local Bazaar", "Artisan Market", "Spice Market", "Handicraft Market", "Street Market"],
      hotel: ["Luxury Palace", "Comfort Inn", "Heritage Stay", "Riverside Resort", "Mountain View Hotel"],
      beach: ["Golden Beach", "Sunset Shore", "Blue Lagoon", "Paradise Beach", "Crystal Waters"],
      monument: ["Victory Monument", "Ancient Ruins", "Historical Monument", "Heritage Site", "Memorial"],
    }

    for (let i = 0; i < 8; i++) {
      // Generate random offset (within ~5km)
      const latOffset = (Math.random() - 0.5) * 0.05
      const lngOffset = (Math.random() - 0.5) * 0.05

      const type = poiTypes[Math.floor(Math.random() * poiTypes.length)]
      const nameList = poiNames[type as keyof typeof poiNames]
      const name = nameList[Math.floor(Math.random() * nameList.length)]

      locations.push({
        name: name,
        lat: centerLat + latOffset,
        lng: centerLng + lngOffset,
        type: type,
      })
    }

    return locations
  }

  useEffect(() => {
    if (!destination) return

    setIsLoading(true)

    // Simulate API call delay
    setTimeout(() => {
      const coords = getDestinationCoordinates(destination)
      const locations = generatePointsOfInterest(coords.lat, coords.lng)

      // Add the main destination to the locations
      locations.unshift({
        name: destination,
        lat: coords.lat,
        lng: coords.lng,
        type: "destination",
      })

      setMapLocations(locations)
      setIsLoading(false)
    }, 1000)
  }, [destination])

  // Initialize Google Maps
  useEffect(() => {
    if (!mapLoaded || isLoading || !mapRef.current || mapLocations.length === 0 || googleMapsError) return

    try {
      const initMap = () => {
        // @ts-ignore - Google Maps API is loaded via script
        const google = window.google
        if (!google) {
          setGoogleMapsError(true)
          return
        }

        const mainLocation = mapLocations[0]

        // Map styles for dark/light mode
        const darkModeStyle = [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "transit",
            elementType: "geometry",
            stylers: [{ color: "#2f3948" }],
          },
          {
            featureType: "transit.station",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ]

        // Create the map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: mainLocation.lat, lng: mainLocation.lng },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: theme === "dark" ? darkModeStyle : [],
        })

        // Create an info window to share between markers
        const infoWindow = new google.maps.InfoWindow()

        // Create markers for each location
        mapLocations.forEach((location, index) => {
          // Choose icon based on location type
          const icon = {
            url: `https://maps.google.com/mapfiles/ms/icons/red-dot.png`,
            scaledSize: new google.maps.Size(32, 32),
          }

          if (index === 0) {
            // Main destination
            icon.url = `https://maps.google.com/mapfiles/ms/icons/blue-dot.png`
          } else {
            // Choose color based on type
            switch (location.type) {
              case "restaurant":
                icon.url = `https://maps.google.com/mapfiles/ms/icons/red-dot.png`
                break
              case "museum":
              case "monument":
                icon.url = `https://maps.google.com/mapfiles/ms/icons/purple-dot.png`
                break
              case "park":
              case "nature":
                icon.url = `https://maps.google.com/mapfiles/ms/icons/green-dot.png`
                break
              case "temple":
                icon.url = `https://maps.google.com/mapfiles/ms/icons/yellow-dot.png`
                break
              case "market":
              case "shopping":
                icon.url = `https://maps.google.com/mapfiles/ms/icons/orange-dot.png`
                break
              case "hotel":
              case "accommodation":
                icon.url = `https://maps.google.com/mapfiles/ms/icons/blue-dot.png`
                break
              case "beach":
                icon.url = `https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png`
                break
              default:
                icon.url = `https://maps.google.com/mapfiles/ms/icons/pink-dot.png`
            }
          }

          const marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map,
            title: location.name,
            icon,
            animation: index === 0 ? google.maps.Animation.DROP : null,
          })

          // Add click listener to show info window
          marker.addListener("click", () => {
            infoWindow.close()
            infoWindow.setContent(`
              <div style="padding: 8px; max-width: 200px;">
                <h3 style="margin: 0 0 8px; font-size: 16px;">${location.name}</h3>
                <p style="margin: 0; font-size: 12px; text-transform: capitalize;">${location.type}</p>
              </div>
            `)
            infoWindow.open(map, marker)
          })
        })

        // Draw polylines between main destination and other points
        mapLocations.slice(1).forEach((location) => {
          const line = new google.maps.Polyline({
            path: [
              { lat: mainLocation.lat, lng: mainLocation.lng },
              { lat: location.lat, lng: location.lng },
            ],
            geodesic: true,
            strokeColor: "#3b82f6",
            strokeOpacity: 0.8,
            strokeWeight: 2,
          })

          line.setMap(map)
        })
      }

      initMap()
    } catch (error) {
      console.error("Error initializing Google Maps:", error)
      setGoogleMapsError(true)
    }
  }, [mapLoaded, isLoading, mapLocations, theme, googleMapsError])

  // Handle theme changes for Google Maps
  useEffect(() => {
    if (mapLoaded && !isLoading && mapLocations.length > 0 && !googleMapsError) {
      // Re-initialize map when theme changes
      const initMap = setTimeout(() => {
        if (mapRef.current) {
          try {
            // Clear the map container
            mapRef.current.innerHTML = ""

            // Re-initialize the map
            // @ts-ignore - Google Maps API is loaded via script
            if (window.google && window.google.maps) {
              const mainLocation = mapLocations[0]

              // Map styles for dark/light mode
              const darkModeStyle = [
                { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                {
                  featureType: "administrative.locality",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#d59563" }],
                },
                {
                  featureType: "poi",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#d59563" }],
                },
                {
                  featureType: "poi.park",
                  elementType: "geometry",
                  stylers: [{ color: "#263c3f" }],
                },
                {
                  featureType: "poi.park",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#6b9a76" }],
                },
                {
                  featureType: "road",
                  elementType: "geometry",
                  stylers: [{ color: "#38414e" }],
                },
                {
                  featureType: "road",
                  elementType: "geometry.stroke",
                  stylers: [{ color: "#212a37" }],
                },
                {
                  featureType: "road",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#9ca5b3" }],
                },
                {
                  featureType: "road.highway",
                  elementType: "geometry",
                  stylers: [{ color: "#746855" }],
                },
                {
                  featureType: "road.highway",
                  elementType: "geometry.stroke",
                  stylers: [{ color: "#1f2835" }],
                },
                {
                  featureType: "road.highway",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#f3d19c" }],
                },
                {
                  featureType: "transit",
                  elementType: "geometry",
                  stylers: [{ color: "#2f3948" }],
                },
                {
                  featureType: "transit.station",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#d59563" }],
                },
                {
                  featureType: "water",
                  elementType: "geometry",
                  stylers: [{ color: "#17263c" }],
                },
                {
                  featureType: "water",
                  elementType: "labels.text.fill",
                  stylers: [{ color: "#515c6d" }],
                },
                {
                  featureType: "water",
                  elementType: "labels.text.stroke",
                  stylers: [{ color: "#17263c" }],
                },
              ]

              // Create the map
              const map = new google.maps.Map(mapRef.current, {
                center: { lat: mainLocation.lat, lng: mainLocation.lng },
                zoom: 13,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
                styles: theme === "dark" ? darkModeStyle : [],
              })

              // Create an info window to share between markers
              const infoWindow = new google.maps.InfoWindow()

              // Create markers for each location
              mapLocations.forEach((location, index) => {
                // Choose icon based on location type
                const icon = {
                  url: `https://maps.google.com/mapfiles/ms/icons/red-dot.png`,
                  scaledSize: new google.maps.Size(32, 32),
                }

                if (index === 0) {
                  // Main destination
                  icon.url = `https://maps.google.com/mapfiles/ms/icons/blue-dot.png`
                } else {
                  // Choose color based on type
                  switch (location.type) {
                    case "restaurant":
                      icon.url = `https://maps.google.com/mapfiles/ms/icons/red-dot.png`
                      break
                    case "museum":
                    case "monument":
                      icon.url = `https://maps.google.com/mapfiles/ms/icons/purple-dot.png`
                      break
                    case "park":
                    case "nature":
                      icon.url = `https://maps.google.com/mapfiles/ms/icons/green-dot.png`
                      break
                    case "temple":
                      icon.url = `https://maps.google.com/mapfiles/ms/icons/yellow-dot.png`
                      break
                    case "market":
                    case "shopping":
                      icon.url = `https://maps.google.com/mapfiles/ms/icons/orange-dot.png`
                      break
                    case "hotel":
                    case "accommodation":
                      icon.url = `https://maps.google.com/mapfiles/ms/icons/blue-dot.png`
                      break
                    case "beach":
                      icon.url = `https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png`
                      break
                    default:
                      icon.url = `https://maps.google.com/mapfiles/ms/icons/pink-dot.png`
                  }
                }

                const marker = new google.maps.Marker({
                  position: { lat: location.lat, lng: location.lng },
                  map,
                  title: location.name,
                  icon,
                  animation: index === 0 ? google.maps.Animation.DROP : null,
                })

                // Add click listener to show info window
                marker.addListener("click", () => {
                  infoWindow.close()
                  infoWindow.setContent(`
                    <div style="padding: 8px; max-width: 200px;">
                      <h3 style="margin: 0 0 8px; font-size: 16px;">${location.name}</h3>
                      <p style="margin: 0; font-size: 12px; text-transform: capitalize;">${location.type}</p>
                    </div>
                  `)
                  infoWindow.open(map, marker)
                })
              })

              // Draw polylines between main destination and other points
              mapLocations.slice(1).forEach((location) => {
                const line = new google.maps.Polyline({
                  path: [
                    { lat: mainLocation.lat, lng: mainLocation.lng },
                    { lat: location.lat, lng: location.lng },
                  ],
                  geodesic: true,
                  strokeColor: "#3b82f6",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                })

                line.setMap(map)
              })
            } else {
              setGoogleMapsError(true)
            }
          } catch (error) {
            console.error("Error reinitializing Google Maps:", error)
            setGoogleMapsError(true)
          }
        }
      }, 100)

      return () => clearTimeout(initMap)
    }
  }, [theme, mapLoaded, isLoading, mapLocations, googleMapsError])

  // Canvas-based map implementation (fallback)
  const drawMap = () => {
    if (!mapRef.current || isLoading || mapLocations.length === 0 || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw map background
    const isDarkMode = theme === "dark"
    ctx.fillStyle = isDarkMode ? "#1f2937" : "#e5e7eb"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = isDarkMode ? "#374151" : "#d1d5db"
    ctx.lineWidth = 1

    // Horizontal grid lines
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Vertical grid lines
    for (let i = 0; i < canvas.width; i += 40) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }

    // Find min/max coordinates to scale the map
    const minLat = Math.min(...mapLocations.map((loc) => loc.lat))
    const maxLat = Math.max(...mapLocations.map((loc) => loc.lat))
    const minLng = Math.min(...mapLocations.map((loc) => loc.lng))
    const maxLng = Math.max(...mapLocations.map((loc) => loc.lng))

    // Add some padding
    const latPadding = (maxLat - minLat) * 0.2
    const lngPadding = (maxLng - minLng) * 0.2

    // Function to convert geo coordinates to canvas coordinates
    const geoToCanvas = (lat: number, lng: number) => {
      const x = ((lng - minLng + lngPadding / 2) / (maxLng - minLng + lngPadding)) * canvas.width * zoom + mapOffset.x
      const y = ((maxLat + latPadding / 2 - lat) / (maxLat - minLat + latPadding)) * canvas.height * zoom + mapOffset.y
      return { x, y }
    }

    // Draw connections between points
    ctx.strokeStyle = isDarkMode ? "#60a5fa" : "#3b82f6"
    ctx.lineWidth = 2

    // Start from the main destination
    const mainPoint = geoToCanvas(mapLocations[0].lat, mapLocations[0].lng)

    // Connect to other points
    for (let i = 1; i < mapLocations.length; i++) {
      const point = geoToCanvas(mapLocations[i].lat, mapLocations[i].lng)
      ctx.beginPath()
      ctx.moveTo(mainPoint.x, mainPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }

    // Draw locations
    mapLocations.forEach((location, index) => {
      const { x, y } = geoToCanvas(location.lat, location.lng)

      // Skip if outside canvas
      if (x < -50 || x > canvas.width + 50 || y < -50 || y > canvas.height + 50) return

      // Draw point
      ctx.beginPath()
      ctx.arc(x, y, index === 0 ? 8 : 6, 0, Math.PI * 2)

      // Color based on type
      if (index === 0) {
        ctx.fillStyle = "#3b82f6" // Main destination - blue
      } else {
        switch (location.type) {
          case "restaurant":
            ctx.fillStyle = "#ef4444" // Red
            break
          case "museum":
            ctx.fillStyle = "#8b5cf6" // Purple
            break
          case "park":
            ctx.fillStyle = "#22c55e" // Green
            break
          case "temple":
            ctx.fillStyle = "#eab308" // Yellow
            break
          case "market":
            ctx.fillStyle = "#f97316" // Orange
            break
          case "hotel":
            ctx.fillStyle = "#06b6d4" // Cyan
            break
          case "beach":
            ctx.fillStyle = "#14b8a6" // Teal
            break
          case "monument":
            ctx.fillStyle = "#a855f7" // Purple
            break
          default:
            ctx.fillStyle = "#9ca3af" // Gray
        }
      }

      // Highlight selected location
      if (selectedLocation && location.name === selectedLocation.name) {
        ctx.lineWidth = 3
        ctx.strokeStyle = isDarkMode ? "#ffffff" : "#000000"
        ctx.stroke()
      }

      ctx.fill()

      // Draw label
      ctx.font = index === 0 ? "bold 14px sans-serif" : "12px sans-serif"
      ctx.fillStyle = isDarkMode ? "#e5e7eb" : "#111827"
      ctx.textAlign = "center"
      ctx.fillText(location.name, x, y - 15)
    })
  }

  // Initialize canvas-based map (fallback)
  useEffect(() => {
    if (!mapRef.current || isLoading || mapLocations.length === 0 || (!googleMapsError && mapLoaded)) return

    // Create canvas if it doesn't exist
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = mapRef.current.clientWidth
      canvas.height = 400
      canvas.style.borderRadius = "0.5rem"

      // Add event listeners for interactivity
      canvas.addEventListener("mousedown", handleMouseDown)
      canvas.addEventListener("mousemove", handleMouseMove)
      canvas.addEventListener("mouseup", handleMouseUp)
      canvas.addEventListener("mouseleave", handleMouseUp)
      canvas.addEventListener("wheel", handleWheel)
      canvas.addEventListener("click", handleClick)

      // Clear any existing canvas
      while (mapRef.current.firstChild) {
        mapRef.current.removeChild(mapRef.current.firstChild)
      }

      mapRef.current.appendChild(canvas)
      canvasRef.current = canvas
    }

    // Draw the map
    drawMap()

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener("mousedown", handleMouseDown)
        canvasRef.current.removeEventListener("mousemove", handleMouseMove)
        canvasRef.current.removeEventListener("mouseup", handleMouseUp)
        canvasRef.current.removeEventListener("mouseleave", handleMouseUp)
        canvasRef.current.removeEventListener("wheel", handleWheel)
        canvasRef.current.removeEventListener("click", handleClick)
      }
    }
  }, [mapLocations, isLoading, mapOffset, zoom, selectedLocation, googleMapsError, mapLoaded, theme])

  // Handle Google Maps script error
  const handleScriptError = () => {
    console.error("Google Maps script failed to load")
    setGoogleMapsError(true)
  }

  const handleMouseDown = (e: MouseEvent) => {
    if (!canvasRef.current) return

    setIsDragging(true)
    setDragStart({
      x: e.clientX - mapOffset.x,
      y: e.clientY - mapOffset.y,
    })
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !canvasRef.current) return

    setMapOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault()

    // Adjust zoom level
    const newZoom = Math.max(0.5, Math.min(2, zoom - e.deltaY * 0.001))
    setZoom(newZoom)
  }

  const handleClick = (e: MouseEvent) => {
    if (!canvasRef.current || mapLocations.length === 0) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find min/max coordinates to scale the map
    const minLat = Math.min(...mapLocations.map((loc) => loc.lat))
    const maxLat = Math.max(...mapLocations.map((loc) => loc.lat))
    const minLng = Math.min(...mapLocations.map((loc) => loc.lng))
    const maxLng = Math.max(...mapLocations.map((loc) => loc.lng))

    // Add some padding
    const latPadding = (maxLat - minLat) * 0.2
    const lngPadding = (maxLng - minLng) * 0.2

    // Function to convert geo coordinates to canvas coordinates
    const geoToCanvas = (lat: number, lng: number) => {
      const x =
        ((lng - minLng + lngPadding / 2) / (maxLng - minLng + lngPadding)) * canvasRef.current!.width * zoom +
        mapOffset.x
      const y =
        ((maxLat + latPadding / 2 - lat) / (maxLat - minLat + latPadding)) * canvasRef.current!.height * zoom +
        mapOffset.y
      return { x, y }
    }

    // Check if click is near any location
    for (const location of mapLocations) {
      const point = geoToCanvas(location.lat, location.lng)
      const distance = Math.sqrt(Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2))

      if (distance < 15) {
        setSelectedLocation(location)
        return
      }
    }

    // If click is not on any location, deselect
    setSelectedLocation(null)
  }

  const resetMapView = () => {
    setMapOffset({ x: 0, y: 0 })
    setZoom(1)
    setSelectedLocation(null)
  }

  return (
    <div className="space-y-4">
      {!googleMapsError && (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&libraries=places`}
          onLoad={() => {
            setMapLoaded(true)
          }}
          onError={handleScriptError}
          strategy="lazyOnload"
        />
      )}

      <div className="rounded-lg border overflow-hidden h-[400px] relative" ref={mapRef}>
        {isLoading && (
          <div className="flex items-center justify-center h-full bg-muted">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading map of {destination}...</p>
            </div>
          </div>
        )}

        {selectedLocation && (
          <div className="absolute bottom-4 left-4 right-4 bg-background border rounded-lg p-4 shadow-lg z-10">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  {selectedLocation.name}
                </h3>
                <p className="text-muted-foreground capitalize">{selectedLocation.type}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedLocation(null)}>
                ✕
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetMapView}>
            <Navigation className="h-4 w-4 mr-2" />
            Reset View
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>
            −
          </Button>
          <span className="text-sm">{Math.round(zoom * 100)}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>
            +
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#3b82f6]"></span>
          <span>Destination</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#ef4444]"></span>
          <span>Restaurant</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#8b5cf6]"></span>
          <span>Museum</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#22c55e]"></span>
          <span>Park</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#f97316]"></span>
          <span>Market</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-[#06b6d4]"></span>
          <span>Hotel</span>
        </div>
      </div>

      {googleMapsError && (
        <div className="text-sm text-muted-foreground">
          <p>Using interactive canvas map due to Google Maps API restrictions.</p>
          <p className="mt-1">In a production app, you would need to provide your own Google Maps API key.</p>
        </div>
      )}
    </div>
  )
}

