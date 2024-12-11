const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/11.txt', 'utf8');

let stones = {};

data.split(' ').forEach((part) => {
  stones[part] = stones[part] ? stones[part] + 1 : 1;
});

const addCountToCache = (cache, key, count) => {
  cache[key] = cache[key] ? cache[key] + count : count;
};

function getStones(blinks) {
  for (let i = 0; i < blinks; i++) {
    let cache = {};

    for (const [key, count] of Object.entries(stones)) {
      if (key === '0') {
        addCountToCache(cache, '1', count);
      } else if (key.length % 2 === 0) {
        addCountToCache(
          cache,
          Number(key.slice(0, key.length / 2)).toString(),
          count
        );
        addCountToCache(
          cache,
          Number(key.slice(key.length / 2, key.length)).toString(),
          count
        );
      } else {
        addCountToCache(cache, (Number(key) * 2024).toString(), count);
      }
    }
    stones = cache;
  }

  return Object.values(stones).reduce((a, b) => a + b, 0);
}

console.log(getStones(75));
