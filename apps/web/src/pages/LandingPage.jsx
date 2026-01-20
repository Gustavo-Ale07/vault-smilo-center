import { Link } from 'react-router-dom'
import { Shield, TrendingUp, Lock, Zap, CheckCircle, AlertTriangle } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary-600">Smilo Vault</h1>
          <div className="flex gap-4">
            <Link to="/sign-in" className="btn-secondary">
              Entrar
            </Link>
            <Link to="/sign-up" className="btn-primary">
              Comecar Gratis
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            O melhor site de gestao pessoal
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Controle suas assinaturas, proteja suas senhas, gerencie suas financas
            e acompanhe seus investimentos em um so lugar.
          </p>
          <Link to="/sign-up" className="btn-primary text-lg px-8 py-3">
            Comece Agora - 100% Gratis
          </Link>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Tudo que voce precisa em um so lugar
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Shield className="text-primary-600" size={32} />}
              title="Cofre Seguro"
              description="Guarde suas senhas com criptografia AES-256-GCM"
            />
            <FeatureCard
              icon={<TrendingUp className="text-primary-600" size={32} />}
              title="Investimentos"
              description="Simule e acompanhe o crescimento dos seus investimentos"
            />
            <FeatureCard
              icon={<Lock className="text-primary-600" size={32} />}
              title="Assinaturas"
              description="Nunca mais esquece de uma renovacao importante"
            />
            <FeatureCard
              icon={<Zap className="text-primary-600" size={32} />}
              title="Financas"
              description="Dashboard completo de receitas e despesas"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">
            Por que escolher o Smilo Vault?
          </h3>
          <div className="space-y-4">
            <Strength text="Criptografia de ponta: suas senhas nunca ficam expostas" />
            <Strength text="Interface intuitiva e responsiva" />
            <Strength text="Dashboard com graficos visuais" />
            <Strength text="Importacao de extratos via CSV" />
            <Strength text="Simulacao de investimentos com juros compostos" />
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-yellow-50 border-y border-yellow-200">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-yellow-600" size={32} />
            <h3 className="text-2xl font-bold">Limitacoes atuais do MVP</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Acreditamos em transparencia. Esta e a versao MVP do Smilo Vault, e algumas
            funcionalidades ainda estao sendo desenvolvidas:
          </p>
          <ul className="space-y-2 text-gray-700">
            <li>- Sem app mobile (apenas web responsivo)</li>
            <li>- Importacao CSV simples (sem parse avancado)</li>
            <li>- Graficos basicos (futuras versoes terao mais opcoes)</li>
            <li>- Sem integracao bancaria automatica (Open Finance em roadmap)</li>
            <li>- Suporte a uma moeda (BRL)</li>
          </ul>
        </div>
      </section>

      <section className="py-20 px-6 bg-primary-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-4xl font-bold mb-6">Pronto para organizar sua vida financeira?</h3>
          <p className="text-xl mb-8 text-primary-100">
            Cadastre-se gratuitamente e comece a usar agora mesmo.
          </p>
          <Link
            to="/sign-up"
            className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Criar Minha Conta
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center text-gray-600">
          <p>2026 Smilo Vault Center. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-4">{icon}</div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  )
}

function Strength({ text }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="text-primary-600 flex-shrink-0" size={24} />
      <p className="text-gray-700">{text}</p>
    </div>
  )
}
