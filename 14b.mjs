import { read, serialize, log, set } from './lib.mjs';

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

// Scanning "taken" was too slow. Replacing that with my immutable sets was still
// very slow because they aren't powered by cleverly balanced trees like immutablejs.
// And "memoize" isn't useful here because the answers actually do change.
//
// So I punted on the immutability and used regular sets and "serialize", which is still
// a kinda-interesting alternative to building my own sparse grids.

const filled = new Set();
for (const p of taken) {
  filled.add(serialize(p));
}

const floor = Math.max(...taken.map(p => p[1])) + 2;

let count = 0;

while(!occupied(500, 0)) {
  let x = 500;
  let y = 0;
  while(true) {
    if (!occupied(x, y + 1)) {
      y++;
    } else if (!occupied(x - 1, y + 1)) {
      x--;
      y++;
    } else if (!occupied(x + 1, y + 1)) {
      x++;
      y++;
    } else {
      filled.add(serialize([ x, y ]));
      break;
    }
  }
  count++;
  if (!(count % 1000)) {
    console.log(count);
  }
}

console.log(count);

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
  return (y === floor) || filled.has(serialize([ x, y ]));
}
