/* eslint-disable @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-var-requires */
const { spawn } = require('child_process');

const DEFAULT_PORT = 3000;

const resolvePort = (value) => {
  if (value === undefined || value === '') {
    return DEFAULT_PORT;
  }

  if (!/^\d+$/.test(value)) {
    throw new Error(`Invalid development port: ${value}`);
  }

  const port = Number(value);

  if (port < 1 || port > 65535) {
    throw new Error(`Development port must be between 1 and 65535: ${value}`);
  }

  return port;
};

const parseArguments = (args) =>
  args.reduce((options, argument) => {
    if (argument.startsWith('--port=')) {
      return { ...options, port: argument.slice('--port='.length) };
    }

    if (argument.startsWith('--relay-endpoint=')) {
      return {
        ...options,
        relayEndpoint: argument.slice('--relay-endpoint='.length),
      };
    }

    throw new Error(`Unknown development-server option: ${argument}`);
  }, {});

const createDevServerSpec = ({
  args = process.argv.slice(2),
  env = process.env,
} = {}) => {
  const options = parseArguments(args);
  const port = resolvePort(options.port ?? env.PORT);
  const distDir = `.next-dev/${port}`;
  const childEnv = {
    ...env,
    NEXT_DIST_DIR: distDir,
    NODE_ENV: 'development',
    PORT: String(port),
  };

  if (options.relayEndpoint) {
    childEnv.RELAY_ENDPOINT = options.relayEndpoint;
  }

  return {
    args: [require.resolve('next/dist/bin/next'), 'dev', '-p', String(port)],
    command: process.execPath,
    distDir,
    env: childEnv,
    port,
  };
};

const run = () => {
  let spec;

  try {
    spec = createDevServerSpec();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  const child = spawn(spec.command, spec.args, {
    env: spec.env,
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error(`Unable to start the development server: ${error.message}`);
    process.exitCode = 1;
  });

  child.on('exit', (code, signal) => {
    if (signal === 'SIGINT') {
      process.exitCode = 130;
      return;
    }

    process.exitCode = code ?? 1;
  });
};

if (require.main === module) {
  run();
}

module.exports = {
  createDevServerSpec,
  parseArguments,
  resolvePort,
};
