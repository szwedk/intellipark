import Head from 'next/head';
import withAuth from '../withAuth';
import useSpot from '../hooks/useSpot';
import useElapsed from '../hooks/useElapsed';

function formatDuration(totalSeconds) {
    const pad = (n) => String(n).padStart(2, '0');
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${pad(hours)}:${pad(minutes)}:${pad(totalSeconds % 60)}`;
}

function formatArrival(since) {
    if (!since) return '—';

    return new Date(since).toLocaleTimeString('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });
}

function Parking() {
    const { occupied, since, connected } = useSpot();
    const elapsed = useElapsed(since);

    return (
        <>
            <Head>
                <title>Parking</title>
            </Head>

            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-gray-100/30 p-12 rounded-xl">
                    <div className="flex items-center justify-center gap-16">
                        <div
                            className={`w-40 h-40 rounded-2xl transition-colors duration-500 ${
                                occupied ? 'bg-red-600' : 'bg-green-600'
                            }`}
                        />

                        <div className="text-center">
                            <div className="mb-8 bg-gray-300 p-4 rounded-md">
                                <p className="text-black text-xl font-semibold">Spot available</p>
                                <div className="mt-4 text-3xl">{occupied ? 'No' : 'Yes'}</div>
                            </div>

                            <div className="bg-gray-300 p-4 rounded-md">
                                <p className="text-black text-xl font-semibold">Arrived</p>
                                <div className="mt-2 text-2xl">{formatArrival(since)}</div>
                                <div className="mt-2 text-2xl tabular-nums">
                                    {formatDuration(elapsed)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {!connected && (
                        <p className="mt-6 text-center text-sm text-white">
                            Waiting for the sensor…
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}

export default withAuth(Parking);
