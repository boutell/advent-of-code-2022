import { read, sort, allButLast, log } from './lib.mjs';

const rows = read('./7.txt');

const [files, dir ] = rows.reduce(([ files, dir ], row) => {
  if (row[0] === '$') {
    const command = row.slice(2);
    if (command === 'ls') {
      // We recognize all output matching the pattern as a file anyway
      return [ files, dir ];
    } else if (command.startsWith('cd ')) {
      const arg = command.substring(3);
      if (arg === '/') {
        return [ files, '/' ];
      } else if (arg === '..') {
        return [ files, parent(dir) ];
      } else {
        return [ files, subpath(dir, arg) ];
      }
    } else {
      throw new Error(`Unknown command: ${command}`);
    }
  } else if (row.match(/^dir [^\d]/)) {
    // Directories are not interesting because we ultimately only care
    // about the file sizes and can reconstruct the directory names
    return [ files, dir ];
  } else {
    const matches = row.match(/^(\d+) ([^ ]+)$/);
    if (!matches) {
      throw new Error(`Unparseable file: ${row}`);
    }
    const [ dummy, size, file ] = matches;
    return [ [ ...files, [ subpath(dir, file), parseInt(size) ] ], dir ];
  }
}, [ [], '/' ]);

const folders = files.reduce((folders, file) => {
  // Remove leading / and trailing filename
  const levels = allButLast(file[0].substring(1).split('/'));
  const size = file[1];
  let dir = '/';
  addToDir(dir);
  folders.set(dir, (folders.get(dir) || 0) + size);
  for (const level of levels) {
    dir = subpath(dir, level);
    addToDir(dir);
  }
  return folders;
  function addToDir(dir) {
    folders.set(dir, (folders.get(dir) || 0) + size);
  }
}, new Map());

const sortedFolderNames = sort(folders.keys(), (a, b) => folders.get(b) - folders.get(a));
log(sortedFolderNames);
log(sortedFolderNames.reduce((a, name) => {
  const size = folders.get(name);
  return a + ((size <= 100000) ? size : 0);
}, 0));

function parent(dir) {
  dir = dir.replace(/\/[^\/]+$/, '');
  if (!dir.length) {
    return '/';
  }
  return dir;
}

function subpath(dir, name) {
  if (!dir.endsWith('/')) {
    dir += '/';
  }
  return `${dir}${name}`;
}
