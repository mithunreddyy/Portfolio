class SoundSystem {
  private context: AudioContext | null = null;
  public enabled: boolean = true;

  init() {
    if (!this.context && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      this.context = new AudioContext();
    }
  }

  playHover() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.context.currentTime + 0.05);

    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, this.context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.05);
  }

  playClick() {
    if (!this.enabled || !this.context) return;
    if (this.context.state === 'suspended') this.context.resume();

    const osc = this.context.createOscillator();
    const gain = this.context.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(800, this.context.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, this.context.currentTime + 0.1);

    gain.gain.setValueAtTime(0, this.context.currentTime);
    gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.context.destination);

    osc.start();
    osc.stop(this.context.currentTime + 0.1);
  }
}

export const soundEngine = new SoundSystem();
