import { UserButton, useUser } from '@clerk/clerk-react'
import { Bell } from 'lucide-react'

export default function Topbar() {
  const { user } = useUser()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Ola, {user?.firstName || 'Usuario'}!
          </h2>
          <p className="text-sm text-gray-500">Bem-vindo ao seu painel de gestao pessoal</p>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} className="text-gray-600" />
          </button>

          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}
