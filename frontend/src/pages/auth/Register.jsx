import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import api from "@/utils/api";
import { useActionState } from "../../hooks/useActionState";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Register() {
  const [state, { updateForm, setLoading, setError }] = useActionState({
    name:     '',
    email:    '',
    password: '',
    timezone: 'Asia/Manila',
  });

  const { refreshProfile, skipFetch } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e) => updateForm(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      skipFetch.current = true;
      const credential = await createUserWithEmailAndPassword(auth, state.form.email, state.form.password);
      const token = await credential.user.getIdToken();
      const res = await api.post('/auth/register', {
        name:     state.form.name,
        timezone: state.form.timezone,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await refreshProfile();
      const role = res.data.role;
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-stone-900 mb-4">
            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h1 className="text-lg font-bold text-stone-900 tracking-tight">MiniHCM Demo</h1>
          <p className="text-xs text-stone-400 mt-1">Create your account to get started</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-sm font-bold text-stone-800">Create an account</h2>
            <p className="text-xs text-stone-400 mt-0.5">Fill in the details below to register.</p>
          </div>

          {state.error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
              {state.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={state.form.name}
                onChange={handleChange}
                placeholder="Juan dela Cruz"
                required
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-stone-800 placeholder-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                value={state.form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-stone-800 placeholder-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={state.form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-stone-800 placeholder-stone-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Timezone</label>
              <select
                name="timezone"
                value={state.form.timezone}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-stone-700 bg-white"
              >
                <option value="Asia/Manila">Asia/Manila</option>
                <option value="Asia/Singapore">Asia/Singapore</option>
                <option value="UTC">UTC</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full py-2.5 text-sm font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-1"
            >
              {state.loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-500 hover:text-blue-600 font-semibold">
            Sign in here
          </Link>
        </p>

        {/* Demo note */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <p className="text-[10px] text-stone-400 font-medium">Test demo — data may be reset anytime</p>
        </div>

      </div>
    </div>
  );
}