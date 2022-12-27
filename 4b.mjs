import { read, overlaps } from './lib.mjs';

const rows = read('./4.txt');

const pairs = rows.map(row => row.split(',').map(range => range.split('-').map(s => parseInt(s))));

console.log(pairs.reduce((a, pair) => a + (overlaps(pair[0], pair[1]) ? 1 : 0), 0));
