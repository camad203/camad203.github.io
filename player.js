/* ═══════════════════════════════════════════════════════════════
   player.js  —  Nocturne Ambient Player
   ═══════════════════════════════════════════════════════════════

   QUICK CUSTOMISATION GUIDE
   ─────────────────────────
   • TRACKS      — edit the `tracks` array to rename tracks and
                   change their tempo (bpm).
   • MELODIES    — edit the `melodies` array to change the notes.
                   Each number is a frequency in Hz (concert pitch).
                   Middle C = 261.63, see chart at bottom of file.
   • CHORDS      — background pad / bass notes (same Hz values).
   • STARFIELD   — tweak NUM_STARS, star size, and twinkle speed.
   ═══════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────────────────
   STARFIELD
   NUM_STARS   — how many stars to draw
   r range     — star radius (0.2 – 1.4 px by default)
   da range    — twinkle speed (higher = faster flicker)
   ───────────────────────────────────────────────────────────── */
(function () {
  const canvas = document.getElementById('starfield');
  const ctx    = canvas.getContext('2d');
  const NUM_STARS = 140;  /* ← change to add/remove stars */
  let stars = [];

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: NUM_STARS }, () => ({
      x:  Math.random() * canvas.width,
      y:  Math.random() * canvas.height,
      r:  Math.random() * 1.2 + 0.2,    /* star radius */
      a:  Math.random(),                  /* starting opacity */
      da: (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1), /* twinkle speed */
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.a += s.da;
      if (s.a <= 0 || s.a >= 1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(220, 215, 240, ${s.a * 0.7})`; /* star colour */
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
})();


/* ─────────────────────────────────────────────────────────────
   WAVEFORM BARS
   NUM_BARS — how many bars to show in the animated waveform
   ───────────────────────────────────────────────────────────── */
const NUM_BARS   = 22;  /* ← change to add/remove bars */
const waveformEl = document.getElementById('waveform');

for (let i = 0; i < NUM_BARS; i++) {
  const b = document.createElement('div');
  b.className = 'bar';
  b.style.setProperty('--h',     (5 + Math.random() * 20) + 'px');  /* max bar height */
  b.style.setProperty('--dur',   (0.55 + Math.random() * 0.65) + 's');
  b.style.setProperty('--delay', (Math.random() * 0.8) + 's');
  waveformEl.appendChild(b);
}


/* ─────────────────────────────────────────────────────────────
   TRACKS
   name — displayed as the track title
   meta — displayed as the subtitle line
   bpm  — tempo; lower = slower, higher = faster
   ───────────────────────────────────────────────────────────── */
const tracks = [
  { name: 'Nocturne in C minor', meta: 'generative · ambient · ∞', bpm: 68 },
  { name: 'Stellar Drift',       meta: 'ethereal · slow · ∞',      bpm: 52 },
  { name: 'Midnight Garden',     meta: 'lo‑fi · dreamy · ∞',       bpm: 84 },
];
/* Add more tracks by copying one of the lines above, e.g:
   { name: 'My Track',  meta: 'chill · looping · ∞', bpm: 75 },
   Then add a matching row to melodies[] and chords[] below.    */


/* ─────────────────────────────────────────────────────────────
   MELODIES
   One array per track (must match order of tracks[] above).
   Each number = a note frequency in Hz.
   Hz reference (middle octave):
     C4=261.63  D4=293.66  E4=329.63  F4=349.23
     G4=392.00  A4=440.00  B4=493.88
   One octave up = multiply by 2.  One octave down = divide by 2.
   ───────────────────────────────────────────────────────────── */
const melodies = [
  /* Track 0 — Nocturne in C minor */
  [261.63, 293.66, 329.63, 349.23, 392.00, 349.23, 329.63, 293.66],
  /* Track 1 — Stellar Drift */
  [220.00, 246.94, 261.63, 293.66, 329.63, 293.66, 261.63, 246.94],
  /* Track 2 — Midnight Garden */
  [196.00, 220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00],
];


/* ─────────────────────────────────────────────────────────────
   CHORDS  (background pads and bass)
   One array per track. Each inner array is one chord = 3 notes.
   Keep frequencies in the lower range for a full, warm sound.
   ───────────────────────────────────────────────────────────── */
const chords = [
  /* Track 0 */
  [[130.81, 164.81, 196.00], [146.83, 185.00, 220.00], [110.00, 138.59, 165.00]],
  /* Track 1 */
  [[110.00, 138.59, 165.00], [123.47, 155.56, 185.00], [98.00,  123.47, 147.00]],
  /* Track 2 */
  [[98.00,  123.47, 147.00], [110.00, 138.59, 165.00], [130.81, 164.81, 196.00]],
];


/* ─────────────────────────────────────────────────────────────
   BUILD TRACK SELECTOR DOTS
   (auto-generated from the tracks array — no need to edit)
   ───────────────────────────────────────────────────────────── */
const dotsEl = document.getElementById('trackDots');
tracks.forEach((_, i) => {
  const d     = document.createElement('div');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.onclick   = () => selectTrack(i);
  dotsEl.appendChild(d);
});


/* ═══════════════════════════════════════════════════════════════
   AUDIO ENGINE
   You probably don't need to edit anything below this line
   unless you want to change the sound character of the synth.
   ═══════════════════════════════════════════════════════════════ */

let audioCtx    = null;
let masterGain  = null;
let playing     = false;
let trackIdx    = 0;
let currentNodes  = [];
let loopTimeouts  = [];
let elapsed       = 0;
let timerInterval = null;
let volume        = 0.7;
let panelVisible  = false;

/* Create (or return) the Web Audio context */
function getCtx() {
  if (!audioCtx) {
    audioCtx   = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = volume;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

/* Build a simple impulse-response reverb */
function makeReverb(ctx, decay) {
  const conv = ctx.createConvolver();
  const len  = Math.floor(ctx.sampleRate * decay);
  const buf  = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++)
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.5);
  }
  conv.buffer = buf;
  return conv;
}

/* Schedule a single note
   wave — oscillator type: 'sine' | 'triangle' | 'square' | 'sawtooth'
   Changing 'triangle' to 'sine' makes the melody softer/rounder.    */
function playNote(freq, start, dur, amp, wave = 'sine', reverb = null) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const g   = ctx.createGain();
  osc.type  = wave;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(amp, start + 0.06);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(g);
  if (reverb) { g.connect(reverb); reverb.connect(masterGain); }
  else        { g.connect(masterGain); }
  osc.start(start);
  osc.stop(start + dur + 0.1);
  currentNodes.push(osc, g);
  if (reverb) currentNodes.push(reverb);
}

/* Schedule one full loop of the current track */
function scheduleLoop() {
  const ctx     = getCtx();
  const now     = ctx.currentTime;
  const bpm     = tracks[trackIdx].bpm;
  const beat    = 60 / bpm;
  const mel     = melodies[trackIdx];
  const chd     = chords[trackIdx];
  const loopLen = mel.length * beat * 2;

  function oneLoop(offset) {
    for (let i = 0; i < mel.length; i++) {
      const t = now + offset + i * beat;
      /* Melody note — change 'triangle' here to alter the lead sound */
      playNote(mel[i], t, beat * 2.0, 0.16, 'triangle', makeReverb(ctx, 1.8));
      /* Bass note on beats 0 and 4 */
      if (i === 0 || i === 4) {
        const c = chd[Math.floor(i / 4) % chd.length];
        c.forEach(f => playNote(f * 0.5, t, beat * 4.2, 0.06, 'sine'));
      }
      /* Pad on every other beat */
      if (i % 2 === 0) {
        const c = chd[Math.floor(i / 2) % chd.length];
        c.forEach(f => playNote(f, t, beat * 3.5, 0.04, 'sine'));
      }
    }
  }

  oneLoop(0);
  oneLoop(loopLen);   /* schedule two loops ahead to prevent gaps */

  /* Re-schedule 200ms before the loop ends */
  const id = setTimeout(() => {
    if (playing) scheduleLoop();
  }, (loopLen * 1000) - 200);
  loopTimeouts.push(id);
}

/* Stop all audio immediately */
function stopAudio() {
  loopTimeouts.forEach(clearTimeout);
  loopTimeouts = [];
  currentNodes.forEach(n => {
    try { n.stop && n.stop(0); }  catch (e) {}
    try { n.disconnect(); }       catch (e) {}
  });
  currentNodes = [];
}

/* Toggle waveform bar animation */
function setWaveActive(on) {
  document.querySelectorAll('.bar').forEach(b => b.classList.toggle('active', on));
}

/* Start the elapsed-time counter */
function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!playing) return;
    elapsed++;
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    document.getElementById('elapsed').textContent = m + ':' + String(s).padStart(2, '0');

    const loopLen = melodies[trackIdx].length * (60 / tracks[trackIdx].bpm) * 2;
    const pct     = ((elapsed % Math.round(loopLen)) / Math.round(loopLen)) * 100;
    document.getElementById('progressFill').style.width = Math.min(pct, 100) + '%';
  }, 1000);
}


/* ─────────────────────────────────────────────────────────────
   UI INTERACTIONS  (called from onclick / oninput in HTML)
   ───────────────────────────────────────────────────────────── */

/* Called when the floating image is clicked */
function handleImageClick() {
  if (!panelVisible) {
    panelVisible = true;
    document.getElementById('musicPanel').classList.add('visible');
  }
  togglePlay();
}

/* Called by the play/pause button and the image click */
function togglePlay() {
  const btn     = document.getElementById('playBtn');
  const floater = document.getElementById('floater');
  const hint    = document.getElementById('tapHint');

  if (!playing) {
    playing = true;
    getCtx().resume();
    scheduleLoop();
    setWaveActive(true);
    btn.innerHTML = '&#9646;&#9646;';
    btn.classList.add('playing');
    floater.classList.add('playing');
    hint.textContent = 'click to pause';
    elapsed = 0;
    startTimer();
  } else {
    playing = false;
    stopAudio();
    setWaveActive(false);
    btn.innerHTML = '&#9654;';
    btn.classList.remove('playing');
    floater.classList.remove('playing');
    hint.textContent = 'click to play';
    clearInterval(timerInterval);
  }
}

/* Called by the volume slider (oninput in HTML) */
function setVolume(val) {
  volume = val / 100;
  document.getElementById('volLabel').textContent = val;
  if (masterGain) masterGain.gain.value = volume;
}

/* Update track title, meta and reset progress */
function updateTrackUI() {
  const t = tracks[trackIdx];
  document.getElementById('trackName').textContent = t.name;
  document.getElementById('trackMeta').textContent = t.meta;
  elapsed = 0;
  document.getElementById('elapsed').textContent    = '0:00';
  document.getElementById('progressFill').style.width = '0%';
  document.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === trackIdx)
  );
}

/* Switch to a specific track by index */
function selectTrack(idx) {
  if (idx === trackIdx) return;
  trackIdx = idx;
  updateTrackUI();
  if (playing) { stopAudio(); scheduleLoop(); }
}

function prevTrack() { selectTrack((trackIdx - 1 + tracks.length) % tracks.length); }
function nextTrack() { selectTrack((trackIdx + 1) % tracks.length); }

/* Click on the progress bar to seek (jumps position in the loop) */
document.getElementById('progressTrack').addEventListener('click', function (e) {
  const pct     = e.offsetX / this.offsetWidth;
  const loopLen = melodies[trackIdx].length * (60 / tracks[trackIdx].bpm) * 2;
  elapsed       = Math.floor(pct * Math.round(loopLen));
  document.getElementById('progressFill').style.width = (pct * 100).toFixed(1) + '%';
});

/* Keyboard shortcuts
   Space      → play / pause
   ArrowLeft  → previous track
   ArrowRight → next track                                        */
document.addEventListener('keydown', e => {
  if (e.code === 'Space')      { e.preventDefault(); panelVisible ? togglePlay() : handleImageClick(); }
  if (e.code === 'ArrowLeft')  prevTrack();
  if (e.code === 'ArrowRight') nextTrack();
});
