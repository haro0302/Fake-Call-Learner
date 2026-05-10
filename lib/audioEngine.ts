export type VoiceGender = 'male' | 'female';
export type PlaybackSpeed = 'slow' | 'normal' | 'fast';

const SPEED_RATES: Record<PlaybackSpeed, number> = {
  slow: 0.75,
  normal: 1.0,
  fast: 1.25,
};

export class AudioEngine {
  private cancelled = false;
  private synth: SpeechSynthesis | null = null;
  private audioCtx: AudioContext | null = null;

  constructor(audioCtx?: AudioContext) {
    if (typeof window !== 'undefined') {
      this.synth = window.speechSynthesis;
      if (audioCtx) this.audioCtx = audioCtx;
    }
  }

  cancel() {
    this.cancelled = true;
    this.synth?.cancel();
  }

  isCancelled() {
    return this.cancelled;
  }

  private ctx(): AudioContext {
    if (!this.audioCtx || this.audioCtx.state === 'closed') {
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private playTone(freq: number, durationMs: number, volume = 0.3): Promise<void> {
    return new Promise((resolve) => {
      const ctx = this.ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      // Sharp attack, quick decay for a crisp "beep" sound
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.005);
      gain.gain.setValueAtTime(volume, ctx.currentTime + durationMs / 1000 - 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationMs / 1000);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + durationMs / 1000);
      setTimeout(resolve, durationMs);
    });
  }

  // 3回のプップップッ（電話通知音風）
  async playBeeps(): Promise<void> {
    for (let i = 0; i < 3; i++) {
      if (this.cancelled) return;
      await this.playTone(1000, 120, 0.35);
      await this.wait(130);
    }
    await this.wait(400);
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
          en.find((v) => /samantha|karen|victoria|moira|fiona|zira/i.test(v.name)) ||
          en.find((v) => /female/i.test(v.name)) ||
          en.find((v) => /google/i.test(v.name)) ||
          en[0]
        );
      }
      return (
        en.find((v) => /alex|daniel|fred|tom/i.test(v.name)) ||
        en.find((v) => /male/i.test(v.name)) ||
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
    speed: PlaybackSpeed,
    pitch = 1.0,
  ): Promise<void> {
    if (this.cancelled || !this.synth) return;
    const synth = this.synth;

    return new Promise<void>((resolve) => {
      const utt = new SpeechSynthesisUtterance(text);
      if (voice) utt.voice = voice;
      utt.rate = SPEED_RATES[speed];
      utt.pitch = pitch;
      utt.lang = 'en-US';
      utt.onend = () => resolve();
      utt.onerror = () => resolve();
      synth.speak(utt);
      setTimeout(resolve, 15000);
    });
  }

  async playRingtone(durationMs: number): Promise<void> {
    if (this.cancelled) return;
    const end = Date.now() + durationMs;
    while (!this.cancelled && Date.now() < end) {
      await this.playTone(480, 400, 0.2);
      if (this.cancelled) break;
      await this.wait(200);
      await this.playTone(480, 400, 0.2);
      if (this.cancelled) break;
      await this.wait(1800);
    }
  }
}
