import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRules }) {
    const { user, profile, loading, refreshProfile} = useAuth();

    useEffect(() => {
        if (user && !profile && !loading) {
            refreshProfile();
        }
    }, [user, profile, loading]);


    if (loading) return <p>Loading...</p>
    if (!profile) return <Navigate to='/login' replace />;

    if (!user) {
        return <Navigate to='/login' replace />
    }

    if (allowedRules && !allowedRules.includes(profile.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}