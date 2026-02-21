import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
    const { profile, logout  } = useAuth();

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, <strong>{profile.name}</strong></p>
            <p>Email:    {profile.email}</p>
            <p>Role:     <strong>{profile.role}</strong></p>
            <p>Timezone: {profile.timezone}</p>
            <p>Shift:    {profile.schedule.start} – {profile.schedule.end}</p>
            <br />
            <button onClick={logout}>Logout</button>
        </div>
    )
}