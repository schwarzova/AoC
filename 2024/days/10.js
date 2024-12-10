const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/10.txt', 'utf8');

let zeroes = [];
let map = [];

function findCharIndexes(char, row) {
  return row.map((ch, i) => (ch === char ? i : null)).filter((i) => i !== null);
}

data.split('\n').map((l, i) => {
  const row = l.split('').map(Number);
  const zeroRowIndexes = findCharIndexes(0, row);

  zeroRowIndexes.forEach((index) => (zeroes = [...zeroes, [i, index]]));
  map = [...map, row];
});

const cols = map.length;
const rows = map[0].length;

function getTopRightBottomLeft(point) {
  let top,
    right,
    bottom,
    left = undefined;

  if (point[0] - 1 >= 0) top = [point[0] - 1, point[1]];
  if (point[0] + 1 < rows) bottom = [point[0] + 1, point[1]];
  if (point[1] + 1 < cols) right = [point[0], point[1] + 1];
  if (point[1] - 1 >= 0) left = [point[0], point[1] - 1];

  return { top, right, bottom, left };
}

function goToNines(point, next, visitedNines) {
  const { top, right, bottom, left } = getTopRightBottomLeft(point);
  let possibleSteps = [];

  if (next === 10) {
    visitedNines.add(`${point[0]}-${point[1]}`);
    return visitedNines;
  }
  if (top && map[top[0]][top[1]] === next) {
    possibleSteps = [...possibleSteps, top];
  }
  if (right && map[right[0]][right[1]] === next) {
    possibleSteps = [...possibleSteps, right];
  }
  if (bottom && map[bottom[0]][bottom[1]] === next) {
    possibleSteps = [...possibleSteps, bottom];
  }
  if (left && map[left[0]][left[1]] === next) {
    possibleSteps = [...possibleSteps, left];
  }
  if (possibleSteps.length === 0) {
    return visitedNines;
  }

  possibleSteps.forEach((step) => goToNines(step, next + 1, visitedNines));

  return visitedNines.size;
}

function goToNinesFromAllPath(point, next) {
  const { top, right, bottom, left } = getTopRightBottomLeft(point);
  let possibleSteps = [];

  if (next === 10) {
    return true;
  }
  if (top && map[top[0]][top[1]] === next) {
    possibleSteps = [...possibleSteps, top];
  }
  if (right && map[right[0]][right[1]] === next) {
    possibleSteps = [...possibleSteps, right];
  }
  if (bottom && map[bottom[0]][bottom[1]] === next) {
    possibleSteps = [...possibleSteps, bottom];
  }
  if (left && map[left[0]][left[1]] === next) {
    possibleSteps = [...possibleSteps, left];
  }
  if (possibleSteps.length === 0) {
    return false;
  }

  const possiblePaths = possibleSteps
    .map((step) => goToNinesFromAllPath(step, next + 1))
    .flat();

  return possiblePaths;
}

function getFirst() {
  let sum = 0;

  for (let i = 0; i < zeroes.length; i++) {
    let visitedNines = new Set();
    const score = goToNines(zeroes[i], 1, visitedNines);
    sum = sum + score;
  }

  return sum;
}

function getSecond() {
  let sum = 0;

  for (let i = 0; i < zeroes.length; i++) {
    const score = goToNinesFromAllPath(zeroes[i], 1).filter((a) => a).length;
    sum = sum + score;
  }

  return sum;
}

console.log(getFirst());
console.log(getSecond());
