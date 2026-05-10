export type VoiceGender = 'male' | 'female';
export type PlaybackSpeed = 'slow' | 'normal' | 'fast';

const SPEED_RATES: Record<PlaybackSpeed, number> = {
  slow: 0.75,
  normal: 1.0,
  fast: 1.25,
};

const BEEP_FREQ = 880;
const BEEP_DURATION_MS = 160;
const BEEP_GAP_MS = 200;

export class AudioEngine {
  private cancelled = false;
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
    }
  }

  cancel() {
    this.cancelled = true;
    this.synth?.cancel();
  }

  reset() {
    this.cancelled = false;
  }

  isCancelled() {
    return this.cancelled;
  }

  private ctx(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  private playTone(freq: number, durationMs: number): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
      setTimeout(resolve, durationMs);
    });
  }

  async playBeeps(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      if (this.cancelled) return;
      await this.playTone(BEEP_FREQ, BEEP_DURATION_MS);
      if (i < 2) await this.wait(BEEP_GAP_MS);
    }
    if (!this.cancelled) await this.wait(300);
  }

  async wait(ms: number): Promise<void> {
    if (this.cancelled) return;
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async getVoice(gender: VoiceGender): Promise<SpeechSynthesisVoice | null> {
    if (!this.synth) return null;
    const synth = this.synth;

    const pick = (): SpeechSynthesisVoice | null => {
      const voices = synth.getVoices();
      const en = voices.filter((v) => v.lang.startsWith('en'));
      if (en.length === 0) return null;

      if (gender === 'female') {
        return (
          en.find((v) =>
            /female|samantha|karen|victoria|moira|fiona|zira|google\sus\senglish$/i.test(v.name)
          ) ||
          en.find((v) => /google/i.test(v.name)) ||
          en[0]
        );
      }
      return (
        en.find((v) =>
          /male|alex|daniel|fred|tom|google\sus\senglish\smale/i.test(v.name)
        ) ||
        en.find((v) => /google/i.test(v.name)) ||
        en[0]
      );
    };

    return new Promise((resolve) => {
      const voice = pick();
      if (voice) { resolve(voice); return; }
      synth.addEventListener('voiceschanged', () => resolve(pick()), { once: true });
      setTimeout(() => resolve(pick()), 1000);
    });
  }

  async speak(
    text: string,
    voice: SpeechSynthesisVoice | null,
    speed: PlaybackSpeed
  ): Promise<void> {
    if (this.cancelled || !this.synth) return;
    const synth = this.synth;

    return new Promise<void>((resolve) => {
      const utt = new SpeechSynthesisUtterance(text);
      if (voice) utt.voice = voice;
      utt.rate = SPEED_RATES[speed];
      utt.lang = 'en-US';
      utt.onend = () => resolve();
      utt.onerror = () => resolve();
      synth.speak(utt);

      // Fallback: some browsers stall; resolve after max 15s
      setTimeout(resolve, 15000);
    });
  }

  async playRingtone(durationMs: number): Promise<void> {
    if (this.cancelled) return;
    const end = Date.now() + durationMs;
    while (!this.cancelled && Date.now() < end) {
      await this.playTone(480, 400);
      if (this.cancelled) break;
      await this.wait(200);
      await this.playTone(480, 400);
      if (this.cancelled) break;
      await this.wait(1800);
    }
  }
}
