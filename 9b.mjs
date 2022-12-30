import { read, last, set, repeat, log } from './lib.mjs';

const moves = read('./9.txt').map(row => row.split(/ /));

const [ locations, rope ] = moves.reduce(([ locations, rope ], move) => {
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
    let lastRope = rope;
    locations = locations.add(`${last(lastRope)[0]},${last(lastRope)[1]}`);
    for (move = 0; (move < moves); move++) {
      const head = [ lastRope[0][0] + xd, lastRope[0][1] + yd ]; 
      const newRope = [ head ];
      let previous = head;
      for (let i = 1; (i < lastRope.length); i++) {
        const next = [...lastRope[i]];
        if ((Math.abs(previous[1] - next[1]) > 1) || (Math.abs(previous[0] - next[0]) > 1)) {
          next[1] += Math.sign(previous[1] - next[1]);
          next[0] += Math.sign(previous[0] - next[0]);
        }
        newRope.push(next);
        previous = next;
      }
      locations = locations.add(`${last(lastRope)[0]},${last(lastRope)[1]}`);
      lastRope = newRope;
    }
    return [ locations, lastRope ];
  }
}, [ set(), repeat(10, () => [ 0, 0 ]) ]);

log(locations.size());
