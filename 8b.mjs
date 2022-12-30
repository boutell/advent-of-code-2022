import { read, log } from './lib.mjs';

const grid = read('./8.txt').map(row => row.split('').map(n => parseInt(n)));

log(grid.reduce(
  (max, row, y) => row.reduce(
    (max, tree, x) => {
      return Math.max(max, look(0, 1) * look(0, -1) * look(-1, 0) * look(1, 0));
      function look(xd, yd) {
        let lookY = y, lookX = x;
        let distance = 0;
        while (true) {
          lookX += xd;
          lookY += yd;
          if (!inBounds(lookX, lookY)) {
            return distance;
          }
          distance++;
          if (grid[lookY][lookX] >= tree) {
            break;
          }
        }
        return distance;
      }
    },
    max
  ),
  0
));

function inBounds(x, y) {
  return ((y >= 0) && (y < grid.length) && (x >= 0) && (x < grid[0].length));
}
