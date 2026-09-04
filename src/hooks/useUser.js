import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { firebaseAuth } from '../firebase_setup/firebase';

// Firebase resolves the signed-in user asynchronously on load, so `loading`
// matters: without it every guarded page flashes its signed-out state first.
export default function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(firebaseAuth(), (next) => {
            setUser(next);
            setLoading(false);
        });
    }, []);

    return { user, loading };
}
