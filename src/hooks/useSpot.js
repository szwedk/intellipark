import { useEffect, useState } from 'react';

// Subscribes to the sensor feed. EventSource reconnects on its own if the
// stream drops, which is the main reason this replaced the old 1s polling.
export default function useSpot() {
    const [spot, setSpot] = useState({ occupied: false, since: null });
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const source = new EventSource('/api/spot/stream');

        source.onmessage = (event) => {
            setSpot(JSON.parse(event.data));
            setConnected(true);
        };
        source.onerror = () => setConnected(false);

        return () => source.close();
    }, []);

    return { ...spot, connected };
}
