// /pages/index.js
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Home() {
  const router = useRouter()
  const [token, setToken] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/dashboard?token=${token}`)
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
