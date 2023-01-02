import { read, log, last, allButLast, setIndex, sort } from './lib.mjs';

const grid = read('./12.txt').map(row => row.split(''));

const edges = grid.reduce((edges, row, y) => row.reduce((edges, ch, x) => {
  return [...edges, reachable(x, y) ]; 
  function reachable(x, y) {
    const dirs = [ [ 0, -1 ], [ 1, 0 ], [ 0, 1 ], [ -1, 0 ] ];
    const result = [];
    for (const dir of dirs) {
      const x2 = x + dir[0];
      const y2 = y + dir[1];
      if (inBounds(x2, y2)) {
        if (height(grid[y2][x2]) <= (height(grid[y][x]) + 1)) {
          result.push(y2 * grid[0].length + x2); 
        }
      }
    }
    return result;
  }
}, edges), []);

let nodes = grid.reduce(({ nodes, i }, row, y) => {
  return row.reduce(({ nodes, i }, cell, x) => {
    const node = {
      x,
      y,
      i,
      edges: edges[i],
      value: cell,
      distance: (cell === 'E') ? 0 : Infinity
    }
    return { nodes: [ ...nodes, node ], i: i + 1 };
  }, { nodes, i });
}, { i: 0, nodes: [] }).nodes;

let world = { change: false, nodes, newNodes: [] };

do {
  world = world.nodes.reduce((world, node) => {
    const better = node.edges.find(i => (world.nodes[i].distance + 1) < node.distance);
    if (better !== undefined) {
      return {
        ...world,
        change: true,
        newNodes: [...world.newNodes, {
          ...node,
          distance: world.nodes[better].distance + 1
        }]
      };
    } else {
      return {
        ...world,
        newNodes: [...world.newNodes, node ]
      };
    }
  }, {
   ...world,
   change: false
  });
  world = {
    ...world,
    nodes: world.newNodes,
    newNodes: []  
  };
} while (world.change);

let candidates = world.nodes.filter(node => height(node.value) === 0);
candidates = sort(candidates, (a, b) => {
  return a.distance - b.distance;
});
console.log(candidates[0].distance);

function height(ch) {
  if (ch === 'S') {
    return 0;
  } else if (ch === 'E') {
    return 25;
  } else {
    return ch.charCodeAt(0) - 'a'.charCodeAt(0);
  }
}

function inBounds(x, y) {
  return ((y >= 0) && (y < grid.length) && (x >= 0) && (x < grid[0].length));
}

function print(world) {
  console.log(world.nodes.reduce((s, node) => {
    if (!node.x) {
      s += '\n';
    }
    s += node.value + ' ' + (node.distance < 1000 ? node.distance : 999).toString().padStart(3, ' ') + ' ';
    return s;
  }, '') + '\n\n');
}

