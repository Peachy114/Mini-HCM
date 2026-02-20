import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate, Link } from "react-router-dom";
import { useState } from 'react';

export default function Login() {
    const [ form, setForm ] = useState({
        email: "", password: ""
    });
    const [ err, setErr ] = useState('');
    const navigate = useNavigate();

    // for submitting
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);
             navigate("/dashboard");
        } catch (err) {
            setErr("Invalid email or password");
        }
    }

  return (
    <div>
        <h2>HCM Login</h2>
        {err && <p>{err}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <button type="submit">Login</button>
        </form>
        <p>No account? <Link to="/register">Register</Link></p>
    </div>
  )
}
