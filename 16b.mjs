import { read, sort, log, last, dict, memoize, repeat, setIndex, serialize, iterate } from './lib.mjs';

const timeLimit = 26;
const actors = 2;

const shortestPath = memoize(shortestPathBody);

let valves = read('./16.txt').map(row => {
  const matches = row.match(/Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/);
  if (!matches) {
    throw new Error(row);
  }
  return { name: matches[1], rate: parseInt(matches[2]), tunnels: matches[3].split(', ') };
});

valves = valves.map((valve, i) => ({ ...valve, index: i, tunnels: valve.tunnels.map(tunnel => valves.findIndex(({ name }) => name === tunnel)) }));

const start = valves.findIndex(({ name }) => name === 'AA');
// An immutable dict just makes the whole thing run slower
const optimizeCache = new Map();
const result = optimize({ valves, moves: repeat(actors, () => []), open: dict(), locations: repeat(actors, () => start), time: 0, value: 0, paths: repeat(actors, () => null) }, 0);
log({
  moves: result.moves,
  value: result.value
});

function optimize(world, a, depth = 0) {
  if (world.time === timeLimit) {
    return world;
  }
  const order = sort(iterate(actors), (a, b) => world.locations[a] - world.locations[b]);
  // A solution for a given time, set of open valves, and set of current paths and locations can be reused,
  // even if the actors involved happen to be different
  const key = `${world.time},${world.open.keys().map(key => `${key}:${world.open.get(key)}`).join(',')},${JSON.stringify({paths: order.map(a => world.paths[a] && last(world.paths[a])), locations: order.map(a => world.locations[a])})}`;
  if (optimizeCache.has(key)) {
    return optimizeCache.get(key);
  }
  const bestWorlds = [];
  let best, bestValue = -1;
  const legal = legalMoves(world, a);
  let mWorld;
  for (const move of legal) {
    mWorld = applyMove(world, a, move);
    let oWorld = optimize(mWorld, (a + 1) % actors, depth + 1);
    if (oWorld.value > bestValue) {
      best = oWorld;
      bestValue = oWorld.value;
    }
  }
  best = best || world;
  optimizeCache.set(key, best.value);
  return best;
}

function legalMoves(world, a) {
  const here = world.valves[world.locations[a]];
  const moves = [];
  if (world.paths[a]) {
    moves.push({
      type: 'path',
      path: world.paths[a]
    });
  } else if ((here.rate > 0) && !world.open.has(here.index)) {
    moves.push({
      type: 'open'
    });
  } else {
    // Consider valves that:
    // * Are not our current location
    // * Actually do release pressure
    // * Are not already open
    // * Are not the current destination of any actor
    // * Are not easier for other actors to get to after completing their current work
    world.valves.filter(valve =>
      (world.locations[a] !== valve.index) &&
      (valve.rate > 0) &&
      !world.open.has(valve.index) &&
      !world.paths.find(path => path && last(path) === valve.index) &&
      !iterate(actors).some(
        a2 => (a2 !== a) &&
        (
          shortestPath(world.valves, world.locations[a2], valve.index).length +
          (world.paths[a2] ? (world.paths[a2].length + 1) : 0)
        ) < shortestPath(world.valves, world.locations[a], valve.index).length
      )
    ).forEach((valve) => {
      const path = shortestPath(world.valves, world.locations[a], valve.index);
      if (world.time + path.length > timeLimit) {
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


function applyMove(world, a, move) {
  if (a === 0) {
    world = tick(world);
  }
  if (move.type === 'path') {
    const location = move.path[0];
    const path = move.path.slice(1);
    world = { ...world, locations: setIndex(world.locations, a, location), paths: setIndex(world.paths, a, (path.length && path) || null) };
  } else if (move.type === 'open') {
    world = { ...world, open: world.open.set(world.locations[a], world.time) };
  } else if (move.type === 'pass') {
    // Do nothing, let time pass
  } else {
    throw new Error(`Unknown move type: ${move.type}`);
  }
  world = { ...world, moves: setIndex(world.moves, a, [ ...world.moves[a], move ]) };
  return world;
}

function tick(world) {
  return {
    ...world,
    value: world.open.keys().reduce((sum, index) => sum + valves[index].rate, world.value),
    time: world.time + 1
  };
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
