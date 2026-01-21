import { UserProfile, useClerk } from '@clerk/clerk-react'
import Card from '../components/Card'

export default function SettingsPage() {
  const { openUserProfile } = useClerk()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-gray-600 mt-1">Gerencie sua conta e preferências</p>
      </div>

      <Card>
        <div className="space-y-4">
          <div className="md:hidden">
            <p className="text-sm text-gray-600">
              Abra o perfil completo para editar dados, emails e conexoes.
            </p>
            <button
              type="button"
              className="btn-primary mt-4"
              onClick={() => openUserProfile()}
            >
              Abrir perfil
            </button>
          </div>
          <div className="hidden md:block overflow-x-auto">
            <UserProfile />
          </div>
        </div>
      </Card>

      <Card title="Sobre o Vault Smilo">
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>Versão:</strong> 1.0.0 MVP
          </p>
          <p>
            <strong>Segurança:</strong> Todas as senhas são criptografadas com AES-256-GCM
          </p>
          <p className="text-sm text-gray-600">
            Este é um MVP (Produto Mínimo Viável). Funcionalidades adicionais serão implementadas
            nas próximas versões.
          </p>
        </div>
      </Card>
    </div>
  )
}
