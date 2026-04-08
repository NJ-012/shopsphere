import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

function LoginPage() {
  // Keep the form empty so login only happens with real user accounts.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const toast = useToastStore();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="mesh-card rounded-[2.5rem] p-10">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-600">Login</p>
          <h1 className="display-font mt-4 text-5xl font-bold leading-tight text-slate-950">
            Return to your curated fashion workspace.
          </h1>
          <p className="mt-5 max-w-lg text-slate-600">
            Sign in with your configured email to access your personalized product dashboard.
          </p>
          <div className="mt-10 rounded-3xl border border-white/60 bg-white/70 p-5 text-sm text-slate-600">
            <p>
              Use the email and password for an account that exists in your database.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-[2.5rem] p-8 sm:p-10">
          <div className="space-y-6">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent outline-none"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <Lock className="h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent outline-none"
                  required
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                </button>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

            <p className="text-center text-sm text-slate-500">
              New here?{' '}
              <Link to="/register" className="font-bold text-slate-900">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
