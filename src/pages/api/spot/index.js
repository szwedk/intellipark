import { getSpot, setSpot } from '../../../lib/spot';

export default function handler(req, res) {
    if (req.method === 'GET') {
        return res.status(200).json(getSpot());
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.SENSOR_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'SENSOR_TOKEN is not set' });
    }
    if (req.headers.authorization !== `Bearer ${token}`) {
        return res.status(401).json({ error: 'Bad sensor token' });
    }

    const { occupied } = req.body ?? {};
    if (typeof occupied !== 'boolean') {
        return res.status(400).json({ error: 'Expected { occupied: boolean }' });
    }

    return res.status(200).json(setSpot(occupied));
}
