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
  showPath = true

  playStepPos = 0
  playNextPath: Position

  constructor(canvas: HTMLCanvasElement, private countV = 6, step = 40) {
    super(canvas, step);
    this.clearField()
    this.countV = countV;

    this.snake = new Snake(canvas, this.step)

    this.hamiltonCycle = new HamiltonCycle(canvas, this.countV, this.step, 1)
    this.hamiltonCycle.generateHamiltonianCircuit()
    this.hamiltonCycle.draw()

    this.apple =  new Apple(canvas, this.countV, this.step)
    this.apple.x = this.hamiltonCycle.path[10].x
    this.apple.y = this.hamiltonCycle.path[10].y

    this.setInterval()
    this.addListeners()

    this.playNextPath = this.hamiltonCycle.path[this.playStepPos]
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

  logic() {
    this.clearField()
    
    this.snake.go(this.playNextPath.x, this.playNextPath.y)

    this.checkApple()

    this.playStepPos++
    if (this.playStepPos === this.hamiltonCycle.path.length) this.playStepPos = 0
    this.playNextPath = this.hamiltonCycle.path[this.playStepPos]

    this.draw()
  }

  setInterval(speed = 60) {
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
