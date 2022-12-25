import { readFileSync } from 'fs';

const data = readFileSync('./2.txt', 'utf8').trim();

const rows = data.split(/\n/).map(row => row.trim());

const rucksacks = rows.map(row => ([ row.slice(0, row.length / 2).split().map(prioritize), row.slice(row.length / 2).split().map(prioritize) ]));

function prioritize(ch) {
   
}

const names = new Map([
  [ 'A', 'r' ],
  [ 'B', 'p' ],
  [ 'C', 's' ],
  [ 'X', 0 ],
  [ 'Y', 3 ],
  [ 'Z', 6 ]
]);

const scores = new Map([
  [ 'r', 1 ],
  [ 'p', 2 ],
  [ 's', 3 ]
]);

const matchups = [
  [ 'r', 's', 0 ],
  [ 'r', 'p', 6 ],
  [ 'r', 'r', 3 ],
  [ 'p', 'r', 0 ],
  [ 'p', 's', 6 ],
  [ 'p', 'p', 3 ],
  [ 's', 'p', 0 ],
  [ 's', 'r', 6 ],
  [ 's', 's', 3 ]
];

const moves = rows.map(row => row.split(/ /).map(play => names.get(play)));
console.log(moves);

console.log(moves.reduce((a, move) => {
  const choice = matchups.find(matchup => 
    (matchup[0] === move[0]) &&
    (matchup[2] === move[1])
  );
  return a + log(scores.get(choice[1])) + log(choice[2]);
}, 0));

function log(v) {
  console.log(v);
  return v;
}
