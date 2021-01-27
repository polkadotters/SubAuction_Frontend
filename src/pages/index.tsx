import React from 'react';
import { PageProps } from 'gatsby';

import App from '@/components/App';
import { SubstrateContextProvider } from '@/substrate-lib';

const Home: React.FC<PageProps> = () => (
  <SubstrateContextProvider>
    <App />
  </SubstrateContextProvider>
);

export default Home;
