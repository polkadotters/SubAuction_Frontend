import React from 'react';
import { Link as GatsbyLink } from 'gatsby';

import {
  Box,
  Heading,
  Link,
  useColorMode,
  Stack,
  IconButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { HeaderProps } from './HeaderProps';

import { getToken } from '@/utils/token';
import Menu from '@/components/Menu';
import BlockNumber from '../BlockNumber/BlockNumber';

const Header = ({
  siteTitle,
  setAccountAddress,
  accountPair,
}: HeaderProps): JSX.Element => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isLoggedIn = !!getToken();

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box as="header" mb="6">
      <Box m="0 auto" maxW="960" px="6" py="5">
        <Stack justify="space-between" align="center" flexDirection="row">
          <Stack alignItems="center" isInline spacing={8}>
            <Heading as="h1" m="0">
              <Link as={GatsbyLink} to="/" textDecoration="none">
                {siteTitle}
              </Link>
            </Heading>
            <BlockNumber finalized />
          </Stack>
          <Stack alignItems="center" isInline spacing={4}>
            <Menu
              setAccountAddress={setAccountAddress}
              accountPair={accountPair}
            />
            <IconButton
              colorScheme="link"
              color={colorMode === 'dark' ? 'white' : 'black'}
              aria-label="Toggle color mode"
              size="lg"
              icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              onClick={toggleColorMode}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default Header;
