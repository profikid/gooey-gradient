import { Blob } from './Blob';

export class Particle {
  private canvas: HTMLCanvasElement;
  private radius: number;
  private x: number;
  private y: number;
  private vx: number;
  private vy: number;
  private hue: number;
  private opacity: number;
  private lastCollision: number;
  private lastDistance?: number;
  public energy: number;
  public maxSpeed: number;
  public gravitationalForce: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.lastCollision = 0;
    this.energy = 0.5;
    this.maxSpeed = 5;
    this.gravitationalForce = 20;
    this.reset();
  }

  reset(): void {
    this.radius = 1.5 + Math.random() * 2;
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.hue = Math.random() * 360;
    this.opacity = 0.6 + Math.random() * 0.4;
  }

  private checkCollision(blob: Blob, playCollisionSound: (velocity: number, blobSize: number) => void): void {
    const dx = this.x - blob.x;
    const dy = this.y - blob.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    
    const wasInside = this.lastDistance && this.lastDistance <= blob.radius;
    const isInside = distance <= blob.radius;
    
    if (!wasInside && isInside && Date.now() - this.lastCollision > 100) {
      this.lastCollision = Date.now();
      playCollisionSound(velocity, blob.radius);
    }
    
    this.lastDistance = distance;
  }

  update(blobs: Blob[], playCollisionSound: (velocity: number, blobSize: number) => void): void {
    let strongestForce = { x: 0, y: 0, magnitude: 0 };
    let secondStrongestForce = { x: 0, y: 0, magnitude: 0 };

    blobs.forEach(blob => {
      this.checkCollision(blob, playCollisionSound);

      const dx = blob.x - this.x;
      const dy = blob.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      const forceMagnitude = (blob.radius * this.gravitationalForce) / (distance * distance);
      const forceX = (dx / distance) * forceMagnitude;
      const forceY = (dy / distance) * forceMagnitude;

      if (forceMagnitude > strongestForce.magnitude) {
        secondStrongestForce = { ...strongestForce };
        strongestForce = { x: forceX, y: forceY, magnitude: forceMagnitude };
      } else if (forceMagnitude > secondStrongestForce.magnitude) {
        secondStrongestForce = { x: forceX, y: forceY, magnitude: forceMagnitude };
      }
    });

    const randomInfluence = Math.random();
    this.vx += (strongestForce.x * 0.7 + secondStrongestForce.x * 0.3) * this.energy * randomInfluence;
    this.vy += (strongestForce.y * 0.7 + secondStrongestForce.y * 0.3) * this.energy * randomInfluence;

    if (Math.random() < 0.05) {
      this.vx += (Math.random() - 0.5) * 0.5;
      this.vy += (Math.random() - 0.5) * 0.5;
    }

    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > this.maxSpeed) {
      this.vx = (this.vx / speed) * this.maxSpeed;
      this.vy = (this.vy / speed) * this.maxSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0) this.x = this.canvas.width;
    if (this.x > this.canvas.width) this.x = 0;
    if (this.y < 0) this.y = this.canvas.height;
    if (this.y > this.canvas.height) this.y = 0;

    this.hue = (this.hue + Math.sqrt(this.vx * this.vx + this.vy * this.vy) * 0.2) % 360;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}