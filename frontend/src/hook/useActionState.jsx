import { useState } from "react";

export function useActionState(initialForm) {
    const [state, setState] = useState({
        form: initialForm,
        loading: false,
        error: ''
    });

    const updateForm = (field, value) => {
        setState(prev => ({
            ...prev,
            form: { ...prev.form, [field]: value }
        }));
    }

    const setLoading = (loading) => {
        setState(prev => ({ ...prev, loading}));
    };

    const setError = (error) => {
        setState(prev => ({...prev, error}));
    }

    return [state, { updateForm, setLoading, setError}];
}