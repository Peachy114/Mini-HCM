import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import api from "@/utils/api";
import { useActionState } from "../../hook/useActionState";
import FormInput from "../../components/FormInput";
import { useNavigate, Link } from "react-router-dom";


export default function Register() {
  const [state, { updateForm, setLoading, setError }] = useActionState({
    name: '',
    email: '',
    password: '',
    timezone: 'Asia/Manila',
    scheduleStart: '09:00',
    scheduleEnd: '18:00'
  });

  const navigate = useNavigate();
  const handleChange = (e) => updateForm(e.target.name, e.target.value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, state.form.email, state.form.password);
      const res = await api.post('/auth/register', {
        name: state.form.name,
        timezone: state.form.timezone,
        scheduleStart: state.form.scheduleStart,
        scheduleEnd: state.form.scheduleEnd
      });

      const role = res.data.role;

      alert(`Registered! Welcome ${state.form.name}`);
      if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {state.error && <p>{state.error}</p>}

      <form onSubmit={handleSubmit}>
        <FormInput label="Full Name" name="name" value={state.form.name} onChange={handleChange} required />
        <FormInput label="Email" type="email" name="email" value={state.form.email} onChange={handleChange} required />
        <FormInput label="Password" type="password" name="password" value={state.form.password} onChange={handleChange} required minLength={6} />

        <div>
          <label>Timezone</label><br />
          <select name="timezone" value={state.form.timezone} onChange={handleChange}>
            <option value="Asia/Manila">Asia/Manila</option>
            <option value="Asia/Singapore">Asia/Singapore</option>
            <option value="UTC">UTC</option>
          </select>
        </div>

        <FormInput label="Shift Start" type="time" name="scheduleStart" value={state.form.scheduleStart} onChange={handleChange} />
        <FormInput label="Shift End" type="time" name="scheduleEnd" value={state.form.scheduleEnd} onChange={handleChange} />

        <br />
        <button type="submit" disabled={state.loading}>
          {state.loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p>
        Already have an account?{' '}
        <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}