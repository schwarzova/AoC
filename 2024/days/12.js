const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/12.txt', 'utf8');
const { DeepSet } = require('../../helpers/set');

let map = [];
let visitedPlots = new Set();

data.split('\n').map((l) => {
  const row = l.split('');
  map = [...map, row];
});

const cols = map.length;
const rows = map[0].length;

function getNeighbours(row, col) {
  let top,
    right,
    bottom,
    left = undefined;

  if (row - 1 >= 0) top = { name: map[row - 1][col], row: row - 1, col };
  if (row + 1 < rows) bottom = { name: map[row + 1][col], row: row + 1, col };
  if (col - 1 >= 0) left = { name: map[row][col - 1], row: row, col: col - 1 };
  if (col + 1 < cols) {
    right = { name: map[row][col + 1], row: row, col: col + 1 };
  }

  return { top, right, bottom, left };
}

function countPerimeter(plot, row, col) {
  let perimeter = 0;
  const { top, right, bottom, left } = getNeighbours(row, col);

  if (!top || top.name !== plot) perimeter++;
  if (!bottom || bottom.name !== plot) perimeter++;
  if (!right || right.name !== plot) perimeter++;
  if (!left || left.name !== plot) perimeter++;

  return perimeter;
}

function findAreaPoints(plot, row, col, reset) {
  const { top, right, bottom, left } = getNeighbours(row, col);
  let points = reset
    ? new DeepSet([])
    : new DeepSet([{ name: plot, row, col }]);
  visitedPlots.add(`${row}-${col}`);

  if (
    top?.name !== plot &&
    right?.name !== plot &&
    bottom?.name !== plot &&
    left?.name !== plot
  ) {
    return points;
  }

  if (top && top.name === plot && !visitedPlots.has(`${top.row}-${top.col}`)) {
    points.add(top);
  }
  if (
    right &&
    right.name === plot &&
    !visitedPlots.has(`${right.row}-${right.col}`)
  ) {
    points.add(right);
  }
  if (
    bottom &&
    bottom.name === plot &&
    !visitedPlots.has(`${bottom.row}-${bottom.col}`)
  ) {
    points.add(bottom);
  }
  if (
    left &&
    left.name === plot &&
    !visitedPlots.has(`${left.row}-${left.col}`)
  ) {
    points.add(left);
  }

  points.forEach((point) => {
    if (!visitedPlots.has(`${point.row}-${point.col}`)) {
      findAreaPoints(point.name, point.row, point.col, true).forEach((p) =>
        points.add(p)
      );
    }
  });

  return points;
}

function getFirst() {
  let price = 0;
  visitedPlots = new Set();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (visitedPlots.has(`${i}-${j}`)) {
        continue;
      }

      const plot = map[i][j];
      const points = findAreaPoints(plot, i, j);
      const region = points.size;

      let perimeter = 0;
      points.forEach((p) => {
        perimeter = perimeter + countPerimeter(p.name, p.row, p.col);
      });

      price = price + perimeter * region;
    }
  }
  return price;
}

function isTopOk(name, row, col) {
  const { top } = getNeighbours(row, col);
  return !top || top.name !== name;
}

function isBottomOk(name, row, col) {
  const { bottom } = getNeighbours(row, col);
  return !bottom || bottom.name !== name;
}

function isRightOk(name, row, col) {
  const { right } = getNeighbours(row, col);
  return !right || right.name !== name;
}

function isLeftOk(name, row, col) {
  const { left } = getNeighbours(row, col);
  return !left || left.name !== name;
}

