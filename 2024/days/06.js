const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/06.txt', 'utf8');

let matrixMap = [];

let guardPos = {
  col: undefined,
  row: undefined,
  direction: undefined,
};

data.split('\n').map((l, i) => {
  const row = l.split('');
  const guardRowIndex = row.findIndex((e) => e === '^');
  if (guardRowIndex >= 0) {
    guardPos = { row: guardRowIndex, col: i, direction: 'up' };
  }
  matrixMap = [...matrixMap, row];
});

const cols = matrixMap[0].length;
const rows = matrixMap.length;

const originalGuardPos = {
  col: guardPos.col,
  row: guardPos.row,
  direction: guardPos.direction,
};

function deepCopy(inputArray) {
  return JSON.parse(JSON.stringify(inputArray));
}

function turnRight(direction) {
  if (direction === 'up') {
    return 'right';
  }
  if (direction === 'down') {
    return 'left';
  }
  if (direction === 'right') {
    return 'down';
  }
  if (direction === 'left') {
    return 'up';
  }
}

function walkGuard(originalMap, pathMap) {
  let localGuardPos = { ...originalGuardPos };
  let visitedObstacles = new Set();

  while (true) {
    const { col, row, direction } = localGuardPos;
    let nextCol = col,
      nextRow = row;

    if (direction === 'up') nextCol--;
    else if (direction === 'down') nextCol++;
    else if (direction === 'right') nextRow++;
    else if (direction === 'left') nextRow--;

    // Guard leaves the map
    if (nextCol < 0 || nextCol >= rows || nextRow < 0 || nextRow >= cols) {
      return false;
    }

    // Obstacle
    if (
      originalMap[nextCol][nextRow] === '#' ||
      originalMap[nextCol][nextRow] === '0'
    ) {
      const obstacleKey = `${nextCol},${nextRow},${direction}`;
      if (visitedObstacles.has(obstacleKey)) {
        return true; // Loop detected
      }
      visitedObstacles.add(obstacleKey);
      localGuardPos.direction = turnRight(direction); // Turn right
    } else {
      // Move forward
      localGuardPos.col = nextCol;
      localGuardPos.row = nextRow;

      if (pathMap) {
        pathMap[nextCol][nextRow] = 'X';
      }
    }
  }
}

function getFirst() {
  const mapWithPath = deepCopy(matrixMap);
  walkGuard(matrixMap, mapWithPath);

  return mapWithPath
    .map((row) => row.filter((cell) => cell === 'X').length)
    .reduce((total, count) => total + count, 0);
}

function getSecond() {
  let count = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (matrixMap[i][j] === '.') {
        const testMap = deepCopy(matrixMap);
        testMap[i][j] = '0'; // Place obstacle

        if (walkGuard(testMap)) {
          count++;
        }
      }
    }
  }

  return count;
}

console.log(getFirst());
console.log(getSecond());
