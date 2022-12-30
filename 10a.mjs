import { read, log } from './lib.mjs';

const commands = read('./10.txt').map(row => {
  let [ opcode, arg ] = row.split(/ /);
  if (arg) {
    arg = parseInt(arg);
  }
  return [ opcode, arg ];
});

log(commands.reduce(([ cycle, x, sum ], [ opcode, arg ]) => {
  if (opcode === 'addx') {
    next();
    next();
    x += arg;
  } else if (opcode === 'noop') {
    next();
  } else {
    throw new Error(`Unknown opcode: ${opcode}`);
  }
  return [ cycle, x, sum ];
  function next() {
    cycle++;
    if ((cycle >= 20) && (((cycle - 20) % 40) === 0)) {
      sum += cycle * x;
    }
  }
}, [ 0, 1, 0 ]));
