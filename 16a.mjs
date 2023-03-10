import { read, sort, log, last, set, memoize, serialize } from './lib.mjs';

const shortestPath = memoize(shortestPathBody);

let valves = read('./16.txt').map(row => {
  const matches = row.match(/Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/);
  if (!matches) {
    throw new Error(row);
  }
  return { name: matches[1], rate: parseInt(matches[2]), tunnels: matches[3].split(', ') };
});

valves = valves.map((valve, i) => ({ ...valve, index: i, tunnels: valve.tunnels.map(tunnel => valves.findIndex(({ name }) => name === tunnel)) }));

const result = optimize({ valves, moves: [], open: set(), location: valves.findIndex(({ name }) => name === 'AA'), time: 0, value: 0, depth: 0 });
log({
  moves: result.moves,
  value: result.value
});

function optimize(world) {
  if (world.time === 30) {
    return world;
  }
  const legal = legalMoves(world);
  let best, bestValue = -1;
  for (const move of legal) {
    const mWorld = applyMove(world, move);
    const oWorld = optimize({...mWorld, depth: mWorld.depth + 1 });
    if (oWorld.value > bestValue) {
      best = oWorld;
      bestValue = oWorld.value;
    }
  }
  return best || world;
}

function applyMove(world, move) {
   
  if (move.type === 'path') {
    const location = move.path[0];
    world = tick(world);
    const path = move.path.slice(1);
    world = { ...world, location, path: (path.length && path) || null };
  } else if (move.type === 'open') {
    world = tick(world);
    world = { ...world, open: world.open.add(world.location) };
  } else if (move.type === 'pass') {
    // Do nothing, let time pass
    world = tick(world);
  } else {
    throw new Error(`Unknown move type: ${move.type}`);
  }
  world = { ...world, moves: [ ...world.moves, move ] };
  return world;
}

function tick(world) {
  return {
    ...world,
    value: world.open.keys().reduce((sum, index) => sum + valves[index].rate, world.value),
    time: world.time + 1
  };
}

function legalMoves(world) {
  const here = world.valves[world.location];
  const moves = [];
  if (world.path) {
    moves.push({
      type: 'path',
      path: world.path
    });
  } else if ((here.rate > 0) && !world.open.has(here.index)) {
    moves.push({
      type: 'open'
    });
  } else {
    world.valves.filter(valve => (world.location !== valve.index) && (valve.rate > 0) && !world.open.has(valve.index)).forEach((valve) => {
      const path = shortestPath(world.valves, world.location, valve.index);
      if (world.time + path.length > 30) {
        return;
      }
      if (path) {
        moves.push({
          type: 'path',
          path
        });
      }
    });
  }
  if (!moves.length) {
    moves.push({ type: 'pass' });
  }
  return moves;
}

function shortestPathBody(valves, a, b, taken = []) {
  if (a === b) {
    return [];
  }
  if (valves[a].tunnels.includes(b)) {
    return [ b ];
  }
  return valves[a].tunnels.reduce((path, index) => {
    if (taken.includes(index)) {
      return path;
    }
    const subPath = shortestPathBody(valves, index, b, [...taken, index]);
    if (subPath) {
      const newPath = [ index, ...subPath ];
      if (!path || (newPath.length < path.length)) {
        return newPath;
      }
    }
    return path;
  }, false);
}
