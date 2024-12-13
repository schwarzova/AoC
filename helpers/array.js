function deepCopy(inputArray) {
  return JSON.parse(JSON.stringify(inputArray));
}

function unique(array) {
  return array.filter((val, ind, arr) => arr.indexOf(val) === ind);
}

module.exports = { deepCopy, unique };
