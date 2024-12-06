const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/03.txt', 'utf8');

const mulRegex = /mul\(\d+,\d+\)/g;
const arrayOfMuls = [...data.matchAll(mulRegex)];

const expressionsRegex = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;
const arrayOfExpressions = [...data.matchAll(expressionsRegex)];

function getFirst() {
  let sum = 0;

  for (const match of arrayOfMuls) {
    const expr = match[0];
    const inside = expr.slice(expr.indexOf('(') + 1, expr.indexOf(')'));
    const [firstNumber, secondNumber] = inside.split(',').map(Number);
    sum += firstNumber * secondNumber;
  }

  return sum;
}

function getSecond() {
  let sum = 0;
  let mulEnabled = true;

  for (const match of arrayOfExpressions) {
    const expr = match[0];

    if (expr === "don't()") {
      mulEnabled = false;
    } else if (expr === 'do()') {
      mulEnabled = true;
    } else if (expr.startsWith('mul(')) {
      if (mulEnabled) {
        const inside = expr.slice(expr.indexOf('(') + 1, expr.indexOf(')'));
        const [firstNumber, secondNumber] = inside.split(',').map(Number);
        sum += firstNumber * secondNumber;
      }
    }
  }

  return sum;
}

console.log(getFirst());
console.log(getSecond());
