import seedRandom from 'seedrandom';

const seedRand = (func: () => number, min: number, max: number): number => {
  return Math.floor(func() * (max - min + 1)) + min;
};

export const seedShuffle = <T>(
  arr: ReadonlyArray<T>,
  seed: string
): ReadonlyArray<T> => {
  const size = arr.length;
  const rng = seedRandom(seed);
  const resp = [];
  const keys = [];

  for (let i = 0; i < size; i++) keys.push(i);
  for (let i = 0; i < size; i++) {
    const r = seedRand(rng, 0, keys.length - 1);
    const g = keys[r];
    keys.splice(r, 1);
    resp.push(arr[g]);
  }
  return resp;
};
