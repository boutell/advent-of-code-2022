import { readFileSync } from 'fs';

const data = readFileSync('./1a.txt', 'utf8');

const rows = data.split(/\n/).map(row => row.trim());

const elves = [];
let elf = [];

for (const row of rows) {
  if (!row.length) {
    flush();
  } else {
    elf.push(parseInt(row));
  } 
}
flush();

console.log(
  elves.reduce((a, elf) =>
    Math.max(a, elf.reduce((a, calories) => a + calories, 0)),
    0
  )
);

function flush() {
  elves.push(elf);
  elf = [];
}
