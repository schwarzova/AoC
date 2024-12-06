const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/04.txt', 'utf8');

let matrix = [];

data.split('\n').map((l) => {
  const row = l.split('');
  matrix = [...matrix, row];
});

const cols = matrix[0].length - 1;

function getRight(i, j) {
  return j === cols ? undefined : matrix[i][j + 1];
}

function checkRight(i, j) {
  return (
    getRight(i, j) === 'M' &&
    getRight(i, j + 1) === 'A' &&
    getRight(i, j + 2) === 'S'
  );
}

function getLeft(i, j) {
  return j === 0 ? undefined : matrix[i][j - 1];
}

function checkLeft(i, j) {
  return (
    getLeft(i, j) === 'M' &&
    getLeft(i, j - 1) === 'A' &&
    getLeft(i, j - 2) === 'S'
  );
}

function getTop(i, j) {
  return i === cols ? undefined : matrix[i + 1][j];
}

function checkTop(i, j) {
  return (
    getTop(i, j) === 'M' && getTop(i + 1, j) === 'A' && getTop(i + 2, j) === 'S'
  );
}

function getBottom(i, j) {
  return i === 0 ? undefined : matrix[i - 1][j];
}

function checkBottom(i, j) {
  return (
    getBottom(i, j) === 'M' &&
    getBottom(i - 1, j) === 'A' &&
    getBottom(i - 2, j) === 'S'
  );
}

function getDiagonalLeftTop(i, j) {
  return i === 0 ? undefined : j === 0 ? undefined : matrix[i - 1][j - 1];
}

function checkDiagonalLeftTop(i, j) {
  return (
    getDiagonalLeftTop(i, j) === 'M' &&
    getDiagonalLeftTop(i - 1, j - 1) === 'A' &&
    getDiagonalLeftTop(i - 2, j - 2) === 'S'
  );
}

function getDiagonalLeftBottom(i, j) {
  return i === 0 ? undefined : j === cols ? undefined : matrix[i - 1][j + 1];
}

function checkDiagonalLeftBottom(i, j) {
  return (
    getDiagonalLeftBottom(i, j) === 'M' &&
    getDiagonalLeftBottom(i - 1, j + 1) === 'A' &&
    getDiagonalLeftBottom(i - 2, j + 2) === 'S'
  );
}

function getDiagonalRightTop(i, j) {
  return i === cols ? undefined : j === 0 ? undefined : matrix[i + 1][j - 1];
}

function checkDiagonalRightTop(i, j) {
  return (
    getDiagonalRightTop(i, j) === 'M' &&
    getDiagonalRightTop(i + 1, j - 1) === 'A' &&
    getDiagonalRightTop(i + 2, j - 2) === 'S'
  );
}

function getDiagonalRightBottom(i, j) {
  return i === cols ? undefined : j === cols ? undefined : matrix[i + 1][j + 1];
}

function checkDiagonalRightBottom(i, j) {
  return (
    getDiagonalRightBottom(i, j) === 'M' &&
    getDiagonalRightBottom(i + 1, j + 1) === 'A' &&
    getDiagonalRightBottom(i + 2, j + 2) === 'S'
  );
}

function getFirst() {
  let numberOfXmas = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'X') {
        // check ->
        if (checkRight(i, j)) numberOfXmas = numberOfXmas + 1;
        // check <-
        if (checkLeft(i, j)) numberOfXmas = numberOfXmas + 1;
        // check top
        if (checkTop(i, j)) numberOfXmas = numberOfXmas + 1;
        // // check bottom
        if (checkBottom(i, j)) numberOfXmas = numberOfXmas + 1;

        // check diagonal left top
        if (checkDiagonalLeftTop(i, j)) numberOfXmas = numberOfXmas + 1;
        // check diagonal right top
        if (checkDiagonalRightTop(i, j)) numberOfXmas = numberOfXmas + 1;
        // check diagonal left bottom
        if (checkDiagonalLeftBottom(i, j)) numberOfXmas = numberOfXmas + 1;
        // check diagonal right bottom
        if (checkDiagonalRightBottom(i, j)) numberOfXmas = numberOfXmas + 1;
      }
    }
  }
  return numberOfXmas;
}

function getSecond() {
  let numberOfXmas = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] === 'A') {
        // check X - MAS shape
        let isLeftRightX = false;
        let isRightLeftX = false;

        const leftBottom = getDiagonalLeftBottom(i, j);
        const righTop = getDiagonalRightTop(i, j);

        const righBottom = getDiagonalRightBottom(i, j);
        const leftTop = getDiagonalLeftTop(i, j);

        if (
          (leftBottom === 'M' && righTop === 'S') ||
          (leftBottom === 'S' && righTop === 'M')
        ) {
          isLeftRightX = true;
        }

        if (isLeftRightX) {
          if (
            (leftTop === 'M' && righBottom === 'S') ||
            (leftTop === 'S' && righBottom === 'M')
          ) {
            isRightLeftX = true;
          }
        }

        if (isLeftRightX && isRightLeftX) {
          numberOfXmas = numberOfXmas + 1;
        }
      }
    }
  }
  return numberOfXmas;
}

console.log(getFirst());
console.log(getSecond());
