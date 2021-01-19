import React from 'react';
import { createClient, dedupExchange, fetchExchange, Provider } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import fetch from 'isomorphic-fetch';
import { PageProps } from 'gatsby';
import { getToken } from '@/utils/token';

import App from '@/components/App';
import { SubstrateContextProvider } from '@/substrate-lib';

const cache = cacheExchange({});

const client = createClient({
  url: 'http://localhost:4000',
  fetchOptions: () => {
    const token = getToken();
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
  exchanges: [dedupExchange, cache, fetchExchange],
  fetch,
});

const Home: React.FC<PageProps> = () => (
  <Provider value={client}>
    <SubstrateContextProvider>
      <App />
    </SubstrateContextProvider>
  </Provider>
);

export default Home;
