import { readFileSync } from 'fs';

const data = readFileSync('./1.txt', 'utf8');

const rows = data.split(/\n/).map(row => row.trim());

const elves = [];
let elf = {
  snacks: []
};

for (const row of rows) {
  if (!row.length) {
    flush();
  } else {
    elf.snacks.push(parseInt(row));
  } 
}
flush();

for (const elf of elves) {
  elf.total = elf.snacks.reduce((a, calories) => a + calories, 0);
}

elves.sort((a, b) => b.total - a.total);

console.log(elves.slice(0, 3).reduce((a, elf) => a + elf.total, 0));

function flush() {
  elves.push(elf);
  elf = {
    snacks: []
  };
}
