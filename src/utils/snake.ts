import { Draw } from "./draw"

export type TailPosition = {
  x: number
  y: number
}
export type SnakeDirection = [1 | 0 | -1, 1 | 0 | -1]

export class Snake extends Draw {
  x = 0
  y = 0
  direction: SnakeDirection = [1, 1]
  color = '#FFF'
  tails: TailPosition[] = []
  dividerSize = 2;
  dividerStep = this.step - this.dividerSize
  dividerPosition = this.dividerSize / 2

  draw() {
    const {x, y, ctx, color, tails, dividerPosition, dividerStep} = this
    ctx.beginPath()
    ctx.fillStyle = color

    ctx.fillRect(dividerPosition + x, dividerPosition + y, dividerStep, dividerStep)
    tails.forEach(tail => {
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

  drawTailDivider(tail: TailPosition, nextTail: TailPosition) {
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

  go(x?: number, y?: number) {
    const {direction, step} = this
    const [dirX, dirY] = direction

    if (this.tails.length !== 0) {
      for (let i = 0; i < this.tails.length - 1; i++) {
        this.tails[i] = this.tails[i + 1]
      }
      this.tails[this.tails.length - 1] = {x: this.x, y: this.y}
    }
    
    if (x !== undefined && y !== undefined) {
      this.x = x * step
      this.y = y * step
    } else {
      this.x += dirX * step
      this.y += dirY * step
    }
  }

  addTail() {
    const {x, y} = this;
    this.tails.push({x, y})
  }

  changeDirection(dir: SnakeDirection | number[]) {
    const convertDir = dir.map(item => {
      if (item === 0) return 0
      if (item > 0) return 1
      return -1
    })
    this.direction = (convertDir as SnakeDirection)
  }
}