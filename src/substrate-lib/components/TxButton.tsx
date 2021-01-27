import React, { useState, useEffect } from 'react';
import { Button, Box, useToast } from '@chakra-ui/react';
import { web3FromSource } from '@polkadot/extension-dapp';

import { useSubstrate } from '..';
import utils from '../utils';

import { TxButtonType } from './txButton.types';

interface TxButtonsProps {
  accountPair: Record<string, unknown>;
  setStatus: React.Dispatch<any>;
  type: TxButtonType;
  attrs: {
    palletRpc: string;
    callable: string;
    inputParams: Array<string | number | boolean> | Record<string, unknown>[];
    paramFields: Array<string | number | boolean> | Record<string, unknown>;
  };
  label: string;
  colorScheme?: string;
  variant?: string;
  disabled?: boolean;
}

const TxButton = ({
  accountPair = null,
  label,
  setStatus,
  colorScheme = 'blue',
  variant = null,
  type = TxButtonType.QUERY,
  attrs = null,
  disabled = false,
}: TxButtonsProps): JSX.Element => {
  // Hooks
  const { api } = useSubstrate();
  const [unsub, setUnsub] = useState(null);
  const [sudoKey, setSudoKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const { palletRpc, callable, inputParams, paramFields } = attrs;

  const isQuery = () => type === 'QUERY';
  const isSudo = () => type === 'SUDO-TX';
  const isUncheckedSudo = () => type === 'UNCHECKED-SUDO-TX';
  const isUnsigned = () => type === 'UNSIGNED-TX';
  const isSigned = () => type === 'SIGNED-TX';
  const isRpc = () => type === 'RPC';
  const isConstant = () => type === 'CONSTANT';

  const loadSudoKey = () => {
    (async function () {
      if (!api || !api.query.sudo) {
        return;
      }
      const sudoKey = await api.query.sudo.key();
      sudoKey.isEmpty ? setSudoKey(null) : setSudoKey(sudoKey.toString());
    })();
  };

  useEffect(loadSudoKey, [api]);

  const getFromAcct = async () => {
    const {
      address,
      meta: { source, isInjected },
    } = accountPair;
    let fromAcct;

    // signer is from Polkadot-js browser extension
    if (isInjected) {
      const injected = await web3FromSource(source);
      fromAcct = address;
      api.setSigner(injected.signer);
    } else {
      fromAcct = accountPair;
    }

    return fromAcct;
  };

  const txResHandler = ({ dispatchError, status }) => {
    if (dispatchError !== undefined) {
      setIsLoading(false);
      let message = dispatchError.type;
      if (dispatchError.isModule) {
        try {
          const mod = dispatchError.asModule;
          const error = dispatchError.registry.findMetaError(mod);

          message = `${error.section}.${error.name}`;
        } catch (error) {
          // swallow
        }
      }
      toast({
        title: 'Something went wrong',
        description: message,
        status: 'error',
      });
      return;
    }

    status.isFinalized
      ? setStatus('')
      : setStatus(`Current transaction status: ${status.type}`);

    if (status.isFinalized) {
      setIsLoading(false);
      toast({
        title: 'All done!',
        description: `Block hash: ${status.asFinalized.toString()}`,
        status: 'success',
      });
    }
  };

  const txErrHandler = (err) =>
    setStatus(`😞 Transaction Failed: ${err.toString()}`);

  const sudoTx = async () => {
    const fromAcct = await getFromAcct();
    const transformed = transformParams(paramFields, inputParams);
    // transformed can be empty parameters
    const txExecute = transformed
      ? api.tx.sudo.sudo(api.tx[palletRpc][callable](...transformed))
      : api.tx.sudo.sudo(api.tx[palletRpc][callable]());

    const unsub = txExecute
      .signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsub);
  };

  const uncheckedSudoTx = async () => {
    const fromAcct = await getFromAcct();
    const txExecute = api.tx.sudo.sudoUncheckedWeight(
      api.tx[palletRpc][callable](...inputParams),
      0,
    );

    const unsub = txExecute
      .signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsub);
  };

  const signedTx = async () => {
    const fromAcct = await getFromAcct();
    const transformed = transformParams(paramFields, inputParams);
    // transformed can be empty parameters

    const txExecute = transformed
      ? api.tx[palletRpc][callable](...transformed)
      : api.tx[palletRpc][callable]();

    const unsub = await txExecute
      .signAndSend(fromAcct, txResHandler)
      .catch(txErrHandler);
    setUnsub(() => unsub);
  };

  const unsignedTx = async () => {
    const transformed = transformParams(paramFields, inputParams);
    // transformed can be empty parameters
    const txExecute = transformed
      ? api.tx[palletRpc][callable](...transformed)
      : api.tx[palletRpc][callable]();

    const unsub = await txExecute.send(txResHandler).catch(txErrHandler);
    setUnsub(() => unsub);
  };

  const queryResHandler = (result) =>
    result.isNone ? setStatus('None') : setStatus(result.toString());

  const query = async () => {
    const transformed = transformParams(paramFields, inputParams);
    const unsub = await api.query[palletRpc][callable](
      ...transformed,
      queryResHandler,
    );
    setUnsub(() => unsub);
  };

  const rpc = async () => {
    const transformed = transformParams(paramFields, inputParams, {
      emptyAsNull: false,
    });
    const unsub = await api.rpc[palletRpc][callable](
      ...transformed,
      queryResHandler,
    );
    setUnsub(() => unsub);
  };

  const constant = () => {
    const result = api.consts[palletRpc][callable];
    result.isNone ? setStatus('None') : setStatus(result.toString());
  };

  const transaction = async () => {
    if (unsub) {
      unsub();
      setUnsub(null);
    }

    setStatus('Sending...');
    setIsLoading(true);
    (isSudo() && sudoTx()) ||
      (isUncheckedSudo() && uncheckedSudoTx()) ||
      (isSigned() && signedTx()) ||
      (isUnsigned() && unsignedTx()) ||
      (isQuery() && query()) ||
      (isRpc() && rpc()) ||
      (isConstant() && constant());
  };

  const transformParams = (
    paramFields,
    inputParams,
    opts = { emptyAsNull: true },
  ) => {
    // if `opts.emptyAsNull` is true, empty param value will be added to res as `null`.
    //   Otherwise, it will not be added
    const paramVal = inputParams.map((inputParam) => {
      // To cater the js quirk that `null` is a type of `object`.
      if (
        typeof inputParam === 'object' &&
        inputParam !== null &&
        typeof inputParam.value === 'string'
      ) {
        return inputParam.value.trim();
      } else if (typeof inputParam === 'string') {
        return inputParam.trim();
      }
      return inputParam;
    });
    const params = paramFields.map((field, ind) => ({
      ...field,
      value: paramVal[ind] || null,
    }));

    return params.reduce((memo, { type = 'string', value }) => {
      if (value == null || value === '')
        return opts.emptyAsNull ? [...memo, null] : memo;

      let converted = value;

      // Deal with a vector
      if (type.indexOf('Vec<') >= 0) {
        converted = converted.split(',').map((e) => e.trim());
        converted = converted.map((single) =>
          isNumType(type)
            ? single.indexOf('.') >= 0
              ? Number.parseFloat(single)
              : Number.parseInt(single)
            : single,
        );
        return [...memo, converted];
      }

      // Deal with a single value
      if (isNumType(type)) {
        converted =
          converted.indexOf('.') >= 0
            ? Number.parseFloat(converted)
            : Number.parseInt(converted);
      }
      return [...memo, converted];
    }, []);
  };

  const isNumType = (type) =>
    utils.paramConversion.num.some((el) => type.indexOf(el) >= 0);

  const allParamsFilled = () => {
    if (paramFields.length === 0) {
      return true;
    }

    return paramFields.every((paramField, ind) => {
      const param = inputParams[ind];
      if (paramField.optional) {
        return true;
      }
      if (param == null) {
        return false;
      }

      const value = typeof param === 'object' ? param.value : param;
      return value !== null && value !== '';
    });
  };

  const isSudoer = (acctPair) => {
    if (!sudoKey || !acctPair) {
      return false;
    }
    return acctPair.address === sudoKey;
  };

  return (
    <Button
      variant={variant}
      colorScheme={colorScheme}
      type="submit"
      onClick={transaction}
      isLoading={isLoading}
      disabled={
        disabled ||
        !palletRpc ||
        !callable ||
        !allParamsFilled() ||
        ((isSudo() || isUncheckedSudo()) && !isSudoer(accountPair)) ||
        isLoading
      }
    >
      {label}
    </Button>
  );
};

const TxGroupButton = (props) => {
  return (
    <Box>
      <TxButton
        label="Unsigned"
        type={TxButtonType.UNISGNEDTX}
        color="grey"
        {...props}
      />

      <TxButton
        label="Signed"
        type={TxButtonType.SIGNEDTX}
        color="blue"
        {...props}
      />

      <TxButton
        label="SUDO"
        type={TxButtonType.SUDOTX}
        color="red"
        {...props}
      />
    </Box>
  );
};

export { TxButton, TxGroupButton };
