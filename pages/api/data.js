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
