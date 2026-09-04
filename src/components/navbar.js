import Link from 'next/link';
import { useRouter } from 'next/router';
import useUser from '../hooks/useUser';
import { googleSignOut } from '../firebase_setup/firebase';

export default function NavigationBar() {
    const { pathname } = useRouter();
    const { user } = useUser();

    const link = (href) =>
        `px-3 py-2 font-bold bg-transparent border-0 cursor-pointer ${
            pathname === href ? 'text-red-600' : 'text-black'
        }`;

    return (
        <nav className="flex justify-between">
            <Link href="/" className={link('/')}>
                Home
            </Link>

            {user ? (
                <button onClick={googleSignOut} className={link('/signout')}>
                    Sign Out
                </button>
            ) : (
                <Link href="/login" className={link('/login')}>
                    Sign In
                </Link>
            )}
        </nav>
    );
}
