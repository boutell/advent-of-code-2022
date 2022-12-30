import { read, log, last, allButLast, setIndex, repeat, sort } from './lib.mjs';

const items = 0;
const operation = 1;
const operand = 2;
const divisibleBy = 3;
const ifTrue = 4;
const ifFalse = 5;
const inspections = 6;

let monkeys = read('./11.txt').reduce((monkeys, row) => {
  let monkey;
  row = row.trim();
  if (row.startsWith('Monkey')) {
    monkeys = [ ...monkeys, [ [], '', '', '', '', '', 0  ] ];
    return monkeys;
  }
  monkey = [...last(monkeys)];
  if (row.startsWith('Starting items:')) {
    monkey[items] = row.substring('Starting items: '.length).split(', ').map(item => parseInt(item));
  } else if (row.startsWith('Operation:')) {
    monkey[operation] = row.includes('*') ? '*' : '+';
    monkey[operand] = arg();
  } else if (row.startsWith('Test:')) {
    monkey[divisibleBy] = parseInt(arg());
  } else if (row.startsWith('If true')) {
    monkey[ifTrue] = parseInt(arg());
  } else if (row.startsWith('If false')) {
    monkey[ifFalse] = parseInt(arg());
  } else if (row === '') {
    // Ignore
  } else {
    throw new Error(`Unparsed row: ${row}`);
  }
  return [ ...allButLast(monkeys), monkey ];
  function arg() {
    return row.substring(row.lastIndexOf(' ') + 1);
  }
}, []);

monkeys = monkeys.map(monkey => setIndex(monkey, items, monkey[items].map(item => repeat(monkeys.length, () => item))));

for (let i = 0; (i < 10000); i++) {
  // Can't "map" and use immutable monkeys at the same time because
  // the iterator could be confused by the replacement of monkeys
  for (let j = 0; (j < monkeys.length); j++) {
    const monkey = monkeys[j];
    monkeys = monkey[items].reduce((monkeys, item) => {
      if (monkey[operation] === '*') {
        item = item.map((m, k) => {
          return (m * value(monkey[operand], k)) % monkeys[k][divisibleBy];
        });
      } else if (monkey[operation] === '+') {
        item = item.map((m, k) => {
          return (m + value(monkey[operand], k)) % monkeys[k][divisibleBy];
        });
      } else {
        throw new Error(`Unknown operation: ${operation}`);
      }
      const other = (item[j] === 0) ? monkey[ifTrue] : monkey[ifFalse];
      monkeys = setIndex(monkeys, j, setIndex(
        monkey, inspections, monkeys[j][inspections] + 1
      ));
      monkeys = setIndex(monkeys, other, setIndex(
        monkeys[other], items, [...monkeys[other][items], item]
      )); 
      return monkeys;

      function value(operand, monkeyIndex) {
        if (operand === 'old') {
          return item[monkeyIndex];
        } else {
          return parseInt(operand);
        }
      }
    }, monkeys);
    monkeys = setIndex(monkeys, j, setIndex(
      monkeys[j], items, []
    ));
  }
}

monkeys = sort(monkeys, (a, b) => b[inspections] - a[inspections]);

console.log(monkeys[0][inspections] * monkeys[1][inspections]);

