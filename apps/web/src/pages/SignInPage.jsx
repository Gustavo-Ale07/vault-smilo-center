import { SignIn } from '@clerk/clerk-react'
import { Shield, TrendingUp, Lock } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ee] relative overflow-hidden">
      <div className="absolute -top-24 -left-20 h-56 w-56 rounded-full bg-primary-200/40 blur-3xl" />
      <div className="absolute -bottom-28 right-10 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="relative min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
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

          <div className="bg-white/90 border border-slate-200 rounded-3xl shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Entre na sua conta</h2>
              <p className="text-sm text-slate-500 mt-2">Bem-vindo de volta ao seu painel.</p>
            </div>
            <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" redirectUrl="/app" />
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
