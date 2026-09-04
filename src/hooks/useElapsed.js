import { useEffect, useState } from 'react';

// Seconds since `since`, ticking once a second. Derived from a clock rather than
// accumulated, so it stays right if the tab is backgrounded and the timer drifts.
export default function useElapsed(since) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        if (!since) return;

        const id = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(id);
    }, [since]);

    if (!since) return 0;

    return Math.max(0, Math.floor((now - new Date(since).getTime()) / 1000));
}
