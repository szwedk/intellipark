import { useEffect } from 'react';
import Link from 'next/link';
import { googleSignOut } from '../firebase_setup/firebase';

export default function SignOut() {
    useEffect(() => {
        googleSignOut().catch((error) => console.error('Error signing out:', error));
    }, []);

    return (
        <div className="p-8 text-center">
            <p>Signing out…</p>
            <Link href="/">Go to Homepage</Link>
        </div>
    );
}
