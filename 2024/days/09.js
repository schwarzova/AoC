const fs = require('fs');
const path = process.cwd();
const data = fs.readFileSync(path + '/2024/inputs/09.txt', 'utf8');

const dataArr = data.split('').map(Number);

function getSum(blocks) {
  let sum = 0;
  for (let i = 0; i < blocks.length; i++) {
    sum = sum + i * Number(blocks[i]);
  }

  return sum;
}

function createBlocks(dataArr) {
  let blocks = [];
  let fileIds = [];
  let lastId = 0;
  let numberOfFree = 0;
  // create individual blocks representation
  for (let i = 0; i < dataArr.length; i++) {
    const num = dataArr[i];
    const isFile = i % 2 === 0;

    if (isFile) {
      // put id x num
      blocks = [
        ...blocks,
        { type: 'file', ids: Array.from({ length: num }, () => lastId) },
      ];
      fileIds = [...fileIds, ...Array.from({ length: num }, () => lastId)];

      lastId = lastId + 1;
    } else {
      // put free space x num
      numberOfFree = numberOfFree + num;
      blocks = [...blocks, { type: 'free', count: num }];
    }
  }

  return { blocks, fileIds, numberOfFree };
}

function getFirst() {
  let { blocks, fileIds, numberOfFree } = createBlocks(dataArr);

  fileIds = fileIds.reverse();
  let lastIndex = 0;

  // move blocks until no free spaces
  while (blocks.some((b) => b.type === 'free')) {
    // find first free + count
    const freeIndex = blocks.findIndex((b) => b.type === 'free');
    let freeCount = blocks[freeIndex].count;

    const ids = fileIds.slice(lastIndex, lastIndex + freeCount);

    // put ids instead of free spaces
    blocks[freeIndex] = { type: 'file', ids };
    lastIndex = lastIndex + freeCount;
  }

  const blockSingleArray = blocks.map((b) => b.ids).flat();
  const blockSingleArrayNoFree = blockSingleArray.slice(
    0,
    blockSingleArray.length - numberOfFree
  );

  return getSum(blockSingleArrayNoFree);
}

function getSecond() {
  let { blocks } = createBlocks(dataArr);

  for (let i = blocks.length - 1; i >= 0; i--) {
    const isFile = blocks[i].type === 'file';
    if (isFile) {
      const ids = blocks[i].ids;

      // find index of free space where ids fit
      for (let j = 0; j < i; j++) {
        const isFree = blocks[j].type === 'free';
        if (isFree) {
          const isEnough = blocks[j].count >= ids.length;
          if (isEnough) {
            if (blocks[j].count === ids.length) {
              blocks[j] = blocks[i];
              blocks[i] = { type: 'free', count: ids.length };
            } else {
              blocks = [
                ...blocks.slice(0, j),
                blocks[i],
                { ...blocks[j], count: blocks[j].count - ids.length },
                ...blocks.slice(j + 1),
              ];
              blocks[i + 1] = { type: 'free', count: ids.length };
            }
            break;
          }
        }
      }
    }
  }

  const blockSingleArray = blocks
    .map((b) =>
      b.type === 'file' ? b.ids : Array.from({ length: b.count }, () => 0)
    )
    .flat();

  return getSum(blockSingleArray);
}

console.log(getFirst());
console.log(getSecond());
