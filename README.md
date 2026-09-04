# IntelliPARK

A parking spot that tells you whether it's free. An ultrasonic sensor on an
Arduino watches one bay, and a Next.js app shows its state live, behind a Google
sign-in.

Built in 2023 for a campus parking project; rebuilt in 2026 on Next 16 and the
Firebase v12 SDK.

## How it fits together

```
HC-SR04 ──► Arduino ──serial──► serial-bridge.mjs ──POST──► /api/spot
                                                               │
                                            browser ◄──SSE──── /api/spot/stream
```

The sketch prints `green` or `red` on a change, and only on a change. The bridge
reads those lines off the serial port and posts them to the app, which holds the
current state in memory and pushes it to any open browser over server-sent events.

The original version did this differently: the Arduino fed Excel through the
Data Streamer add-in, and an API route opened the workbook and read cell B22 on
every request while the page polled once a second. That worked, but it meant a
spreadsheet had to stay open for the site to know anything, so it's gone.

Because state lives in the process, this wants to run as a single Next server —
which it does, on a mini PC next to the sensor. On a serverless host each
instance would hold its own copy and you'd want Redis in place of `src/lib/spot.js`.

## Running it

```bash
npm install
cp .env.example .env.local   # fill in the Firebase config and pick a SENSOR_TOKEN
npm run dev
```

Then, with the Arduino plugged in:

```bash
SENSOR_TOKEN=... npm run bridge -- /dev/tty.usbmodem14201
```

`ls /dev/tty.usbmodem*` will tell you the port. Without the bridge running the
app still works — the spot just reads as free and the page says it's waiting for
the sensor.

## The sensor

Thresholds are 8 inches to call the spot taken and 12 to call it free again. The
gap is deliberate: a car parked right on a single threshold would otherwise flip
the state every read. Each decision is the median of three pings, since the
HC-SR04 returns the occasional wild value and `pulseIn` returns 0 when nothing
comes back at all.

## Layout

```
intelliPARK_redone.ino     the sketch
tools/serial-bridge.mjs    serial ─► HTTP, no dependencies
src/lib/spot.js            current state, and who to tell when it changes
src/pages/api/spot/        GET state, POST a reading, SSE stream
src/hooks/                 useUser, useSpot, useElapsed
src/withAuth.js            redirects signed-out visitors to /login
```

## Known limits

Only spot 1A has a sensor. The others are drawn on the spots page and marked as
having none, rather than shown as free.
