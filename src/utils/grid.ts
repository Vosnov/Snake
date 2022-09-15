import { Point, Position } from "./point";

export class Grid {
  constructor(private grid: number[][]) {
    this.grid = grid;
  }

  getNeighbors({x, y}: Position) {
    const directions = [
      [0, 1],
      [0, - 1],
      [1, 0],
      [-1, 0]
    ]

    const neighbors: Point[] = [] 

    directions.forEach(([dx, dy]) => {
      if (this.grid[y + dy] === undefined || this.grid[y + dy][x + dx] === undefined) return

      const neighbor = this.grid[y + dy][x + dx]
      if (neighbor === 0) {
        neighbors.push(new Point({y: y + dy, x: x + dx}))
      }
    })

    return neighbors;
  }
  
  buildPath(traversalTree: Map<string, Point>, to: Point) {
    let path = [to]
    let parent = traversalTree.get(to.convertCords())
    while (parent) {
      path.push(parent)
      parent = traversalTree.get(parent.convertCords())
    }
    return path.reverse()
  }
  
  bfs(from: Position, to: Position) {
    let traversalTree = new Map<string, Point>()
    let visited = new Set<string>()
    let queue: Point[] = []

    const fromPoint = new Point(from)
    const toPoint = new Point(to)
    queue.push(fromPoint)
  
    while (queue.length) {
      let subtreeRoot = queue.shift()
      if (!subtreeRoot) continue
      visited.add(subtreeRoot.convertCords())
  
      if (subtreeRoot.convertCords() === toPoint.convertCords()) {
        return this.buildPath(traversalTree, toPoint)
      }
      
      const neighbors = this.getNeighbors(subtreeRoot)
      for (let child of neighbors) {
        if (!visited.has(child.convertCords())){
          traversalTree.set(child.convertCords(), subtreeRoot)
          queue.push(child)
        }
      }
  
    }
  }

}