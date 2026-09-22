// Web Audio API ambient wedding chords and scratch sound synthesizer
class WeddingAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingAmbient = false;
  private ambientTimer: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft sparkle / chime when scratching or revealing
  playChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.0, 1174.66, 1479.98]; // D5, F#5, A5, D6, F#6 pentatonic
      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.05 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.7);
      });
    } catch {
      // Audio might be blocked by browser policy before first interaction
    }
  }

  // Soft scratch rustle sound
  playScratchSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1800;
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // Ignore audio block
    }
  }

  // Celebration fanfare sound on scratch completion
  playFanfare() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      // Majestic chord: D major chord with glockenspiel timbre
      const chord = [293.66, 369.99, 440.0, 587.33, 739.99, 880.0];
      chord.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.0);
      });
    } catch {
      // Ignore
    }
  }

  // Gentle ambient meditative wedding drone / strings
  startAmbientMusic(onStateChange?: (playing: boolean) => void) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      this.isPlayingAmbient = true;
      if (onStateChange) onStateChange(true);

      const rootFreqs = [146.83, 220.0, 293.66, 369.99, 440.0]; // D3, A3, D4, F#4, A4
      let noteIndex = 0;

      const playNextAmbientNote = () => {
        if (!this.isPlayingAmbient || !this.ctx) return;
        const now = this.ctx.currentTime;
        const baseFreq = rootFreqs[noteIndex % rootFreqs.length];
        noteIndex++;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.linearRampToValueAtTime(0.04, now + 1.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 4.8);

        this.ambientTimer = window.setTimeout(playNextAmbientNote, 2200);
      };

      playNextAmbientNote();
    } catch {
      this.isPlayingAmbient = false;
      if (onStateChange) onStateChange(false);
    }
  }

  stopAmbientMusic(onStateChange?: (playing: boolean) => void) {
    this.isPlayingAmbient = false;
    if (this.ambientTimer) {
      window.clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
    if (onStateChange) onStateChange(false);
  }

  toggleAmbient(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isPlayingAmbient) {
      this.stopAmbientMusic(onStateChange);
      return false;
    } else {
      this.startAmbientMusic(onStateChange);
      return true;
    }
  }

  getIsPlaying() {
    return this.isPlayingAmbient;
  }
}

export const weddingAudio = new WeddingAudioEngine();
