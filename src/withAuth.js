import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useUser from './hooks/useUser';

export default function withAuth(Component) {
    return function Guarded(props) {
        const router = useRouter();
        const { user, loading } = useUser();

        useEffect(() => {
            if (!loading && !user) router.replace('/login');
        }, [loading, user, router]);

        if (loading) return <p className="p-8">Loading…</p>;
        if (!user) return null;

        return <Component {...props} />;
    };
}
