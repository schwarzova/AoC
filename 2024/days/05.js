const fs = require('fs');
const path = process.cwd();
const rules = fs.readFileSync(path + '/inputs/05_rules.txt', 'utf8');
const pages = fs.readFileSync(path + '/inputs/05_pages.txt', 'utf8');

const ruleRows = rules.split('\n').map((l) => l.split('|').map(Number));
const pageRows = pages.split('\n').map((l) => l.split(',').map(Number));

function getRuleMap() {
  let uniqNumbers = [];

  for (let i = 0; i < ruleRows.length; i++) {
    const first = ruleRows[i][0];
    const second = ruleRows[i][1];
    uniqNumbers = [...uniqNumbers, first, second];
  }
  uniqNumbers = uniqNumbers.filter((e, i, self) => i === self.indexOf(e));
  const ruleMap = {};

  for (const num of uniqNumbers) {
    ruleMap[num] = { biggerNumbers: [], smallerNumbers: [] };

    for (let j = 0; j < ruleRows.length; j++) {
      const first = ruleRows[j][0];
      const second = ruleRows[j][1];

      if (num === first) {
        ruleMap[num].smallerNumbers = [...ruleMap[num].smallerNumbers, second];
      }
      if (num === second) {
        ruleMap[num].biggerNumbers = [...ruleMap[num].biggerNumbers, first];
      }
    }
  }

  return ruleMap;
}

function isRowCorrect(row) {
  const ruleMap = getRuleMap();
  let isCorrect = true;

  for (let j = 0; j < row.length; j++) {
    const numberToCheck = row[j];
    const numberMap = ruleMap[numberToCheck];

    const numbersBefore = row.slice(0, j);
    const numbersAfter = row.slice(j + 1);

    const allBeforesAreInBiggers = numbersBefore.every((n) =>
      numberMap.biggerNumbers.includes(n)
    );
    const allAfterAreInSmallers = numbersAfter.every((n) =>
      numberMap.smallerNumbers.includes(n)
    );

    isCorrect = isCorrect && allBeforesAreInBiggers && allAfterAreInSmallers;

    if (!isCorrect) {
      break;
    }
  }

  return isCorrect;
}

function fixRow(row) {
  const ruleMap = getRuleMap();

  return row.sort((a, b) => {
    const aRuleMap = ruleMap[a];
    if (aRuleMap.smallerNumbers.includes(b)) {
      return -1;
    }
    return 1;
  });
}

function getFirst() {
  let sum = 0;

  for (let i = 0; i < pageRows.length; i++) {
    const isRowOk = isRowCorrect(pageRows[i]);

    if (isRowOk) {
      const middleIndex = (pageRows[i].length - 1) / 2;
      sum = sum + pageRows[i][middleIndex];
    }
  }

  return sum;
}

function getSecond() {
  let sum = 0;

  for (let i = 0; i < pageRows.length; i++) {
    const row = pageRows[i];
    const isRowOk = isRowCorrect(row);

    if (!isRowOk) {
      const fixedRow = fixRow(row);
      const middleIndex = (fixedRow.length - 1) / 2;
      sum = sum + pageRows[i][middleIndex];
    }
  }

  return sum;
}

console.log(getFirst());
console.log(getSecond());
