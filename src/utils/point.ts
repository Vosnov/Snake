export interface Position {
  x: number
  y: number
}

export class Point implements Position {
  x: number
  y: number

  constructor({x, y}: Position) {
    this.x = x
    this.y = y
  }

  convertCords() {
    return `x${this.x}y${this.y}`
  }
}