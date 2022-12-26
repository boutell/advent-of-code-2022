import { readFileSync } from 'fs';

const data = readFileSync('./3.txt', 'utf8').trim();

const rows = data.split(/\n/).map(row => row.trim());

const elves = rows.map(row => row.split('').map(prioritize));

const groups = elves.reduce((a, elf) => (last(a).length === 3) ? [...a, [elf] ] : [...allButLast(a), [...last(a), elf ]], [ [] ]);

console.log(groups.reduce((a, group) => a + group[0].find(v => group[1].find(v1 => v1 === v) && group[2].find(v2 => v2 === v)), 0));

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

function last(a) {
  return a[a.length - 1 ];
}

function allButLast(a) {
  return a.slice(0, a.length - 1);
}
