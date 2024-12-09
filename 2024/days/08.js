const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/08.txt', 'utf8');

let mapOfAnthenas = [];
let mapOfAntinodes = [];
const antennas = {};

data.split('\n').map((l, i) => {
  const row = l.split('');
  const antennaRowIndexes = row
    .map((char, i) => (char !== '.' ? i : null))
    .filter((ind) => ind !== null);

  antennaRowIndexes.forEach((index) => {
    const antenna = row[index];

    if (antennas[antenna]) {
      antennas[antenna] = [...antennas[antenna], [i, index]];
    } else {
      antennas[antenna] = [[i, index]];
    }
  });

  mapOfAnthenas = [...mapOfAnthenas, row];
  mapOfAntinodes = [
    ...mapOfAntinodes,
    Array.from({ length: row.length }, () => '.'),
  ];
});

const cols = mapOfAnthenas.length;
const rows = mapOfAnthenas[0].length;

function getFirst() {
  let antinodes = new Set();

  Object.keys(antennas).forEach((a) => {
    const positions = antennas[a];

    for (let i = 0; i < positions.length; i++) {
      const antenna = positions[i];
      const otherPositions = positions.filter((_p, ind) => ind !== i);

      for (let j = 0; j < otherPositions.length; j++) {
        const otherAntenna = otherPositions[j];
        const antiNodeCol = otherAntenna[1] + (otherAntenna[1] - antenna[1]);
        const antiNodeRow = otherAntenna[0] + (otherAntenna[0] - antenna[0]);

        if (
          antiNodeCol >= 0 &&
          antiNodeCol < cols &&
          antiNodeRow >= 0 &&
          antiNodeRow < rows
        ) {
          antinodes.add(`${antiNodeRow}-${antiNodeCol}`);
        }
      }
    }
  });

  return antinodes.size;
}

function findAntinodes(antenna, otherAntenna, antinodes = []) {
  const antiNodeCol = otherAntenna[1] + (otherAntenna[1] - antenna[1]);
  const antiNodeRow = otherAntenna[0] + (otherAntenna[0] - antenna[0]);

  if (
    antiNodeCol >= 0 &&
    antiNodeCol < cols &&
    antiNodeRow >= 0 &&
    antiNodeRow < rows
  ) {
    antinodes = [...antinodes, [antiNodeRow, antiNodeCol]];
    return findAntinodes(otherAntenna, [antiNodeRow, antiNodeCol], antinodes);
  } else {
    return antinodes;
  }
}

function getSecond() {
  let antinodesSet = new Set();

  Object.keys(antennas).forEach((a) => {
    const positions = antennas[a];

    for (let i = 0; i < positions.length; i++) {
      const antenna = positions[i];
      const otherPositions = positions.filter((_p, ind) => ind !== i);

      for (let j = 0; j < otherPositions.length; j++) {
        const otherAntenna = otherPositions[j];
        const antinodes = [
          ...findAntinodes(antenna, otherAntenna),
          otherAntenna,
        ];
        antinodes.forEach((an) => antinodesSet.add(`${an[0]}-${an[1]}`));
      }
    }
  });

  return antinodesSet.size;
}

console.log(getFirst());
console.log(getSecond());
