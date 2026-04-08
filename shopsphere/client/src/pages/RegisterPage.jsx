import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, Phone, Store, User } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useToastStore from '../store/toastStore';

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
    shop_name: '',
  });
  const register = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const toast = useToastStore();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        shop_name: formData.role === 'VENDOR' ? formData.shop_name : '',
      });
      toast.success('Account created. Please sign in.');
      navigate('/login');
    } catch (error) {
      toast.error(error.message);
    }
  }

  function updateField(key, value) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="px-4 pb-16 pt-28 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2">
        <div className="mesh-card rounded-[2.5rem] p-10">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-amber-600">Join ShopSphere</p>
          <h1 className="display-font mt-4 text-5xl font-bold leading-tight text-slate-950">
            Build a customer account or launch your vendor storefront.
          </h1>
          <p className="mt-5 max-w-lg text-slate-600">
             Register your secure account to launch your dedicated storefront platform.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel rounded-[2.5rem] p-8 sm:p-10">
          <div className="grid gap-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Full name</span>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <User className="h-5 w-5 text-slate-400" />
                <input value={formData.full_name} onChange={(event) => updateField('full_name', event.target.value)} className="w-full bg-transparent outline-none" required />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <input type="email" value={formData.email} onChange={(event) => updateField('email', event.target.value)} className="w-full bg-transparent outline-none" required />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Phone</span>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <input value={formData.phone} onChange={(event) => updateField('phone', event.target.value)} className="w-full bg-transparent outline-none" required />
              </div>
            </label>

            <div>
              <span className="mb-2 block text-sm font-semibold text-slate-700">Account type</span>
              <div className="grid grid-cols-2 gap-3">
                {['CUSTOMER', 'VENDOR'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => updateField('role', role)}
                    className={`rounded-2xl px-4 py-3 text-sm font-bold transition ${
                      formData.role === role ? 'bg-slate-900 text-white' : 'bg-white text-slate-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {formData.role === 'VENDOR' && (
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Shop name</span>
                <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                  <Store className="h-5 w-5 text-slate-400" />
                  <input value={formData.shop_name} onChange={(event) => updateField('shop_name', event.target.value)} className="w-full bg-transparent outline-none" required />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <Lock className="h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  className="w-full bg-transparent outline-none"
                  minLength={6}
                  required
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-slate-400" /> : <Eye className="h-5 w-5 text-slate-400" />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</span>
              <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                <Lock className="h-5 w-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  className="w-full bg-transparent outline-none"
                  minLength={6}
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-slate-900">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
