import React from 'react';
// import { deleteToken, setToken, getToken } from '@/utils/token';

import {
  Avatar,
  Button,
  Menu as MenuChakra,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import { useSubstrate } from '@/substrate-lib';
//import { navigate } from '@reach/router';

// Types
import { MenuProps } from './MenuProps';
import { BalanceProps } from './BalanceProps';

// Components
import CreateAuction from '@/components/CreateAuction';
import { CreateNft } from '../CreateNft/CreateNft';
import { avatar } from '@/utils/avatars';

// Graphql connection
// import gql from 'graphql-tag';
// import { useQuery, useMutation } from 'urql';

// const ALLUSERS_QUERY = gql`
//   {
//     allUsers {
//       users {
//         id
//         name
//       }
//     }
//   }
// `;

// const LOGIN_MUTATION = gql`
//   mutation LoginMutation($id: Int!) {
//     login(id: $id) {
//       token
//     }
//   }
// `;

export const Main = ({
  setAccountAddress,
  accountPair,
}: MenuProps): JSX.Element => {
  // Create auction
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Create Nft
  const {
    isOpen: isOpenNft,
    onOpen: onOpenNft,
    onClose: onCloseNft,
  } = useDisclosure();

  // On-chain auth
  const { keyring } = useSubstrate();
  const [accountSelected, setAccountSelected] = React.useState('');

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map((account) => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase(),
    icon: 'user',
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  React.useEffect(() => {
    setAccountAddress(initialAddress);
    setAccountSelected(initialAddress);
  }, [setAccountAddress, initialAddress]);

  const onChange = (address) => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  const adresy = [];
  keyringOptions.map((account, index: number) => {
    adresy.push(account.value);
  });

  return (
    <>
      <MenuChakra isLazy>
        <Button isFullWidth onClick={onOpenNft}>
          Create NFT
        </Button>

        <Button isFullWidth onClick={onOpen}>
          Create auction
        </Button>

        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          w="100%"
          maxW="2xs"
        >
          <Avatar
            name={accountPair?.meta.name.toUpperCase() || ''}
            src={avatar[accountPair?.address] || ''}
            mr={2}
            size="xs"
          />
          <span>
            {accountPair?.meta.name.toUpperCase() || 'Connect wallet'}
          </span>
        </MenuButton>
        <MenuList>
          {keyringOptions.map((account, index: number) => (
            <>
              <MenuItem key={index} onClick={() => onChange(account.value)}>
                <Avatar
                  name={account.text}
                  src={avatar[account.value]}
                  mr={2}
                />
                <span>{`${account.text}`}</span>
              </MenuItem>
            </>
          ))}
        </MenuList>
      </MenuChakra>
      <BalanceAnnotation accountSelected={accountSelected} />
      <CreateAuction
        isOpen={isOpen}
        onClose={onClose}
        accountPair={accountPair}
        setAccountAddress={setAccountAddress}
      />
      <CreateNft
        isOpen={isOpenNft}
        onClose={onCloseNft}
        accountPair={accountPair}
      />
    </>
  );
};

const BalanceAnnotation = (props: BalanceProps) => {
  const { accountSelected } = props;
  const { api } = useSubstrate();
  const [accountBalance, setAccountBalance] = React.useState(0);

  // When account address changes, update subscriptions
  React.useEffect(() => {
    let unsubscribe;

    // If the user has selected an address, create a new subscription
    accountSelected &&
      api.query.system
        .account(accountSelected, (balance) => {
          setAccountBalance(balance.data.free.toHuman());
        })
        .then((unsub) => {
          unsubscribe = unsub;
        })
        .catch(console.error);

    return () => unsubscribe && unsubscribe();
  }, [api, accountSelected]);

  return accountSelected ? <Text>{accountBalance}</Text> : null;
};

const Menu = (props) => {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
};

export default Menu;
