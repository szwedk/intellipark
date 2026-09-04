import Head from 'next/head';
import withAuth from '../withAuth';
import useSpot from '../hooks/useSpot';

// Only 1A has a sensor on it. The rest of the lot is mapped out but not wired,
// so they are shown as unknown rather than pretending they are free.
const SPOTS = ['1A', '1B', '2A', '2B', '3A', '3B'];
const MONITORED = '1A';

function SpotRow({ id, occupied, monitored }) {
    const colour = !monitored ? 'bg-gray-500' : occupied ? 'bg-red-600' : 'bg-green-600';

    return (
        <li className="flex justify-center p-4">
            <span
                className={`w-40 text-center font-bold text-sm py-2 rounded-md text-white transition-colors duration-300 ${colour}`}
            >
                {id}
                {!monitored && <span className="font-normal"> · no sensor</span>}
            </span>
        </li>
    );
}

function ShowSpots() {
    const { occupied } = useSpot();

    return (
        <>
            <Head>
                <title>Spots</title>
            </Head>

            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-gray-100/30 p-12 rounded-xl">
                    <ul>
                        {SPOTS.map((id) => (
                            <SpotRow
                                key={id}
                                id={id}
                                occupied={occupied}
                                monitored={id === MONITORED}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}

export default withAuth(ShowSpots);
