import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Hero from '../components/hero';
import Login from './login';
import useUser from '../hooks/useUser';

export default function Home() {
    const { user } = useUser();

    const button = `button-login px-6 py-3 rounded-md font-semibold cursor-pointer ${
        user ? '' : 'grayed-out'
    }`;

    return (
        <div>
            <Head>
                <title>IntelliPARK</title>
            </Head>

            <Hero />

            <div className="flex flex-col items-center pt-10 mt-40">
                <div className="w-96 bg-gray-100/30 p-12 rounded-xl">
                    <div className="text-center mb-6">
                        <Image
                            className="rounded-xl"
                            src="/images/intelliPARK-logo.png"
                            alt="IntelliPARK"
                            width={340}
                            height={200}
                        />
                    </div>

                    <div className="text-center mb-8">
                        <Login />
                    </div>

                    <div className="flex justify-evenly pt-2 py-10">
                        <Link href="/parking" className={button}>
                            Parking
                        </Link>
                        <Link href="/showspots" className={button}>
                            Spots
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
