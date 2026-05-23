import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // update react state
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // send POST request to register endpoint
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Registration failed')
        return
      }

      login(data.token, data.user)
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#f7f9fb' }}>

      {/* Nav */}
      <nav className="bg-white border-b sticky top-0 z-50" style={{ borderColor: '#c6c6cd' }}>
        <div className="flex justify-between items-center max-w-[1200px] mx-auto px-10 h-16">
          <button onClick={() => navigate('/')} className="text-lg font-black text-black">
            ScriptFlow
          </button>
        </div>
      </nav>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="bg-white border rounded-xl p-10 w-full max-w-md card-shadow" style={{ borderColor: '#c6c6cd' }}>
          <h1 className="text-2xl font-bold text-black mb-2">Create your account</h1>
          <p className="text-sm mb-8" style={{ color: '#45464d' }}>Start writing better scripts today</p>

          {error && (
            <div className="mb-6 px-4 py-3 rounded-lg text-sm" style={{ backgroundColor: '#ffdad6', color: '#93000a' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: '#45464d' }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-black transition-colors"
                style={{ borderColor: '#c6c6cd' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: '#45464d' }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-black transition-colors"
                style={{ borderColor: '#c6c6cd' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 uppercase tracking-wider" style={{ color: '#45464d' }}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:border-black transition-colors"
                style={{ borderColor: '#c6c6cd' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-sm text-center mt-6" style={{ color: '#45464d' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-black hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}