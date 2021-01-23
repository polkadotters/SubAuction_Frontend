// This component will simply add utility functions to your developer console.
import { useSubstrate } from '..';

import util from '@polkadot/util';
import utilCrypto from '@polkadot/util-crypto';

export default function DeveloperConsole(props) {
  const { api, apiState, keyring, keyringState } = useSubstrate();
  if (apiState === 'READY') {
    window.api = api;
  }
  if (keyringState === 'READY') {
    window.keyring = keyring;
  }
  window.util = util;
  window.utilCrypto = utilCrypto;

  return null;
}
