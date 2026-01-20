import { UserProfile } from '@clerk/clerk-react'
import Card from '../components/Card'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuracoes</h1>
        <p className="text-gray-600 mt-1">Gerencie sua conta e preferencias</p>
      </div>

      <Card>
        <UserProfile />
      </Card>

      <Card title="Sobre o Vault Smilo">
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Versao:</strong> 1.0.0 MVP
          </p>
          <p>
            <strong>Seguranca:</strong> Todas as senhas sao criptografadas com AES-256-GCM
          </p>
          <p className="text-sm text-gray-600">
            Este e um MVP (Produto Minimo Viavel). Funcionalidades adicionais serao implementadas
            nas proximas versoes.
          </p>
        </div>
      </Card>
    </div>
  )
}
