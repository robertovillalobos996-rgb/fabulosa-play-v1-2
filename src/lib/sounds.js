let ctx;

function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return ctx;
}

function beep(freq, duration) {
  const c = getCtx();
  const osc = c.createOscillator();
  const gain = c.createGain();

  osc.connect(gain);
  gain.connect(c.destination);

  osc.frequency.value = freq;
  gain.gain.value = 0.05;

  osc.start();
  osc.stop(c.currentTime + duration);
}

export function playNavSound() {
  beep(700, 0.05);
}

export function playEnterSound() {
  beep(1200, 0.08);
}