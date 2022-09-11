import { Draw } from "./draw"
import { Position } from "./point"

export class Apple extends Draw {
  x: number = 0
  y: number = 0
  fillColor = 'yellow'

  constructor(canvas: HTMLCanvasElement, private n: number, step?: number ) {
    super(canvas, step)
    this.n = n
  }

  randomSpawn(positions: Position[] ) {
    if (positions.length === 0) return

    const rndIndex = this.randomInteger(0, positions.length - 1)
    this.x = positions[rndIndex].x
    this.y = positions[rndIndex].y
  }

  draw() {
    const {ctx, fillColor, x, y, step} = this
    ctx.beginPath()

    ctx.fillStyle = fillColor
    ctx.fillRect(x * step, y * step, step, step)

    ctx.closePath()
  }
}