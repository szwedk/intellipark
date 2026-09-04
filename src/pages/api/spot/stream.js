import { getSpot, subscribe } from '../../../lib/spot';

export default function handler(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
    });

    const send = (spot) => res.write(`data: ${JSON.stringify(spot)}\n\n`);
    send(getSpot());

    const unsubscribe = subscribe(send);

    // Proxies drop an idle event stream, so keep it warm with a comment line.
    const keepAlive = setInterval(() => res.write(': keep-alive\n\n'), 20000);

    req.on('close', () => {
        clearInterval(keepAlive);
        unsubscribe();
        res.end();
    });
}