function countPerimeterSides(points) {
  let perimeter = 0;
  let visitedTop = new Set();
  let visitedBottom = new Set();
  let visitedRight = new Set();
  let visitedLeft = new Set();

  points.forEach((p) => {
    const { top, right, bottom, left } = getNeighbours(p.row, p.col);

    if ((!top || top.name !== p.name) && !visitedTop.has(`${p.row}-${p.col}`)) {
      visitedTop.add(`${p.row}-${p.col}`);
      //calculate right
      let nextRight =
        right && isTopOk(p.name, right.row, right.col)
          ? { name: right.name, row: right.row, col: right.col }
          : undefined;
      while (
        nextRight &&
        nextRight.name === p.name &&
        !visitedTop.has(`${nextRight.row}-${nextRight.col}`)
      ) {
        visitedTop.add(`${nextRight.row}-${nextRight.col}`);
        nextRight =
          nextRight.col + 1 < cols &&
          isTopOk(p.name, nextRight.row, nextRight.col + 1)
            ? {
                name: map[nextRight.row][nextRight.col + 1],
                row: nextRight.row,
                col: nextRight.col + 1,
              }
            : undefined;
      }
      //calculate left
      let nextLeft =
        left && isTopOk(p.name, left.row, left.col)
          ? { name: left.name, row: left.row, col: left.col }
          : undefined;
      while (
        nextLeft &&
        nextLeft.name === p.name &&
        !visitedTop.has(`${nextLeft.row}-${nextLeft.col}`)
      ) {
        visitedTop.add(`${nextLeft.row}-${nextLeft.col}`);
        nextLeft =
          nextLeft.col - 1 >= 0 &&
          isTopOk(p.name, nextLeft.row, nextLeft.col - 1)
            ? {
                name: map[nextLeft.row][nextLeft.col - 1],
                row: nextLeft.row,
                col: nextLeft.col - 1,
              }
            : undefined;
      }
      perimeter++;
    }
    if (
      (!bottom || bottom.name !== p.name) &&
      !visitedBottom.has(`${p.row}-${p.col}`)
    ) {
      visitedBottom.add(`${p.row}-${p.col}`);
      //calculate right
      let nextRight =
        right && isBottomOk(p.name, right.row, right.col)
          ? { name: right.name, row: right.row, col: right.col }
          : undefined;
      while (
        nextRight &&
        nextRight.name === p.name &&
        !visitedBottom.has(`${nextRight.row}-${nextRight.col}`)
      ) {
        visitedBottom.add(`${nextRight.row}-${nextRight.col}`);
        nextRight =
          nextRight.col + 1 < cols &&
          isBottomOk(p.name, nextRight.row, nextRight.col + 1)
            ? {
                name: map[nextRight.row][nextRight.col + 1],
                row: nextRight.row,
                col: nextRight.col + 1,
              }
            : undefined;
      }
      //calculate left
      let nextLeft =
        left && isBottomOk(p.name, left.row, left.col)
          ? { name: left.name, row: left.row, col: left.col }
          : undefined;
      while (
        nextLeft &&
        nextLeft.name === p.name &&
        !visitedBottom.has(`${nextLeft.row}-${nextLeft.col}`)
      ) {
        visitedBottom.add(`${nextLeft.row}-${nextLeft.col}`);
        nextLeft =
          nextLeft.col - 1 >= 0 &&
          isBottomOk(p.name, nextLeft.row, nextLeft.col - 1)
            ? {
                name: map[nextLeft.row][nextLeft.col - 1],
                row: nextLeft.row,
                col: nextLeft.col - 1,
              }
            : undefined;
      }
      perimeter++;
    }
    if (
      (!right || right.name !== p.name) &&
      !visitedRight.has(`${p.row}-${p.col}`)
    ) {
      visitedRight.add(`${p.row}-${p.col}`);
      // calculate top
      let nextTop =
        top && isRightOk(p.name, top.row, top.col)
          ? { name: top.name, row: top.row, col: top.col }
          : undefined;
      while (
        nextTop &&
        nextTop.name === p.name &&
        !visitedRight.has(`${nextTop.row}-${nextTop.col}`)
      ) {
        visitedRight.add(`${nextTop.row}-${nextTop.col}`);
        nextTop =
          nextTop.row - 1 >= 0 &&
          isRightOk(p.name, nextTop.row - 1, nextTop.col)
            ? {
                name: map[nextTop.row - 1][nextTop.col],
                row: nextTop.row - 1,
                col: nextTop.col,
              }
            : undefined;
      }
      //calculate bottom
      let nextBottom =
        bottom && isRightOk(p.name, bottom.row, bottom.col)
          ? { name: bottom.name, row: bottom.row, col: bottom.col }
          : undefined;
      while (
        nextBottom &&
        nextBottom.name === p.name &&
        !visitedRight.has(`${nextBottom.row}-${nextBottom.col}`)
      ) {
        visitedRight.add(`${nextBottom.row}-${nextBottom.col}`);
        nextBottom =
          nextBottom.row + 1 < rows &&
          isRightOk(p.name, nextBottom.row + 1, nextBottom.col)
            ? {
                name: map[nextBottom.row + 1][nextBottom.col],
                row: nextBottom.row + 1,
                col: nextBottom.col,
              }
            : undefined;
      }
      perimeter++;
    }
    if (
      (!left || left.name !== p.name) &&
      !visitedLeft.has(`${p.row}-${p.col}`)
    ) {
      visitedLeft.add(`${p.row}-${p.col}`);
      // calculate top
      let nextTop =
        top && isLeftOk(p.name, top.row, top.col)
          ? { name: top.name, row: top.row, col: top.col }
          : undefined;
      while (
        nextTop &&
        nextTop.name === p.name &&
        !visitedLeft.has(`${nextTop.row}-${nextTop.col}`)
      ) {
        visitedLeft.add(`${nextTop.row}-${nextTop.col}`);
        nextTop =
          nextTop.row - 1 >= 0 && isLeftOk(p.name, nextTop.row - 1, nextTop.col)
            ? {
                name: map[nextTop.row - 1][nextTop.col],
                row: nextTop.row - 1,
                col: nextTop.col,
              }
            : undefined;
      }
      //calculate bottom
      let nextBottom =
        bottom && isLeftOk(p.name, bottom.row, bottom.col)
          ? { name: bottom.name, row: bottom.row, col: bottom.col }
          : undefined;
      while (
        nextBottom &&
        nextBottom.name === p.name &&
        !visitedLeft.has(`${nextBottom.row}-${nextBottom.col}`)
      ) {
        visitedLeft.add(`${nextBottom.row}-${nextBottom.col}`);
        nextBottom =
          nextBottom.row + 1 < rows &&
          isLeftOk(p.name, nextBottom.row + 1, nextBottom.col)
            ? {
                name: map[nextBottom.row + 1][nextBottom.col],
                row: nextBottom.row + 1,
                col: nextBottom.col,
              }
            : undefined;
      }
      perimeter++;
    }
  });

  return perimeter;
}

function getSecond() {
  let price = 0;
  visitedPlots = new Set();

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (visitedPlots.has(`${i}-${j}`)) {
        continue;
      }

      const plot = map[i][j];
      const points = findAreaPoints(plot, i, j);

      const region = points.size;
      const perimeter = countPerimeterSides(points);

      price = price + perimeter * region;
    }
  }
  return price;
}

console.log(getFirst());
console.log(getSecond());
