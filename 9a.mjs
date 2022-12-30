import { read, set, log } from './lib.mjs';

const moves = read('./9.txt').map(row => row.split(/ /));

const [ locations, x, y, tx, ty ] = moves.reduce(([ locations, x, y, tx, ty ], move) => {
  if (move[0] === 'U') {
    return walk(move[1], 0, -1);
  } else if (move[0] === 'R') {
    return walk(move[1], 1, 0);
  } else if (move[0] === 'D') {
    return walk(move[1], 0, 1);
  } else if (move[0] === 'L') {
    return walk(move[1], -1, 0);
  }
  function walk(moves, xd, yd) {
    locations = locations.add(`${tx},${ty}`);
    for (let i = 0; (i < moves); i++) {
      x += xd;
      y += yd;
      if ((Math.abs(y - ty) > 1) || (Math.abs(x - tx) > 1)) {
        ty += Math.sign(y - ty);
        tx += Math.sign(x - tx);
      }
      locations = locations.add(`${tx},${ty}`);
    }
    return [ locations, x, y, tx, ty ];
  }
}, [ set(), 0, 0, 0, 0 ]);

log(locations.size());
