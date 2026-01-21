import { SignIn } from '@clerk/clerk-react'
import { Shield, TrendingUp, Lock } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6 hidden lg:block">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary-700 font-semibold">
                Smilo Vault
              </p>
              <h1
                className="text-4xl sm:text-5xl font-bold text-slate-900 mt-3"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Entre para cuidar do seu dinheiro com segurança.
              </h1>
            </div>
            <p className="text-slate-600 text-lg">
              Centralize assinaturas, cofres e financas em um painel rapido e simples.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
              <FeatureItem icon={<Shield size={18} />} text="Criptografia AES-256" />
              <FeatureItem icon={<TrendingUp size={18} />} text="Dashboards mensais" />
              <FeatureItem icon={<Lock size={18} />} text="Credenciais protegidas" />
            </div>
          </div>

          <div className="bg-white/90 border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8 w-full max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Entrar</h2>
              <p className="text-sm text-slate-500 mt-2">Acesse sua conta com segurança.</p>
            </div>
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              redirectUrl="/app"
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  cardBox: 'w-full',
                  card: 'w-full shadow-none border border-slate-200',
                  headerTitle: 'text-lg',
                  headerSubtitle: 'text-sm',
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureItem({ icon, text }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/70 px-4 py-3 text-sm text-slate-700">
      <span className="text-primary-600">{icon}</span>
      <span>{text}</span>
    </div>
  )
}
