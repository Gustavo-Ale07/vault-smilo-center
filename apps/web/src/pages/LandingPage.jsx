import { Link } from 'react-router-dom'
import { Shield, TrendingUp, Lock, Zap, CheckCircle, ArrowRight, Sparkles } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f3ee] text-slate-900">
      <header className="border-b border-slate-200/70 bg-[#f7f3ee]/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary-600/10 flex items-center justify-center">
              <Sparkles className="text-primary-600" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-700">Smilo Vault</h1>
              <p className="text-xs text-slate-500">Gestão pessoal e cofres seguros</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link to="/sign-in" className="btn-secondary w-full sm:w-auto text-center">
              Entrar
            </Link>
            <Link to="/sign-up" className="btn-primary w-full sm:w-auto text-center">
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-xs font-semibold uppercase tracking-widest text-primary-700 border border-primary-100">
              Cofres seguros + controle mensal
            </span>
            <h2
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Organize assinaturas, senhas e finanças em um painel único.
            </h2>
            <p className="text-lg text-slate-600 max-w-xl">
              Acompanhe gastos recorrentes, veja a evolução do seu patrimônio e guarde credenciais
              com criptografia AES-256-GCM.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/sign-up" className="btn-primary text-base px-6 py-3 w-full sm:w-auto text-center">
                Criar conta
              </Link>
              <Link to="/sign-in" className="btn-secondary text-base px-6 py-3 flex items-center justify-center gap-2 w-full sm:w-auto">
                Ver painel <ArrowRight size={16} />
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200">100% web</span>
              <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200">CSV simples</span>
              <span className="px-3 py-1 rounded-full bg-white/70 border border-slate-200">Graficos claros</span>
            </div>
          </div>

          <div className="bg-white/80 border border-slate-200 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">Resumo mensal</p>
                <h3 className="text-2xl font-semibold text-slate-900">Janeiro 2026</h3>
              </div>
              <span className="text-sm text-emerald-600 font-semibold">+12% eficiencia</span>
            </div>
            <div className="space-y-4">
              <Insight label="Assinaturas ativas" value="12" />
              <Insight label="Cofres protegidos" value="38" />
              <Insight label="Economia estimada" value="R$ 1.240,00" />
            </div>
            <div className="mt-6 p-4 rounded-2xl bg-slate-900 text-white">
              <p className="text-xs uppercase tracking-widest text-slate-400">Próxima renovação</p>
              <p className="text-lg font-semibold">Netflix - 10/02</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <h3 className="text-3xl font-bold">Tudo que você precisa em um só lugar</h3>
              <p className="text-slate-600 mt-2 max-w-2xl">
                Um fluxo simples para manter seu dinheiro e suas senhas sob controle, sem planilhas
                espalhadas.
              </p>
            </div>
            <Link to="/sign-up" className="btn-primary">
              Começar agora
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Shield className="text-primary-600" size={28} />}
              title="Cofre seguro"
              description="Senhas protegidas com AES-256-GCM e acesso auditado."
            />
            <FeatureCard
              icon={<TrendingUp className="text-primary-600" size={28} />}
              title="Investimentos"
              description="Projecoes claras e visao de patrimonio consolidado."
            />
            <FeatureCard
              icon={<Lock className="text-primary-600" size={28} />}
              title="Assinaturas"
              description="Alertas e categorias para controlar gastos recorrentes."
            />
            <FeatureCard
              icon={<Zap className="text-primary-600" size={28} />}
              title="Finanças"
              description="Dashboard rápido com comparativos mensais."
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-center">
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">Por que escolher o Smilo Vault?</h3>
            <p className="text-slate-600">
              Um MVP enxuto para você construir disciplina financeira sem fricção.
            </p>
            <div className="space-y-3">
              <Strength text="Criptografia de ponta sem exposição de senha." />
              <Strength text="Interface responsiva e pronta para VPS." />
              <Strength text="Importação de extratos e categorias sugeridas." />
              <Strength text="Painel único com indicadores principais." />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <StatCard label="Tempo economizado" value="8h/mês" />
            <StatCard label="Assinaturas mapeadas" value="+90%" />
            <StatCard label="Segurança ativa" value="AES-256" />
            <StatCard label="Dashboards" value="4 modos" />
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-4xl font-bold" style={{ fontFamily: "'Fraunces', serif" }}>
            Pronto para organizar sua vida financeira?
          </h3>
            <p className="text-lg text-slate-300">
              Cadastre-se gratuitamente e comece a usar hoje mesmo.
            </p>
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-8 py-3 rounded-full font-semibold hover:bg-slate-100 transition-colors"
          >
            Criar minha conta <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-slate-200 bg-[#f7f3ee]">
        <div className="max-w-6xl mx-auto text-center text-slate-500">
          <p>2026 Smilo Vault Center. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>
      </div>
      <h4 className="font-semibold text-lg mb-2">{title}</h4>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  )
}

function Strength({ text }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle className="text-primary-600 flex-shrink-0" size={24} />
      <p className="text-slate-700">{text}</p>
    </div>
  )
}

function Insight({ label, value }) {
  return (
    <div className="flex items-center justify-between border border-slate-200 rounded-2xl px-4 py-3 bg-white">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-base font-semibold text-slate-900">{value}</span>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-3">{value}</p>
    </div>
  )
}
