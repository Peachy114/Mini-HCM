import { signInWithEmailAndPassword } from "firebase/auth";
import { useActionState } from "../../hook/useActionState";
import { auth } from "@/config/firebase";
import FormInput from "@/components/FormInput";
import { useNavigate, Link } from "react-router-dom";
import api from "@/utils/api";

export default function Login () {
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

      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
     <div>
        <h2>Login</h2>
        {state.error && <p>{state.error}</p>}

        <form onSubmit={handleSubmit}>
          <FormInput label="Email" name="email" value={state.form.email} onChange={handleChange} required />
          <FormInput label="Password" name="password" value={state.form.password} onChange={handleChange} required />

          <button type="submit" disabled={state.loading}>
            {state.loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p>
          No account yet?{' '}  <Link to="/register">Register here</Link>
        </p>
      </div>
  )

}