// IntelliPARK sensor: an HC-SR04 watches one parking spot and prints its state
// over serial. The bridge on the host reads those lines and posts them to the app.
//
// Output is one word per change, "green" or "red", so the host only sees
// transitions rather than a reading every half second.

const int TRIG_PIN = PD5;
const int ECHO_PIN = PD6;
const int RED_LED = PD2;
const int YELLOW_LED = PD3;
const int GREEN_LED = PD4;

// Inches. A car sitting in the spot reads under CLOSE; the gap between the two
// is deliberate, so a reading hovering on the line can't flip the state back and
// forth every cycle.
const long CLOSE = 8;
const long CLEAR = 12;

// pulseIn returns 0 on timeout, and the sensor occasionally returns a wild
// value, so each decision is the median of three reads.
const int SAMPLES = 3;

bool occupied = false;

void setup() {
  Serial.begin(9600);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);

  setLights(false);
  Serial.println("green");
}

void loop() {
  long distance = medianDistance();

  if (distance < 0) {
    // Nothing came back. Hold the current state and show amber rather than
    // reporting the spot free because a ping was lost.
    digitalWrite(YELLOW_LED, HIGH);
    delay(500);
    return;
  }

  bool nowOccupied = occupied ? (distance < CLEAR) : (distance < CLOSE);

  if (nowOccupied != occupied) {
    occupied = nowOccupied;
    setLights(occupied);
    Serial.println(occupied ? "red" : "green");
  }

  delay(500);
}

long readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return -1;

  return (duration / 2) / 74;  // ~74 microseconds per inch, there and back
}

long medianDistance() {
  long readings[SAMPLES];

  for (int i = 0; i < SAMPLES; i++) {
    readings[i] = readDistance();
    delay(20);
  }

  for (int i = 1; i < SAMPLES; i++) {
    long value = readings[i];
    int j = i - 1;
    while (j >= 0 && readings[j] > value) {
      readings[j + 1] = readings[j];
      j--;
    }
    readings[j + 1] = value;
  }

  return readings[SAMPLES / 2];
}

void setLights(bool isOccupied) {
  digitalWrite(RED_LED, isOccupied ? HIGH : LOW);
  digitalWrite(GREEN_LED, isOccupied ? LOW : HIGH);
  digitalWrite(YELLOW_LED, LOW);
}
