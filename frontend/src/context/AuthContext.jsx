import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/config/firebase";
import api from "@/utils/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [ user, setUser ] = useState(null);
    const [ profile, setProfile ] = useState(null);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        //firebase auth listener
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try{
                    const res = await api.get('/auth/me');
                    setProfile(res.data);
                } catch (err) {
                    setProfile(null);
                }
            } else {
                setUser(null);
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    async function refreshProfile() {
        try {
            const res = await api.get('/auth/me');
            setProfile(res.data);
        } catch(err) {
            setProfile(null);
        }
    }

    function logout() {
        signOut(auth);
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile }}>
            { children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext);
}