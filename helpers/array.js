function deepCopy(inputArray) {
  return JSON.parse(JSON.stringify(inputArray));
}

module.exports = { deepCopy };
