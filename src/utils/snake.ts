import { Draw } from "./draw"
import { Position } from "./point"


export class Snake extends Draw {
  private x = 0
  private y = 0
  color = '#FFF'
  headColor = 'blue'
  private tails: Position[] = []
  dividerSize = 2;
  dividerStep = this.step - this.dividerSize
  dividerPosition = this.dividerSize / 2

  draw() {
    const {x, y, ctx, color, tails, dividerPosition, dividerStep, headColor} = this
    ctx.beginPath()
    ctx.fillStyle = headColor

    ctx.fillRect(dividerPosition + x, dividerPosition + y, dividerStep, dividerStep)
    tails.forEach(tail => {
      ctx.fillStyle = color
      ctx.fillRect(tail.x + dividerPosition, tail.y + dividerPosition, dividerStep, dividerStep)
    })
    ctx.beginPath()
    
    this.tailsDivider()
    this.headDivider()
  }

  headDivider() {
    const {x, y, tails} = this
    const lastTail = tails[tails.length - 1]
    if (lastTail) {
      this.drawTailDivider({x, y}, lastTail)
    }
  }

  tailsDivider() {
    const {tails} = this
    tails.forEach((tail, i) => {
      const nextTail = tails[i + 1]
      if (!nextTail) return
      this.drawTailDivider(tail, nextTail)
    })
  }

  drawTailDivider(tail: Position, nextTail: Position) {
    const {step, ctx, color, dividerSize, dividerPosition, dividerStep} = this

    let tailX = tail.x - dividerPosition
    let tailY = tail.y + dividerPosition
    ctx.beginPath()
    ctx.fillStyle = color
    if (nextTail.x > tail.x) {
      ctx.fillRect(tailX + step, tailY, dividerSize, dividerStep)
    }
    if (nextTail.x < tail.x) {
      ctx.fillRect(tailX, tailY, dividerSize, dividerStep)
    }

    tailX = tail.x + dividerPosition
    tailY = tail.y - dividerSize
    if (nextTail.y > tail.y) {
      ctx.fillRect(tailX, tailY + step + dividerPosition, dividerStep, dividerSize)
    }

    if (nextTail.y < tail.y) {
      ctx.fillRect(tailX, tailY + dividerPosition, dividerStep, dividerSize)
    }
    ctx.closePath()
  }

  go({x, y}: Position) {
    const {step} = this

    if (this.tails.length !== 0) {
      for (let i = 0; i < this.tails.length - 1; i++) {
        this.tails[i] = this.tails[i + 1]
      }
      this.tails[this.tails.length - 1] = {x: this.x, y: this.y}
    }
    
    this.x = x * step
    this.y = y * step
  }

  addTail() {
    const {x, y} = this;
    this.tails.push({x, y})
  }

  getPosition(): Position {
    const {x, y, step} = this
    return {x: x / step, y: y / step}
  }
  
  getTails(): Position[] {
    return this.tails.map(t => ({x: t.x / this.step, y: t.y / this.step}))
  }

  getTailsLength() {
    return this.tails.length
  }
}