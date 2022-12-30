import { read, log } from './lib.mjs';

const commands = read('./10.txt').map(row => {
  let [ opcode, arg ] = row.split(/ /);
  if (arg) {
    arg = parseInt(arg);
  }
  return [ opcode, arg ];
});

console.log(commands.reduce(([ cycle, x, sum, screen ], [ opcode, arg ]) => {
  if (opcode === 'addx') {
    next();
    next();
    x += arg;
  } else if (opcode === 'noop') {
    next();
  } else {
    throw new Error(`Unknown opcode: ${opcode}`);
  }
  return [ cycle, x, sum, screen ];
  function next() {
    const position = cycle % 40;
    if (Math.abs(x - position) <= 1) {
      screen += '#';
    } else {
      screen += '.';
    }
    if (position === 39) {
      screen += '\n';
    }
    cycle++;
    if ((cycle >= 20) && (((cycle - 20) % 40) === 0)) {
      sum += cycle * x;
    }
  }
}, [ 0, 1, 0, '' ])[3]);
