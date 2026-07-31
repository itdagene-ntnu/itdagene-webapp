/* eslint-disable @typescript-eslint/no-var-requires */
const {
  createDevServerSpec,
  parseArguments,
  resolvePort,
} = require('./dev-server');

describe('development server isolation', () => {
  it('uses port 3000 by default', () => {
    const spec = createDevServerSpec({ args: [], env: {} });

    expect(spec.port).toBe(3000);
    expect(spec.distDir).toBe('.next-dev/3000');
    expect(spec.env.NEXT_DIST_DIR).toBe('.next-dev/3000');
    expect(spec.args.slice(-2)).toEqual(['-p', '3000']);
  });

  it('isolates generated files for custom ports', () => {
    const first = createDevServerSpec({ args: [], env: { PORT: '3101' } });
    const second = createDevServerSpec({ args: [], env: { PORT: '3102' } });

    expect(first.distDir).toBe('.next-dev/3101');
    expect(second.distDir).toBe('.next-dev/3102');
    expect(first.distDir).not.toBe(second.distDir);
  });

  it('passes an explicit Relay endpoint without shell-specific syntax', () => {
    const spec = createDevServerSpec({
      args: ['--port=3200', '--relay-endpoint=http://localhost:8000/graphql'],
      env: { NODE_ENV: 'test' },
    });

    expect(spec.port).toBe(3200);
    expect(spec.env.RELAY_ENDPOINT).toBe('http://localhost:8000/graphql');
    expect(spec.env.NODE_ENV).toBe('development');
  });

  it('rejects invalid ports and unknown options', () => {
    expect(() => resolvePort('3000x')).toThrow('Invalid development port');
    expect(() => resolvePort('70000')).toThrow(
      'Development port must be between 1 and 65535'
    );
    expect(() => parseArguments(['--unknown'])).toThrow(
      'Unknown development-server option'
    );
  });
});
