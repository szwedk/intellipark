// Current state of the monitored parking spot, held in memory.
//
// The sensor pushes to /api/spot and browsers read it back over SSE, so this
// module is the only place the state lives. That works because IntelliPARK runs
// as a single Next process on the mini PC next to the sensor. On a serverless
// host each instance would keep its own copy, and this would need Redis or
// similar instead.

let state = { occupied: false, since: null, updatedAt: null };
const listeners = new Set();

export function getSpot() {
    return state;
}

export function setSpot(occupied) {
    const now = new Date().toISOString();

    // Keep the original arrival time while the car stays put, so the UI can
    // show how long it has been there.
    const since = occupied ? (state.occupied ? state.since : now) : null;

    state = { occupied, since, updatedAt: now };
    for (const listener of listeners) listener(state);

    return state;
}

export function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
