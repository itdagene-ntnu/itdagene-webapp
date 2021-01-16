declare module 'seedrandom' {
  type seedrandom = (seed: string) => () => number;

  const seedrandom: seedrandom;
  export default seedrandom;
}
