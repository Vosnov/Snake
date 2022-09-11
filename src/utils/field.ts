import { Apple } from "./apple"
import { HamiltonCycle } from "./hamiltonCycle"
import { Position } from "./point"
import { Snake } from "./snake"

export class Field {
  fieldColor = '#000000'
  ctx: CanvasRenderingContext2D
  snake: Snake
  hamiltonCycle: HamiltonCycle
  apple: Apple
  step = 40 
  timer?: NodeJS.Timer
  showPath = true

  playStepPos = 0
  playNextPath: Position

  constructor(private canvas: HTMLCanvasElement, private countV = 6) {
    this.canvas = canvas
    this.ctx = (canvas.getContext('2d') as CanvasRenderingContext2D)
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

  logic(nextPath: Position) {
    this.clearField()
    
    this.snake.go(nextPath.x, nextPath.y)
    this.snake.draw()
    if (this.showPath) this.hamiltonCycle.draw()
    this.apple.draw()

    const snakePos = this.snake.getPosition()
    if (snakePos.x === this.apple.x && snakePos.y === this.apple.y) {
      this.apple.randomSpawn()
      this.snake.addTail()
    }
  }

  setInterval(speed = 60) {
    this.timer = setInterval(() => {
      this.logic(this.playNextPath)
      
      this.playStepPos++
      if (this.playStepPos === this.hamiltonCycle.path.length) this.playStepPos = 0
      this.playNextPath = this.hamiltonCycle.path[this.playStepPos]
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
      const {snake, hamiltonCycle, apple} = this

      if (e.key === ' ') {
        this.clearField()
        snake.addTail()
        snake.draw()
        hamiltonCycle.draw()
        apple.draw()
      }
    })
  }
}
