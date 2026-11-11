// Web Audio API Sound Synthesizer & Ambient Generator

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a soothing completion chime (Tibetan bowl / soft harmonic bell)
 */
export function playCompletionChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Harmonic frequencies for a calming warm chime
    const freqs = [528, 792, 1056]; // 528Hz Solfeggio frequency + harmonics
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      const peak = 0.15 / (idx + 1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.4 - idx * 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  } catch (err) {
    console.debug('Audio not supported or blocked:', err);
  }
}

/**
 * Play a subtle soft tap for start/pause
 */
export function playSoftTap() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (err) {
    console.debug('Tap sound failed:', err);
  }
}

// Ambient Sound Controller
let ambientNode: AudioNode | null = null;
let ambientGain: GainNode | null = null;
let ambientInterval: number | null = null;

export function stopAmbientSound() {
  if (ambientInterval) {
    window.clearInterval(ambientInterval);
    ambientInterval = null;
  }
  if (ambientGain && audioCtx) {
    try {
      ambientGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (ambientNode) {
          (ambientNode as AudioBufferSourceNode).stop?.();
          ambientNode.disconnect();
          ambientNode = null;
        }
      }, 550);
    } catch {
      // ignore
    }
  }
}

export function startAmbientSound(type: 'rain' | 'whitenoise' | 'cafebuzz') {
  stopAmbientSound();
  if (type === 'none' as unknown as string) return;

  try {
    const ctx = getAudioContext();
    const bufferSize = ctx.sampleRate * 3; // 3 second loop
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate noise
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (type === 'rain') {
        // Brownish / pink noise for rain
        lastOut = (lastOut + 0.02 * white) / 1.02;
        data[i] = lastOut * 3.5;
      } else if (type === 'cafebuzz') {
        // Low warm drone
        lastOut = (lastOut + 0.04 * white) / 1.04;
        data[i] = lastOut * 2.0;
      } else {
        // Smooth pink/white noise
        lastOut = (lastOut + 0.08 * white) / 1.08;
        data[i] = lastOut * 1.5;
      }
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Filter to shape sound
    const filter = ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
    } else if (type === 'cafebuzz') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(350, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
    }

    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.001, ctx.currentTime);
    ambientGain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1.2); // gentle volume

    noise.connect(filter);
    filter.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    noise.start();
    ambientNode = noise;
  } catch (err) {
    console.debug('Failed to start ambient sound:', err);
  }
}
