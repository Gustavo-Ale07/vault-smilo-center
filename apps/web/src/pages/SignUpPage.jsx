import { SignUp } from '@clerk/clerk-react'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-600 mb-2">Smilo Vault</h1>
          <p className="text-gray-600">Crie sua conta gratuitamente</p>
        </div>
        <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" redirectUrl="/app" />
      </div>
    </div>
  )
}
