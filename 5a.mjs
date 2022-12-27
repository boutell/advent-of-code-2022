import { read, splitByN, set, fill, log } from './lib.mjs';

const rows = read('./5.txt');

let [ stacks, moves ] = rows.reduce(([ stacks, moves ], row) => {
  if (row.includes('[')) {
    stacks = fill(stacks, row.length / 4, () => []);
    return [ splitByN(row, 4).reduce((stacks, col, i) => {
      if (col.substring(0, 1) === '[') {
        return set(stacks, i, [...(stacks[i] || []), col[1]]);
      } else {
        return stacks;
      }
    }, stacks), moves ];
  } else if (row.includes('move')) {
    const matches = row.match(/^move (\d+) from (\d+) to (\d+)$/);
    if (!matches) {
      throw new Error(`Unparsed move row: ${row}`);
    }
    return [ stacks, [...moves, [ parseInt(matches[1]), parseInt(matches[2]) - 1, parseInt(matches[3]) - 1 ]]];
  } else {
    // Ignore the heading row
    return [ stacks, moves ];
  }
}, [ [], [] ]);

stacks = moves.reduce((stacks, move) => {
  for (let i = 0; (i < move[0]); i++) {
    const moving = stacks[move[1]][0];
    stacks = set(
      set(
        stacks, move[1], stacks[
          move[1]
        ].slice(1)
      ), move[2], [
        moving, ...stacks[move[2]]
      ]
    );
  }
  return stacks;
}, stacks);

log(stacks.reduce((result, stack) => result + stack[0], ''));
