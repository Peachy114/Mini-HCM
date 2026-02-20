import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";

export default function Register() {
    const [form, setForm ] = useState({
        name: "", email: "", password: "",
    });

    const [err, setErr] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth, form.email, form.password
            )

            await setDoc(doc(db, "users", user.uid), {
                name: form.name,
                email: form.email,
                role: 'employee',
                timezone: form.timezone,
                schedule: {
                    start: form.scheduleStart,
                    end: form.scheduleEnd
                },
                createdAt: new Date(),
            });

            navigate("/dashboard");
        } catch (err) {
            setErr(err.message);
        }
    };

    return (
        <div>
            <h2>Create Account</h2>
            {err && <p>{err}</p>}
            <form onSubmit={handleSubmit}>
            <input placeholder="Full Name"
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input  type="email" placeholder="Email"
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            <input type="password" placeholder="Password"
                value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
            <label>Shift Start</label>
            </form>

             <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    )
}