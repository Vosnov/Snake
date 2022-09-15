import { Apple } from "./apple"
import { Draw } from "./draw"
import { HamiltonCycle } from "./hamiltonCycle"
import { Position } from "./point"
import { Snake } from "./snake"

export class Field extends Draw {
  fieldColor = '#000000'
  snake: Snake
  hamiltonCycle: HamiltonCycle
  apple: Apple
  timer?: NodeJS.Timer
  showPath = false
  stringPath: string[] = []

  constructor(canvas: HTMLCanvasElement, private countV = 6, step = 40) {
    super(canvas, step);
    this.clearField()
    this.countV = countV;

    this.snake = new Snake(canvas, this.step)

    this.hamiltonCycle = new HamiltonCycle(canvas, this.countV, this.step, 1)
    this.hamiltonCycle.generateHamiltonianCircuit()

    this.stringPath = this.hamiltonCycle.path.map(p => `x${p.x}y${p.y}`)

    this.apple =  new Apple(canvas, this.countV, this.step)
    this.apple.x = this.hamiltonCycle.path[10].x
    this.apple.y = this.hamiltonCycle.path[10].y

    this.setInterval()
    this.addListeners()
  }

  clearField() {
    this.ctx.beginPath()
    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.closePath()
  }

  checkApple() {
    const snakePos = this.snake.getPosition()
    if (snakePos.x === this.apple.x && snakePos.y === this.apple.y) {
      const freePosition: Position[] = [] 
      this.hamiltonCycle.path.forEach(position => {
        if (snakePos.x === position.x && snakePos.y === position.y) return
        
        const tails = this.snake.getTails()
        const stringTails = tails.map(t => `x${t.x}y${t.y}`)
        if (!stringTails.includes(`x${position.x}y${position.y}`)) {
          freePosition.push(position)
        }

        if (tails.length === 0) {
          freePosition.push(position)
        }
      })
      this.apple.randomSpawn(freePosition)
      this.snake.addTail()
    }
  }

  findPathIndex(pos: Position) {
    return this.stringPath.findIndex(p => p === `x${pos.x}y${pos.y}`)
  }

  calcDistance(startIndex: number, endIndex: number) {
    const pathLength = this.hamiltonCycle.path.length;
    if (endIndex - startIndex < 0) {
      return pathLength - startIndex + endIndex
    } else {
      return endIndex - startIndex
    }
  }
 
  logic() {
    const snakePos = this.snake.getPosition()
    const neighbors = this.getNeighbors(snakePos)
    const appleIndex = this.findPathIndex(this.apple)

    const snakeIndex = this.findPathIndex(snakePos)

    let shortPath = this.hamiltonCycle.path[snakeIndex + 1] || this.hamiltonCycle.path[0]
    let minDistance = this.calcDistance(snakeIndex + 1, appleIndex)
    neighbors.forEach((neighbor) => {
      const neighborIndex = this.findPathIndex(neighbor)
      const calcDistance = this.calcDistance(neighborIndex, appleIndex)
      if (calcDistance < minDistance && neighborIndex !== -1 && calcDistance > this.snake.getTailsLength() / 1.5) {
        minDistance = calcDistance
        shortPath = this.hamiltonCycle.path[neighborIndex]
      }

    })

    if (this.snake.getTails().map(t => `x${t.x}y${t.y}`).includes(`x${shortPath.x}y${shortPath.y}`)) {
      this.clear()
      console.log('FAIL!')
    }

    this.snake.go(shortPath)
    this.checkApple()

    this.clearField()
    this.draw()
  }

  getNeighbors({x, y}: Position) {
    const directions = [
      [0, 1],
      [0, - 1],
      [1, 0],
      [-1, 0]
    ]

    const neighbors: Position[] = [] 

    directions.forEach(([dx, dy]) => {
      if (x + dx < 0 || x + dx > this.countV) return
      if (y + dy < 0 || y + dy > this.countV) return

      const tails = this.snake.getTails()
      const stringTails = tails.map(t => `x${t.x}y${t.y}`)
      if (stringTails.includes(`x${x + dx}y${y + dy}`)) return

      neighbors.push({x: x + dx, y: y + dy})
    })

    return neighbors;
  }

  setInterval(speed = 60) {
    this.clear()
    this.timer = setInterval(() => {
      this.logic()
    }, speed)
  }

  clear() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }

  changeSpeed(speed: number) {
    this.clear()
    this.setInterval(speed)
  }

  addListeners() {
    window.addEventListener('keydown', (e) => {
      const {snake} = this

      if (e.key === ' ') {
        this.clearField()
        snake.addTail()
        this.draw()
      }
    })
  }

  draw(): void {
    this.snake.draw()
    if (this.showPath) this.hamiltonCycle.draw()
    this.apple.draw()
  }
}
