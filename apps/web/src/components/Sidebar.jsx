import { NavLink } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Lock, Wallet, TrendingUp, Upload, Settings, X } from 'lucide-react'

const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/app/subscriptions', icon: CreditCard, label: 'Assinaturas' },
  { to: '/app/vault', icon: Lock, label: 'Cofre de Contas' },
  { to: '/app/finances', icon: Wallet, label: 'Finanças' },
  { to: '/app/investments', icon: TrendingUp, label: 'Investimentos' },
  { to: '/app/import', icon: Upload, label: 'Importar Extrato' },
  { to: '/app/settings', icon: Settings, label: 'Configurações' },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 lg:static lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary-600">Smilo Vault</h1>
          <p className="text-sm text-gray-500 mt-1">Gestão Pessoal</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Fechar menu"
        >
          <X size={18} />
        </button>
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
