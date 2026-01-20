import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import api from '../services/api'

export default function AppLayout() {
  const { isSignedIn } = useAuth()

  useEffect(() => {
    if (!isSignedIn) return
    api.getMe().catch(() => {})
  }, [isSignedIn])

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
