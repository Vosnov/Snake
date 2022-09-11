import { Draw } from "./draw"

export class Apple extends Draw {
  x: number = 0
  y: number = 0
  fillColor = 'yellow'

  constructor(canvas: HTMLCanvasElement, private n: number, step?: number ) {
    super(canvas, step)
    this.n = n
  }

  randomSpawn() {
    this.x = this.randomInteger(0, this.n - 1)
    this.y = this.randomInteger(0, this.n - 1)
  }

  draw() {
    const {ctx, fillColor, x, y, step} = this
    ctx.beginPath()

    ctx.fillStyle = fillColor
    ctx.fillRect(x * step, y * step, step, step)

    ctx.closePath()
  }
}