import { UserButton, useUser } from '@clerk/clerk-react'
import { Bell, Menu } from 'lucide-react'

export default function Topbar({ onMenuClick }) {
  const { user } = useUser()

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Abrir menu"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Olá, {user?.firstName || 'Usuário'}!
            </h2>
            <p className="text-sm text-gray-500">Bem-vindo ao seu painel de gestão pessoal</p>
          </div>
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
