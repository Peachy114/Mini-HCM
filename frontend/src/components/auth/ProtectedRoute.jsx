import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useState} from "react";


export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, profile, loading, refreshProfile } = useAuth();
  const [waited, setWaited] = useState(false);

  useEffect(() => {
    if (user && !profile && !loading) {
      refreshProfile();
    }
  }, [user, profile, loading]);

  // After 3 seconds give up waiting for profile
  useEffect(() => {
    const timer = setTimeout(() => setWaited(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user)   return <Navigate to="/login" replace />;

  // Still waiting for profile
  if (!profile && !waited) return <p>Loading profile...</p>;

  // Profile never loaded — send to login
  if (!profile && waited) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// export default function ProtectedRoute({ children, allowedRules }) {
//     const { user, profile, loading, refreshProfile} = useAuth();

//     useEffect(() => {
//         if (user && !profile && !loading) {
//             refreshProfile();
//         }
//     }, [user, profile, loading]);
    


//     if (loading) return <p>Loading...</p>
//     if (!profile) return <Navigate to='/login' replace />;

//     if (!user) {
//         return <Navigate to='/login' replace />
//     }

//     if (allowedRules && !allowedRules.includes(profile.role)) {
//         return <Navigate to="/unauthorized" replace />;
//     }

//     return children;
// }