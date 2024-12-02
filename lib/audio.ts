export class AudioService {
  private audioContext: AudioContext | null = null;
  private baseFrequency: number = 200;
  private soundVolume: number = 0.15;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || window.AudioContext)();
    }
  }

  setBaseFrequency(frequency: number) {
    this.baseFrequency = frequency;
  }

  setSoundVolume(volume: number) {
    this.soundVolume = volume;
  }

  playCollisionSound(velocity: number, blobSize: number) {
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    const frequency = this.baseFrequency + (velocity * 100) + blobSize;
    const volume = Math.min(velocity * 0.1, this.soundVolume);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  cleanup() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
