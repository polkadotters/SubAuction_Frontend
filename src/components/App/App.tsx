import React from 'react';

import { useSubstrate } from '../../substrate-lib';
// import { DeveloperConsole } from '../../substrate-lib/components';

import Layout from '@/components/Layout';
import SEO from '@/components/Seo';
import CardList from '@/components/CardList';
import { Flex, Box, Heading, Text, Skeleton, Stack } from '@chakra-ui/react';

// import { getToken } from '@/utils/token'

const App = (): JSX.Element => {
  // const isLoggedIn = !!getToken();
  const [accountAddress, setAccountAddress] = React.useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = (text) => (
    <Stack>
      <Text>{text}</Text>
      <Skeleton height="20px" />
      <Skeleton height="20px" />
      <Skeleton height="20px" />
    </Stack>
  );

  const error = (err) => <Text>{JSON.stringify(err, null, 4)}</Text>;

  if (apiState === 'ERROR') return error(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader(
      "Loading accounts (please review any extension's authorization)",
    );
  }

  return (
    <Layout setAccountAddress={setAccountAddress} accountPair={accountPair}>
      <SEO title="Home" />

      {/* <Flex alignItems="center">
          <Box>
            <Heading>NFT auctions on Polkadot</Heading>
            <Text>Bude to hrozná raketa.</Text>
          </Box>
          <Box bgColor="gray.400">Čus</Box>
        </Flex> */}
      <CardList />
    </Layout>
  );
};

export default App;
