import { Draw } from "./draw";
import { Position } from "./point";

/*
Implementation of Hamiltonian Path algorithm due to 
Nathan Clisby, July 2012.
Modified by E. Emberly Sept 2014--!>
https://clisby.net/projects/hamiltonian_path/hamiltonian_path_v1.html
http://www.sfu.ca/~eemberly/phys847/assignments/hamiltonian_paths.html
Comments about the Markov chain used to generate paths
* using backbiting move described in Secondary structures in long
compact polymers, PHYSICAL REVIEW E 74, 051801 Ã�â€˜2006, by Richard
Oberdorf, Allison Ferguson, Jesper L. Jacobsen and Jan\'e Kondev
* algorithm is believed to be ergodic, but this has not been proved.
* current implementation is not the most efficient possible, O(N) for N
step walks, which could be improved with more sophisticated data
structure
* heuristic used for decision that equilibrium distribution is being
sampled from. This heuristic is quite conservative, but not certain.
* currently using default random number generator. This should be `good
enough' for generating typical walks, but shouldn't be replied upon for
serious numerical work.
*/
export class HamiltonCycle extends Draw {
  path: Position[] = []
  lineWidth = 2
  lineColor = 'green'

  constructor(canvas: HTMLCanvasElement, private n: number, step?: number, private q: number = 1) {
    super(canvas, step)
    this.n = n
    this.q = q
  }

  getEdge(x: number, y: number, n: number) {
    const xEdge = ((x === 0) || (x === n - 1));
    const yEdge = ((y === 0) || (y === n - 1));
    if (xEdge && yEdge) {
      return 0;
    }
    else if (xEdge || yEdge) {
      return this.randomInteger(0, 1);
    }
    else {
      return this.randomInteger(0, 2);
    }
  } 

  backbite(n: number) {
    let iEdge = 0
    let success = false;
    const iTemp = Math.floor(Math.random() * 2);
    const nsq = n * n;
  
    if (iTemp === 0) {
      const x = this.path[0].x;
      const y = this.path[0].y;
      const add_edge = this.getEdge(x, y, n)
      success = add_edge >= 0;
      let i = 3;
      while(iEdge <= add_edge) {
        const dx = Math.abs(x - this.path[i].x);
        const dy = Math.abs(y - this.path[i].y);
        if (dx + dy === 1) {
          if (iEdge === add_edge) {
            const jlim = (i - 1) / 2;
            for (let j = 0; j < jlim; j++) {
              let temp = this.path[j];
              this.path[j] = this.path[i - 1 - j];
              this.path[i - 1 - j] = temp;
            }
          }
          iEdge++;
        }
        i += Math.max(2, dx + dy - 1);
      }
    } else {
      const x = this.path[nsq - 1].x;
      const y = this.path[nsq - 1].y;
      const add_edge = this.getEdge(x, y, n)
      success = (add_edge >= 0);
      let i = nsq - 4;
  
      while(iEdge <= add_edge) {
        const dx = Math.abs(x - this.path[i].x);
        const dy = Math.abs(y - this.path[i].y);
        if (dx + dy === 1) {
          if (iEdge === add_edge) {
            const jlim = (nsq - 1 - i - 1) / 2;
            for (let j = 0; j < jlim; j++) {
              let temp = this.path[nsq-1-j];
              this.path[nsq-1-j] = this.path[i+1+j];
              this.path[i+1+j] = temp;
            }
          }
          iEdge++;
        }
        
        i -= Math.max(2,dx+dy-1);
      }
    }
    return success;
  }

  generateHamiltonianPath() {
    const {n, path, q} = this
    for (let x = 0; x < n; x++) {
      if (x % 2 === 0) {
        for (let y = 0; y < n; y++) {
          path.push({x, y})
        }
      } else {
        for (let y = n - 1; y >= 0; y--) {
          path.push({x, y})
        }
      }
    }
  
    let nSuccess = 0;
    const nMoves = q * 10.0 * n * n * Math.pow(Math.log(2.+n),2);
    while(nSuccess < nMoves) {
      let success = this.backbite(n);
      if (success) nSuccess++;
    }

    return path;
  }

  generateHamiltonianCircuit() {
    const {n} = this
    const path = this.generateHamiltonianPath();
    const nsq = n*n;
    const min_dist = 1;
    
    while (!this.near(path[nsq -1], path[0], min_dist)) {
      this.backbite(n);
    }
    return path;
  }

  near(first: Position, last: Position, dist: number) {
    return Math.abs(last.x - first.x) + Math.abs(last.y - first.y) === dist
  }

  draw() {
    const {ctx, path, n, lineWidth, lineColor, step} = this

    ctx.lineWidth = lineWidth;
    const size = step
    const sift = 0.5
    ctx.beginPath();
    ctx.moveTo((path[0].x + sift ) * size, (path[0].y + sift ) *  size);
    const nsq = n * n;
    for (let i = 1; i < nsq; i++) {
      ctx.lineTo((path[i].x + sift ) * size, + (path[i].y + sift ) * size);
      ctx.moveTo((path[i].x + sift ) * size, + (path[i].y + sift ) * size);
    }
    ctx.strokeStyle = lineColor
    ctx.stroke();
    ctx.closePath()
  }
}
