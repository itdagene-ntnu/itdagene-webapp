export default function debounce(
  inner: (...args: any[]) => any,
  ms = 0
): (arg0: any) => Promise<any> {
  //TODO
  let timer: ReturnType<typeof setTimeout> | null = null;
  let resolves: any[] = [];

  return function (...args): Promise<any> {
    // Run the function after a certain amount of time
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      // Get the result of the inner function, then apply it to the resolve function of
      // each promise that has been created since the last time the inner function was run
      const result = inner(...args);
      resolves.forEach((r) => r(result));
      resolves = [];
    }, ms);

    return new Promise((r) => resolves.push(r));
  };
}
