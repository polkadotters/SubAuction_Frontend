import configCommon from './common.json';
// Using `require` as `import` does not support dynamic loading (yet).
// const configEnv = require(`./${process.env.NODE_ENV}.json`);
import configEnv from './development.json';

// Accepting React env vars and aggregating them into `config` object.
const envVarNames = [
  'REACT_APP_PROVIDER_SOCKET',
  'REACT_APP_DEVELOPMENT_KEYRING',
];
const envVars = envVarNames.reduce((mem, n) => {
  // Remove the `REACT_APP_` prefix
  if (process.env[n] !== undefined) mem[n.slice(10)] = process.env[n];
  return mem;
}, {});

const config = { ...configCommon, ...configEnv, ...envVars };
export default config;
