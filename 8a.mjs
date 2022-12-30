import { read, log } from './lib.mjs';

const grid = read('./8.txt').map(row => row.split('').map(n => parseInt(n)));

log(grid.reduce(
  (count, row, y) => row.reduce(
    (count, tree, x) => {
      return count + (
        (look(0, 1) || look(0, -1) || look(-1, 0) || look(1, 0)) ? 1 : 0
      );
      function look(xd, yd) {
        let lookY = y, lookX = x;
        while (true) {
          lookX += xd;
          lookY += yd;
          if (!inBounds(lookX, lookY)) {
            return true;
          }
          if (grid[lookY][lookX] >= tree) {
            return false;
          }
        }
      }
    },
    count
  ),
  0
));

function inBounds(x, y) {
  return ((y >= 0) && (y < grid.length) && (x >= 0) && (x < grid[0].length));
}
