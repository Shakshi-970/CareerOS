import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'

// Fake Google accounts for demo — maps email domains to display names
function googleDisplayName(email: string): string {
  const local = email.split('@')[0] ?? 'user'
  return local
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

export function LoginPage() {
  const navigate = useNavigate()
  const signIn = useAuthStore(s => s.signIn)
  const isAnalyzed = useProfileStore(s => s.isAnalyzed)

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const dest = isAnalyzed ? '/dashboard' : '/connect'

  function handleGoogleSignIn() {
    setError(null)
    setGoogleLoading(true)
    // Simulate OAuth round-trip (1.2 s)
    setTimeout(() => {
      signIn({
        name: 'Google User',
        email: 'user@gmail.com',
        provider: 'google',
      })
      setGoogleLoading(false)
      navigate(dest)
    }, 1200)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!email.trim()) { setError('Email is required.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address.'); return }
    if (!password) { setError('Password is required.'); return }
    if (mode === 'signup' && password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (mode === 'signup' && !name.trim()) { setError('Your name is required.'); return }

    setFormLoading(true)
    setTimeout(() => {
      signIn({
        name: mode === 'signup' ? name.trim() : googleDisplayName(email),
        email: email.trim().toLowerCase(),
        provider: 'email',
      })
      setFormLoading(false)
      navigate(dest)
    }, 800)
  }

  const loading = googleLoading || formLoading

  return (
    <div className="min-h-screen bg-panel flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-emer rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-ink text-xl">CareerOS</span>
        </div>

        <div className="bg-paper rounded-2xl shadow-sm border border-hair p-7">
          <h1 className="text-xl font-bold text-ink mb-1">
            {mode === 'signin' ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-sm text-muted mb-6">
            {mode === 'signin'
              ? 'Sign in to your CareerOS account'
              : 'Start your free career intelligence scan'}
          </p>

          {/* Google */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-hair rounded-xl py-2.5 text-sm font-medium text-ink hover:bg-panel disabled:opacity-60 disabled:cursor-not-allowed transition-colors mb-4"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-emer" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            {googleLoading ? 'Signing in…' : 'Continue with Google'}
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-hair" />
            <span className="text-xs text-faint">or</span>
            <div className="flex-1 h-px bg-hair" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="text-xs font-semibold text-muted block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Shafaque Naaz"
                  disabled={loading}
                  className="w-full px-3 py-2.5 rounded-lg border border-hair text-sm text-ink placeholder-faint focus:outline-none focus:border-emer focus:ring-1 focus:ring-emer/10 disabled:opacity-60"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-muted block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                className="w-full px-3 py-2.5 rounded-lg border border-hair text-sm text-ink placeholder-faint focus:outline-none focus:border-emer focus:ring-1 focus:ring-emer/10 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="········"
                  disabled={loading}
                  className="w-full px-3 py-2.5 pr-10 rounded-lg border border-hair text-sm text-ink placeholder-faint focus:outline-none focus:border-emer focus:ring-1 focus:ring-emer/10 disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-faint hover:text-muted"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-xs text-amber-w bg-amber-t border border-amber-w/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emer hover:bg-emer-d disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {formLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-5">
          {mode === 'signin' ? (
            <>
              New to CareerOS?{' '}
              <button
                onClick={() => { setMode('signup'); setError(null) }}
                className="text-emer font-semibold hover:underline"
              >
                Start your free career scan
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => { setMode('signin'); setError(null) }}
                className="text-emer font-semibold hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </p>
        <p className="text-center mt-2">
          <button onClick={() => navigate('/')} className="text-xs text-faint hover:text-muted">
            ← Back to home
          </button>
        </p>
      </div>
    </div>
  )
}
