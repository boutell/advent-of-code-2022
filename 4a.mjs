import { readFileSync } from 'fs';

const data = readFileSync('./4.txt', 'utf8').trim();

const rows = data.split(/\n/).map(row => row.trim());

const pairs = rows.map(row => row.split(',').map(range => range.split('-').map(s => parseInt(s))));

console.log(pairs.reduce((a, pair) => a + ((contains(pair[0], pair[1]) || contains(pair[1], pair[0])) ? 1 : 0), 0));

function contains(p1, p2) {
  return (p1[0] <= p2[0]) && (p1[1] >= p2[1]);
}

function log(v) {
  console.log(v);
  return v;
}
