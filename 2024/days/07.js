const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/07.txt', 'utf8');

const rows = data
  .trim()
  .split('\n')
  .map((line) => {
    const [target, numbers] = line.split(': ');
    return {
      result: Number(target),
      numbers: numbers.split(' ').map(Number),
    };
  });

function evaluate(numbers, operators) {
  let result = numbers[0];
  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '+') {
      result += numbers[i + 1];
    } else if (operators[i] === '*') {
      result *= numbers[i + 1];
    } else if (operators[i] === '||') {
      result = String(result) + String(numbers[i + 1]);
    }
  }
  return result;
}

// Generate all operator combinations
function generateOperators(numOperators, numOperations) {
  const results = [];
  const totalCombinations = numOperators ** numOperations; // 3^numOperators combinations

  for (let i = 0; i < totalCombinations; i++) {
    let combo = [];
    let value = i;
    for (let j = 0; j < numOperations; j++) {
      const operatorIndex = value % numOperators; // 0 = '+', 1 = '*', 2 = '||'
      combo.push(operatorIndex === 0 ? '+' : operatorIndex === 1 ? '*' : '||');
      value = Math.floor(value / numOperators);
    }
    results.push(combo);
  }

  return results;
}

function getFirst() {
  let sum = 0;

  for (const row of rows) {
    const { result, numbers } = row;
    const numOperations = numbers.length - 1;
    const operatorCombinations = generateOperators(2, numOperations);

    // Check each operator combination
    let isValid = false;
    for (const operators of operatorCombinations) {
      if (evaluate(numbers, operators) === result) {
        isValid = true;
        break;
      }
    }

    if (isValid) sum += result;
  }

  return sum;
}

function getSecond() {
  let sum = 0;

  for (const row of rows) {
    const { result, numbers } = row;
    const numOperations = numbers.length - 1;
    const operatorCombinations = generateOperators(3, numOperations);

    // Check each operator combination
    let isValid = false;
    for (const operators of operatorCombinations) {
      if (evaluate(numbers, operators) === result) {
        isValid = true;
        break;
      }
    }

    if (isValid) sum += result;
  }

  return sum;
}

console.log(getFirst());
console.log(getSecond());
