export abstract class Draw {
  ctx: CanvasRenderingContext2D

  constructor(protected canvas: HTMLCanvasElement, protected step = 20) {
    this.canvas = canvas
    this.step = step
    this.ctx = (canvas.getContext('2d') as CanvasRenderingContext2D)
  }

  public draw() {

  }

  protected randomInteger(min: number, max: number) {
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
  }
}