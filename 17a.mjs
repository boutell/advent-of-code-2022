import { read, log, print, verbosePrint, setIndex, iterate, clone } from './lib.mjs';

const jets = read('./17.txt')[0].split('');

const columns = 7;

const pieces = [
  `####`,

  `.#.
   ###
   .#.`,

  `..#
   ..#
   ###`,

  `#
   #
   #
   #`,

  `##
   ##`
].map(piece => piece.split('\n').map(s => s.trim().split('')));


const { grid } = iterate(2022).reduce(({ grid, j }, i) => {
  verbosePrint(`Piece ${i + 1}:\n\n`);
  const piece = pieces[i % pieces.length];
  let y = grid.length + 3 + piece.length - 1;
  verbosePrint(`${grid.length} 3 ${piece.length} ${y}`);
  let x = 2;
  let steps = 0;
  verbosePrint(render(placePiece(grid, piece, x, y)));
  print(i);
  while (true) {
    steps++;
    verbosePrint(`step: ${steps} x is ${x} ${y}`);
    const nx = x + ((jets[j % jets.length] === '<') ? -1 : 1);
    j++;
    if (!((nx < 0) || (nx + piece[0].length > columns) || intersects(grid, piece, nx, y))) {
      x = nx;
      verbosePrint(`shifting to ${x}`);
    }
    verbosePrint(`at ${x} ${y}:`);
    verbosePrint(render(placePiece(grid, piece, x, y)));
    // Note that positive y values go up, not down, because we are thinking in
    // terms of an ever-growing tower. So to fall down we decrement y
    let ny = y - 1;
    if (intersects(grid, piece, x, ny)) {
      verbosePrint(`placing at ${x} ${y}`);
      return { grid: placePiece(grid, piece, x, y), j };
    }
    y = ny;
    verbosePrint(`moving down to ${y}`);
    // verbosePrint(render(placePiece(grid, piece, x, y)));
  }
}, { grid: [], j: 0 });

print(render(grid));
console.log(grid.length);

function render(grid) {
  let s = '';
  // Internal representation is flipped so it can grow positively, but we're used to seeing Tetris this way
  for (let y = (grid.length - 1); (y >= 0); y--) {
    for (let x = 0; (x < columns); x++) {
      s += get(grid, x, y); 
    }
    s += "\n";
  }
  return s;
}

function intersects(grid, piece, x, y) {
  for (let py = 0; (py < piece.length); py++) {
    const cy = y - py;
    for (let px = 0; (px < piece[0].length); px++) {
      const cx = x + px;
      if (
        (get(piece, px, py) === '#') &&
        ((cy === -1) || (get(grid, cx, cy) === '#'))
      ) {
        return true;
      }
    }
  }
}

function placePiece(grid, piece, x, y) {
  // Lazy man's immutability
  grid = clone(grid);
  for (let cx = x; (cx < (x + piece[0].length)); cx++) {
    for (let py = 0; (py < piece.length); py++) {
      const px = cx - x;
      const cy = y - py;
      if (get(piece, px, py) === '#') {
        set(grid, cx, cy);
      }
    }
  }
  return grid;
}

function get(grid, x, y) {
  if (y >= grid.length) {
    return '.';
  }
  return grid[y][x] || '.';
}

// NOTE: mutates grid
function set(grid, x, y) {
  while (y >= grid.length) {
    grid.push([]);
  }
  grid[y][x] = '#';
}
