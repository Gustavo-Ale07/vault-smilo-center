import './App.css'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react'

function App() {
  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">Smilo Vault</div>
        <div className="auth-actions">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn secondary">Entrar</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn primary">Criar conta</button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <div className="signed-in">
              <span>Bem-vindo!</span>
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </header>

      <main className="hero">
        <div className="hero-content">
          <h1>Organize sua vida financeira com seguranca.</h1>
          <p>
            Controle assinaturas, cofres de senha e fluxo financeiro em um so lugar.
          </p>
          <div className="hero-actions">
            <SignedOut>
              <SignUpButton mode="modal">
                <button className="btn primary">Comecar agora</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <button className="btn primary">Ir para o painel</button>
            </SignedIn>
          </div>
        </div>
        <div className="hero-card">
          <div className="stat">
            <span className="stat-label">Economia mensal</span>
            <span className="stat-value">R$ 1.240,00</span>
          </div>
          <div className="stat">
            <span className="stat-label">Assinaturas ativas</span>
            <span className="stat-value">12</span>
          </div>
          <div className="stat">
            <span className="stat-label">Cofres seguros</span>
            <span className="stat-value">38</span>
          </div>
        </div>
      </main>

      <section className="features">
        <div className="feature">
          <h3>Cofre criptografado</h3>
          <p>Senhas protegidas com AES-256-GCM.</p>
        </div>
        <div className="feature">
          <h3>Dashboard claro</h3>
          <p>Graficos e metas de gasto por categoria.</p>
        </div>
        <div className="feature">
          <h3>Importacao simples</h3>
          <p>CSV com validacao e preview.</p>
        </div>
      </section>
    </div>
  )
}

export default App
