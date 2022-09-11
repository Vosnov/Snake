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
  n = 6

  constructor(private canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = (canvas.getContext('2d') as CanvasRenderingContext2D)
    this.clearField()

    this.snake = new Snake(canvas, this.step)

    this.hamiltonCycle = new HamiltonCycle(canvas, this.n, this.step, 1)
    this.hamiltonCycle.generateHamiltonianCircuit()
    this.hamiltonCycle.draw()

    this.apple =  new Apple(canvas, this.n, this.step)
    this.apple.x = this.hamiltonCycle.path[10].x
    this.apple.y = this.hamiltonCycle.path[10].y

    this.startPlay()
    this.addListeners()
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
    this.hamiltonCycle.draw()
    this.apple.draw()

    const snakePos = this.snake.getPosition()
    if (snakePos.x === this.apple.x && snakePos.y === this.apple.y) {
      this.apple.randomSpawn()
      this.snake.addTail()
    }
  }

  startPlay() {
    let stepPos = 0
    let nextPath = this.hamiltonCycle.path[stepPos]

    setInterval(() => {
      this.logic(nextPath)
      
      stepPos++
      if (stepPos === this.hamiltonCycle.path.length) stepPos = 0
      nextPath = this.hamiltonCycle.path[stepPos]
    }, 60)
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
