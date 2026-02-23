// import { signInWithEmailAndPassword } from "firebase/auth";
// import { useActionState } from "../../hooks/useActionState";
// import { auth } from "@/config/firebase";
// import FormInput from "@/components/FormInput";
// import { useNavigate, Link } from "react-router-dom";
// import api from "@/utils/api";

// export default function Login () {
//   const [state, { updateForm, setLoading, setError }] = useActionState({
//     email: '',
//     password: '',
//   });

//   const navigate = useNavigate();
//   const handleChange = (e) => updateForm(e.target.name, e.target.value);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       await signInWithEmailAndPassword(auth, state.form.email, state.form.password);
//       const res = await api.post('/auth/login');
//       const role = res.data.user.role;

//       if (role === 'admin') {
//         navigate('/admin/dashboard');
//       } else {
//         navigate('/dashboard');
//       }
      
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//      <div>
//         <h2>Login</h2>
//         {state.error && <p>{state.error}</p>}

//         <form onSubmit={handleSubmit}>
//           <FormInput label="Email" name="email" value={state.form.email} onChange={handleChange} required />
//           <FormInput label="Password" name="password" value={state.form.password} onChange={handleChange} required />

//           <button type="submit" disabled={state.loading}>
//             {state.loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <p>
//           No account yet?{' '}  <Link to="/register">Register here</Link>
//         </p>
//       </div>
//   )

// }==============================LOGIN====================================


import { signInWithEmailAndPassword } from "firebase/auth";
import { useActionState } from "../../hooks/useActionState";
import { auth } from "@/config/firebase";
import { useNavigate, Link } from "react-router-dom";
import api from "@/utils/api";

export default function Login() {
  const [state, { updateForm, setLoading, setError }] = useActionState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const handleChange = (e) => updateForm(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, state.form.email, state.form.password);
      const res = await api.post('/auth/login');
      const role = res.data.user.role;
      navigate(role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.message);
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
          <p className="text-xs text-stone-400 mt-1">Human Capital Management · Test Environment</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm">

          <div className="mb-5">
            <h2 className="text-sm font-bold text-stone-800">Sign in to your account</h2>
            <p className="text-xs text-stone-400 mt-0.5">Enter your credentials to continue.</p>
          </div>

          {state.error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
              {state.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-stone-800 placeholder-stone-300"
              />
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className="w-full py-2.5 text-sm font-semibold rounded-xl bg-stone-900 text-white hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all mt-1"
            >
              {state.loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-400 mt-4">
          No account yet?{' '}
          <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold">
            Register here
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