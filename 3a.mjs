import { readFileSync } from 'fs';

const data = readFileSync('./3.txt', 'utf8').trim();

const rows = data.split(/\n/).map(row => row.trim());

const rucksacks = rows.map(row => {
  const chars = row.split('');
  const left = chars.slice(0, row.length / 2).map(prioritize);
  const right = chars.slice(row.length / 2).map(prioritize);
  return [ left, right ];
});

console.log(rucksacks.reduce((a, rucksack) => a + rucksack[0].find(p1 => rucksack[1].find(p2 => p1 === p2)), 0));

function prioritize(ch) {
  if ((ch >= 'a') && (ch <= 'z')) {
    return ch.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  } else {
    return ch.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
  }
}

function log(v) {
  console.log(v);
  return v;
}
