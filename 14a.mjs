import { read, allButLast, last, log } from './lib.mjs';

const walls = read('./14.txt').map(row => row.split(' -> ').map(point => point.split(',').map(value => parseInt(value))));
let taken = walls.reduce((taken, wall) => 
  wall.slice(1).reduce(
    ({ taken, last }, point) => (
      {
        taken: [...taken, ...line(last, point)],
        last: point
      }
    ),
    { taken, last: wall[0] }
  ).taken,
  []
); 

const abyss = Math.max(...taken.map(p => p[1])) + 1;

let count = 0;

while(true) {
  let x = 500;
  let y = 0;
  while (y < abyss) {
    if (!occupied(x, y + 1)) {
      y++;
    } else if (!occupied(x - 1, y + 1)) {
      x--;
      y++;
    } else if (!occupied(x + 1, y + 1)) {
      x++;
      y++;
    } else {
      taken = [ ...taken, [ x, y ] ];
      break;
    }
  }
  if (y === abyss) {
    console.log(count);
    break;
  }
  count++;
}

function line(p1, p2) {
  const result = [];
  if (p1[0] !== p2[0]) {
    let x = p1[0];
    do {
      result.push([ x, p1[1] ]); 
      x += Math.sign(p2[0] - p1[0]);
    } while (x !== p2[0]);
    result.push([ x, p1[1] ]); 
  } else {
    let y = p1[1];
    do {
      result.push([ p1[0], y ]); 
      y += Math.sign(p2[1] - p1[1]);
    } while (y !== p2[1]);
    result.push([ p1[0], y ]); 
  }
  return result;
}

function occupied(x, y) {
  return taken.some(p => (p[0] === x) && (p[1] === y)); 
}
