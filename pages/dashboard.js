// File: pages/dashboard.js .
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import data from '../data/config.json'

export default function Dashboard() {
  const router = useRouter()
  const [platformData, setPlatformData] = useState(data)
  const [selections, setSelections] = useState({
    coreFeatures: {},
    industryApplications: {},
    businessAreas: {},
    advancedTopics: {}
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!router.query.token) {
      router.push('/')
      return
    }
    setIsLoading(false)
  }, [router.query])

  const toggleSelection = (category, item) => {
    setSelections(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: !prev[category]?.[item]
      }
    }))
  }

  const exportToCSV = () => {
    const selectedItems = {
      'Core Features': Object.entries(selections.coreFeatures)
        .filter(([_, selected]) => selected)
        .map(([feature]) => feature),
      'Industry Applications': Object.entries(selections.industryApplications)
        .filter(([_, selected]) => selected)
        .map(([app]) => app),
      'Business Areas': Object.entries(selections.businessAreas)
        .filter(([_, selected]) => selected)
        .map(([area]) => area),
      'Advanced Topics': Object.entries(selections.advancedTopics)
        .filter(([_, selected]) => selected)
        .map(([topic]) => topic)
    }
  
    // Create a more structured CSV that includes main categories
    const csvRows = ['Category,Main Feature,Selected Item']
    
    // Add Core Features with their parent categories
    platformData.coreFeatures.forEach(feature => {
      const mainFeature = feature.name
      feature.variations.forEach(variation => {
        if (selections.coreFeatures[variation]) {
          csvRows.push(`Core Features,${mainFeature},${variation}`)
        }
      })
      // Also add the main feature if it's selected
      if (selections.coreFeatures[mainFeature]) {
        csvRows.push(`Core Features,${mainFeature},${mainFeature} (Main Category)`)
      }
    })
  
    // Add other categories
    Object.entries(platformData.otherCategories).forEach(([category, items]) => {
      const categoryName = category
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      
      items.forEach(item => {
        if (selections[category]?.[item]) {
          csvRows.push(`${categoryName},,${item}`)
        }
      })
    })
  
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const date = new Date().toISOString().split('T')[0]
    link.href = URL.createObjectURL(blob)
    link.download = `selected_features_${date}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  function FeatureCard({ feature = {} }) {
    const { id = '', name = '', variations = [] } = feature
  
    if (!variations || variations.length === 0) return null
  
    const allSelected = variations.every(v => !!selections.coreFeatures[v])
    
    const toggleAll = () => {
      const newValue = !allSelected
      const updates = {}
      variations.forEach(variation => {
        updates[variation] = newValue
      })
      setSelections(prev => ({
        ...prev,
        coreFeatures: {
          ...prev.coreFeatures,
          ...updates
        }
      }))
    }
  
    return (
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="card-body p-6">
          <div className="flex justify-between items-center border-b border-base-300 pb-4">
            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded-lg text-sm">
                {id}
              </span>
              {name}
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-medium text-base-content/70">Include All</span>
              <div className="relative inline-flex cursor-pointer">
                <input 
                  type="checkbox"
                  className="sr-only peer"
                  checked={allSelected}
                  onChange={toggleAll}
                />
                <div className="w-11 h-6 bg-base-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </div>
            </label>
          </div>
          <ul className="mt-4 space-y-2">
            {variations.map((variation, index) => (
              <li 
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-base-200/30 hover:bg-base-200 transition-all duration-300"
              >
                <span className="text-base-content flex-1 mr-4">{variation}</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-sm font-medium text-base-content/70">
                    {selections.coreFeatures[variation] ? 'Selected' : 'Select'}
                  </span>
                  <div className="relative inline-flex cursor-pointer">
                    <input 
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!selections.coreFeatures[variation]}
                      onChange={() => toggleSelection('coreFeatures', variation)}
                    />
                    <div className="w-11 h-6 bg-base-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  
  
  

  function CategorySection({ title, items = [], category }) {
    if (!items || items.length === 0) return null
    
    const allSelected = items.every(item => !!selections[category]?.[item])
    
    const toggleAll = () => {
      const newValue = !allSelected
      const updates = {}
      items.forEach(item => {
        updates[item] = newValue
      })
      setSelections(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          ...updates
        }
      }))
    }
    
    return (
      <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="card-body p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-primary">{title}</h3>
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                {items.length} items
              </span>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-medium text-base-content/70">Include All</span>
              <div className="relative inline-flex cursor-pointer">
                <input 
                  type="checkbox"
                  className="sr-only peer"
                  checked={allSelected}
                  onChange={toggleAll}
                />
                <div className="w-11 h-6 bg-base-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
              </div>
            </label>
          </div>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li 
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-base-200/30 hover:bg-base-200 transition-all duration-300"
              >
                <span className="text-base-content flex-1 mr-4">{item}</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <span className="text-sm font-medium text-base-content/70">
                    {selections[category]?.[item] ? 'Selected' : 'Select'}
                  </span>
                  <div className="relative inline-flex cursor-pointer">
                    <input 
                      type="checkbox"
                      className="sr-only peer"
                      checked={!!selections[category]?.[item]}
                      onChange={() => toggleSelection(category, item)}
                    />
                    <div className="w-11 h-6 bg-base-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </div>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }
  
  
  
  

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center bg-base-100 rounded-box p-8 shadow-xl gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {platformData?.title}
            </h1>
            <p className="text-base-content/70 mt-4 text-lg">
              {platformData?.description}
            </p>
          </div>
          <button 
  onClick={exportToCSV}
  className="btn btn-primary btn-lg gap-2 rounded-xl hover:scale-105 transition-transform duration-300"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
  Export Selections
</button>
        </div>

        <div className="bg-base-100 rounded-box p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <h2 className="text-2xl font-bold text-primary">Core Platform & Features</h2>
            <div className="badge badge-primary badge-lg">
              {platformData?.coreFeatures?.length} Core Features
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformData?.coreFeatures?.map(feature => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CategorySection 
            title="Industry Applications" 
            items={platformData?.otherCategories?.industryApplications}
            category="industryApplications"
          />
          <CategorySection 
            title="Business Areas" 
            items={platformData?.otherCategories?.businessAreas}
            category="businessAreas"
          />
          <CategorySection 
            title="Advanced Topics" 
            items={platformData?.otherCategories?.advancedTopics}
            category="advancedTopics"
          />
        </div>
      </div>
    </div>
  )
}