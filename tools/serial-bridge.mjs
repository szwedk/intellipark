// Reads the Arduino's serial output and forwards spot changes to the app.
//
// This replaces the original setup, which piped the sensor into Excel via the
// Data Streamer add-in and had the API route read a cell out of the workbook on
// every request.
//
// Usage: SENSOR_TOKEN=... node tools/serial-bridge.mjs /dev/tty.usbmodem14201

import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { execFileSync } from 'node:child_process';

const port = process.argv[2] ?? process.env.SERIAL_PORT;
const app = process.env.APP_URL ?? 'http://localhost:3000';
const token = process.env.SENSOR_TOKEN;
const baud = process.env.BAUD ?? '9600';

if (!port) {
    console.error('Usage: node tools/serial-bridge.mjs <serial-port>');
    process.exit(1);
}
if (!token) {
    console.error('SENSOR_TOKEN must be set, and must match the app.');
    process.exit(1);
}

// The sketch prints plain lines, so once the port is in raw mode at the right
// baud we can read it like any other file. Saves pulling in a serial library.
execFileSync('stty', ['-f', port, baud, 'raw', '-echo']);

let last = null;

const lines = createInterface({ input: createReadStream(port) });

lines.on('line', async (line) => {
    const occupied = { red: true, green: false }[line.trim()];
    if (occupied === undefined || occupied === last) return;

    last = occupied;

    try {
        const res = await fetch(`${app}/api/spot`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ occupied }),
        });

        if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
        console.log(`${new Date().toISOString()} ${occupied ? 'occupied' : 'free'}`);
    } catch (err) {
        // Don't let a blip in the app stop us reading the sensor.
        last = null;
        console.error('post failed:', err.message);
    }
});

lines.on('close', () => {
    console.error(`${port} closed`);
    process.exit(1);
});
