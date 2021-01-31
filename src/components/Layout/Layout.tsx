/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */
import React from 'react';
import { useStaticQuery, graphql } from 'gatsby';

import { Box, Link, Icon } from '@chakra-ui/react';
import Header from '../Header';

import { LayoutProps } from './LayoutProps';

const Layout = ({
  children,
  setAccountAddress,
  accountPair,
}: LayoutProps): JSX.Element => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Header
        siteTitle={data.site.siteMetadata.title}
        setAccountAddress={setAccountAddress}
        accountPair={accountPair}
      />
      <Box m="0 auto" maxW="960" px="6" py="5">
        <Box as="main">{children}</Box>
        <Box as="footer" mt={16}>
          © {new Date().getFullYear()}, Built for{' '}
          <Link href="https://hack.encode.club/" color="blue.500" isExternal>
            Encode hackathon
            <Icon name="external-link" mx="2px" />
          </Link>
        </Box>
      </Box>
    </>
  );
};

export default Layout;
