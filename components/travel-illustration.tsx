export function TravelIllustration() {
  return (
    <div className="relative w-full h-full">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="max-w-full max-h-full"
        >
          {/* Background elements */}
          <circle cx="400" cy="300" r="150" fill="#E6F0FF" className="dark:fill-blue-900/20" />
          <circle cx="400" cy="300" r="100" fill="#CCE0FF" className="dark:fill-blue-800/20" />

          {/* Sun/Moon */}
          <circle cx="600" cy="120" r="60" fill="#FFD700" className="dark:fill-gray-300 animate-pulse-slow" />

          {/* Clouds */}
          <g className="animate-float">
            <ellipse cx="200" cy="150" rx="60" ry="30" fill="#F8FAFC" className="dark:fill-gray-700" />
            <ellipse cx="170" cy="140" rx="50" ry="25" fill="#F8FAFC" className="dark:fill-gray-700" />
            <ellipse cx="240" cy="140" rx="50" ry="25" fill="#F8FAFC" className="dark:fill-gray-700" />
          </g>

          <g className="animate-float-delay-1">
            <ellipse cx="500" cy="180" rx="40" ry="20" fill="#F8FAFC" className="dark:fill-gray-700" />
            <ellipse cx="480" cy="170" rx="30" ry="15" fill="#F8FAFC" className="dark:fill-gray-700" />
            <ellipse cx="530" cy="170" rx="30" ry="15" fill="#F8FAFC" className="dark:fill-gray-700" />
          </g>

          {/* Mountains */}
          <path
            d="M0 400 L200 200 L300 300 L500 100 L700 300 L800 200 L800 600 L0 600 Z"
            fill="#4CAF50"
            className="dark:fill-green-900"
          />
          <path
            d="M0 450 L200 350 L400 450 L600 350 L800 450 L800 600 L0 600 Z"
            fill="#388E3C"
            className="dark:fill-green-800"
          />

          {/* Water */}
          <path
            d="M300 500 Q350 480 400 500 Q450 520 500 500 L500 600 L300 600 Z"
            fill="#2196F3"
            className="dark:fill-blue-800"
          />

          {/* Airplane */}
          <g className="animate-float-delay-2">
            <path d="M650 250 L700 270 L650 290 L670 270 Z" fill="#F44336" className="dark:fill-red-500" />
            <rect x="600" y="265" width="50" height="10" fill="#F44336" className="dark:fill-red-500" />
            <path d="M600 260 L580 250 L580 290 L600 280 Z" fill="#F44336" className="dark:fill-red-500" />
          </g>

          {/* Palm tree */}
          <rect x="150" y="450" width="10" height="50" fill="#795548" className="dark:fill-amber-900" />
          <path
            d="M130 450 Q150 420 170 450 Q190 420 210 450 Q170 430 130 450 Z"
            fill="#4CAF50"
            className="dark:fill-green-700"
          />

          {/* Building */}
          <rect x="350" y="400" width="100" height="100" fill="#9E9E9E" className="dark:fill-gray-600" />
          <rect x="370" y="420" width="20" height="20" fill="#FFEB3B" className="dark:fill-yellow-500" />
          <rect x="410" y="420" width="20" height="20" fill="#FFEB3B" className="dark:fill-yellow-500" />
          <rect x="370" y="460" width="20" height="40" fill="#FFEB3B" className="dark:fill-yellow-500" />
        </svg>
      </div>
    </div>
  )
}

