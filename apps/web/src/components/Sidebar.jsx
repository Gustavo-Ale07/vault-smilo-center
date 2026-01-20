import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Lock, Wallet, TrendingUp, Upload, Settings } from 'lucide-react'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/subscriptions', icon: CreditCard, label: 'Assinaturas' },
  { to: '/app/vault', icon: Lock, label: 'Cofre de Contas' },
  { to: '/app/finances', icon: Wallet, label: 'Financas' },
  { to: '/app/investments', icon: TrendingUp, label: 'Investimentos' },
  { to: '/app/import', icon: Upload, label: 'Importar Extrato' },
  { to: '/app/settings', icon: Settings, label: 'Configuracoes' },
]

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-primary-600">Smilo Vault</h1>
        <p className="text-sm text-gray-500 mt-1">Gestao Pessoal</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700 font-medium' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">Vault Smilo v1.0.0</p>
      </div>
    </aside>
  )
}
