import { readFileSync } from 'fs';

const data = readFileSync('./2.txt', 'utf8').trim();

const rows = data.split(/\n/).map(row => row.trim());

const names = new Map([
  [ 'A', 'r' ],
  [ 'B', 'p' ],
  [ 'C', 's' ],
  [ 'X', 'r' ],
  [ 'Y', 'p' ],
  [ 'Z', 's' ]
]);

const scores = new Map([
  [ 'r', 1 ],
  [ 'p', 2 ],
  [ 's', 3 ]
]);

const matchups = new Map([
  [ 'rs', 0 ],
  [ 'rp', 6 ],
  [ 'rr', 3 ],
  [ 'pr', 0 ],
  [ 'ps', 6 ],
  [ 'pp', 3 ],
  [ 'sp', 0 ],
  [ 'sr', 6 ],
  [ 'ss', 3 ]
]);

const moves = rows.map(row => row.split(/ /).map(play => names.get(play)));
console.log(moves);

console.log(moves.reduce((a, move) =>
  a + log(scores.get(move[1])) + log(matchups.get(`${move[0]}${move[1]}`)), 0
));

function log(v) {
  console.log(v);
  return v;
}
