import { read, sort, log, last, dict, memoize, repeat, setIndex, serialize, iterate } from './lib.mjs';

const timeLimit = 26;
const actors = 2;

const actorList = iterate(actors);

let valves = read('./16.txt').map(row => {
  const matches = row.match(/Valve (\w\w) has flow rate=(\d+); tunnels? leads? to valves? (.*)$/);
  if (!matches) {
    throw new Error(row);
  }
  return { name: matches[1], rate: parseInt(matches[2]), tunnels: matches[3].split(', ') };
});

valves = valves.map((valve, i) => ({ ...valve, index: i, tunnels: valve.tunnels.map(tunnel => valves.findIndex(({ name }) => name === tunnel)) }));

const shortestPaths = getShortestPaths();

const start = valves.findIndex(({ name }) => name === 'AA');

const result = optimize({ valves, moves: repeat(actors, () => []), open: dict(), locations: repeat(actors, () => start), time: 0, value: 0, paths: repeat(actors, () => null) }, 0);
log({
  moves: result.moves,
  value: result.value
});

function optimize(world, a) {
  if (world.time === timeLimit) {
    return world;
  }
  // A solution for a given time, set of open valves, and set of current paths can be reused,
  // even if the actors involved happen to be different
  //log(world.moves);
  const bestWorlds = [];
  let best, bestValue = -1;
  const legal = legalMoves(world, a);
  for (const move of legal) {
    const mWorld = applyMove(world, a, move);
    let oWorld = optimize(mWorld, (a + 1) % actors);
    if (oWorld.value > bestValue) {
      best = oWorld;
      bestValue = oWorld.value;
    }
  }
  best = best || world;
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
      !actorList.some(
        a2 => (a2 !== a) &&
        (
          shortestPaths[world.locations[a2]][valve.index].length +
          (world.paths[a2] ? (world.paths[a2].length + 1) : 0)
        ) < shortestPaths[world.locations[a]][valve.index].length
      )
    ).forEach((valve) => {
      const path = shortestPaths[world.locations[a]][valve.index];
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
  return world;
}

function tick(world) {
  return {
    ...world,
    value: world.open.keys().reduce((sum, index) => sum + valves[index].rate, world.value),
    time: world.time + 1
  };
}

function shortestPath(valves, a, b, taken = []) {
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
    const subPath = shortestPath(valves, index, b, [...taken, index]);
    if (subPath) {
      const newPath = [ index, ...subPath ];
      if (!path || (newPath.length < path.length)) {
        return newPath;
      }
    }
    return path;
  }, false);
}

function getShortestPaths() {
  const shortestPaths = [];
  for (let v1 = 0; (v1 < valves.length); v1++) {
    shortestPaths[v1] = [];
    for (let v2 = 0; (v2 < valves.length); v2++) {
      shortestPaths[v1][v2] = shortestPath(valves, v1, v2);
    }
  }
  return shortestPaths;
}
