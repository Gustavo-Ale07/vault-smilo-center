import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">Smilo Vault</h1>
          <p className="text-gray-600">Entre na sua conta</p>
        </div>
        <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" redirectUrl="/app" />
      </div>
    </div>
  )
}
