export class Blob {
  private canvas: HTMLCanvasElement;
  public radius: number;
  public x: number;
  public y: number;
  private vx: number;
  private vy: number;
  private hue: number;
  private saturation: number;
  private lightness: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.reset();
  }

  reset(): void {
    this.radius = 30 + Math.random() * 40;
    this.x = Math.random() * this.canvas.width;
    this.y = Math.random() * this.canvas.height;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
    this.hue = Math.random() * 360;
    this.saturation = 80 + Math.random() * 20;
    this.lightness = 50 + Math.random() * 10;
  }

  update(): void {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -this.radius * 2) this.x = this.canvas.width + this.radius;
    if (this.x > this.canvas.width + this.radius * 2) this.x = -this.radius;
    if (this.y < -this.radius * 2) this.y = this.canvas.height + this.radius;
    if (this.y > this.canvas.height + this.radius * 2) this.y = -this.radius;

    this.hue = (this.hue + 0.2) % 360;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 1)`;
    ctx.fill();
    ctx.closePath();
  }
}