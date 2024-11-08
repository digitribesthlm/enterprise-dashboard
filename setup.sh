#!/bin/bash

# Create project and install dependencies
echo "Creating Next.js project..."
npx create-next-app@latest enterprise-dashboard --js --no-tailwind --no-eslint --app --src-dir --import-alias "@/*"
cd enterprise-dashboard

# Install required dependencies
echo "Installing dependencies..."
npm install daisyui@latest
npm install next@latest react@latest react-dom@latest

# Remove default app directory and create pages structure
echo "Setting up project structure..."
rm -rf app
rm -rf src

# Create directory structure
mkdir -p pages/api
mkdir -p components
mkdir -p data

# Create .env.local
echo "Creating .env.local..."
cat > .env.local << EOL
POWER_PLATFORM_API_URL=https://your-api-endpoint.com/power-platform-data
API_TOKEN=your_secret_power_platform_token_2024
EOL

# Create pages/index.js
echo "Creating index.js..."
cat > pages/index.js << EOL
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [token, setToken] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(\`/dashboard?token=\${token}\`)
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Platform Dashboard Access</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Enter access token"
              className="input input-bordered w-full mt-4"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <button className="btn btn-primary w-full mt-4">Access Dashboard</button>
          </form>
        </div>
      </div>
    </div>
  )
}
EOL

# Create pages/dashboard.js
echo "Creating dashboard.js..."
cat > pages/dashboard.js << EOL
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import FeatureCard from '../components/FeatureCard'
import CategorySection from '../components/CategorySection'

export default function Dashboard() {
  const router = useRouter()
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Dashboard implementation...
  }, [router.query])

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return null

  return (
    <div className="min-h-screen bg-base-200 p-8">
      {/* Dashboard content */}
    </div>
  )
}
EOL

# Create components
echo "Creating components..."
cat > components/FeatureCard.js << EOL
export default function FeatureCard({ feature }) {
  return (
    <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all">
      <div className="card-body">
        <h3 className="card-title text-primary border-b border-base-300 pb-2">
          {feature.id}. {feature.name}
        </h3>
        <ul className="mt-4 space-y-2">
          {feature.variations.map((variation, index) => (
            <li 
              key={index}
              className="pb-2 border-b border-base-300 last:border-0 text-base-content/80"
            >
              {variation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
EOL

cat > components/CategorySection.js << EOL
export default function CategorySection({ title, items }) {
  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h3 className="card-title text-base-content">{title}</h3>
        <ul className="mt-2">
          {items.map((item, index) => (
            <li 
              key={index}
              className="py-2 border-b border-base-200 last:border-0 text-base-content/70"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
EOL

# Create middleware.js
echo "Creating middleware.js..."
cat > middleware.js << EOL
import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.nextUrl.searchParams.get('token')
  
  if (!token || token !== process.env.API_TOKEN) {
    return new NextResponse(
      JSON.stringify({ error: 'Authentication required' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    )
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard'
}
EOL

# Create pages/api/data.js
echo "Creating API route..."
cat > pages/api/data.js << EOL
export default async function handler(req, res) {
  const token = req.headers.authorization?.split(' ')[1]
  
  if (!token || token !== process.env.API_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Demo data
  const demoData = {
    title: "Enterprise Platform Features",
    description: "Overview of platform capabilities",
    coreFeatures: [
      {
        id: 1,
        name: "Feature One",
        variations: ["Variation 1.1", "Variation 1.2", "Variation 1.3"]
      }
    ],
    otherCategories: {
      industryApplications: ["Industry 1", "Industry 2"],
      citiesAndTowns: ["City 1", "City 2"],
      advancedTopics: ["Topic 1", "Topic 2"]
    }
  }
  
  res.status(200).json(demoData)
}
EOL

# Create next.config.js
echo "Creating next.config.js..."
cat > next.config.js << EOL
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
EOL

# Create tailwind.config.js
echo "Creating tailwind.config.js..."
cat > tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
}
EOL

# Update or create postcss.config.js
echo "Creating postcss.config.js..."
cat > postcss.config.js << EOL
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOL

# Add Tailwind directives to global CSS
echo "Updating globals.css..."
cat > styles/globals.css << EOL
@tailwind base;
@tailwind components;
@tailwind utilities;
EOL

# Final setup steps
echo "Running final setup..."
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

echo "Setup complete! To start the development server, run:"
echo "cd enterprise-dashboard"
echo "npm run dev"
EOL

To use this script:

1. Save it as `setup.sh`
2. Make it executable:
```bash
chmod +x setup.sh
```

3. Run it:
```bash
./setup.sh
```

The script will:
1. Create a new Next.js project
2. Install all necessary dependencies
3. Create the complete file structure
4. Set up all configuration files
5. Add starter code to all components and pages

After running:
1. Navigate to the project directory
2. Start the development server:
```bash
cd enterprise-dashboard
npm run dev
```

Would you like me to:
1. Add more configuration options?
2. Add more starter code to any files?
3. Add additional setup steps?
4. Modify any of the generated files?