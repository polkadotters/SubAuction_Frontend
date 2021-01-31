import React from 'react';

import {
  Grid,
  HStack,
  Button,
  Box,
  Center,
  Stack,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';
import Card from '../Card/Card';
import CreateNft from '../CreateNft';

import { useSubstrate } from '../../substrate-lib';
import { CardListProps } from './CardList.types';

import { xxhashAsHex } from '@polkadot/util-crypto';

// Types
import { Moment } from '@polkadot/types/interfaces';
import CreateAuction from '../CreateAuction';

// const [filters, setFilters] = React.useState('');

export const CardList = ({ accountPair }: CardListProps): JSX.Element => {
  const { api } = useSubstrate();

  const [auctions, setAuctions] = React.useState([]);
  const [auctionStatus, setAuctionStatus] = React.useState('live');
  const [numberTimer, setNumberTimer] = React.useState(0);

  // Create auction
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Create Nft
  const {
    isOpen: isOpenNft,
    onOpen: onOpenNft,
    onClose: onCloseNft,
  } = useDisclosure();

  // const timer = () => {
  //   setNumberTimer((time) => time + 1);
  // };

  // React.useEffect(() => {
  //   const id = setInterval(timer, 3000);
  //   return () => clearInterval(id);
  // }, []);

  React.useEffect(() => {
    let unsub = null;

    const getAuctions = async () => {
      unsub = await api.query.auctions.auctions.entries();
      setAuctions(unsub.map((i) => [i[0].toHuman()[0], i[1].toJSON()]));
    };

    getAuctions();

    return () => unsub && unsub;
  }, [api, setAuctions, accountPair]);

  const [blockNumber, setBlockNumber] = React.useState(0);

  const bestNumber = api.derive.chain.bestNumberFinalized;

  React.useEffect(() => {
    let unsubscribeAll = null;

    bestNumber((number) => {
      setBlockNumber(number.toNumber());
    })
      .then((unsub) => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber]);

  const getFilters = (auction) => {
    if (auctionStatus === 'upcoming') {
      return auction.start > blockNumber;
    }
    if (auctionStatus === 'past') {
      return auction.end < blockNumber;
    } else {
      return auction.start < blockNumber && auction.end > blockNumber;
    }
  };

  return (
    <>
      <HStack mb={6} spacing={6}>
        <Button
          variant="link"
          fontSize="3xl"
          opacity={auctionStatus !== 'live' && 0.6}
          onClick={() => setAuctionStatus('live')}
        >
          Live
        </Button>
        <Button
          variant="link"
          fontSize="3xl"
          opacity={auctionStatus !== 'upcoming' && '0.6'}
          onClick={() => setAuctionStatus('upcoming')}
        >
          Upcoming
        </Button>
        <Button
          variant="link"
          fontSize="3xl"
          opacity={auctionStatus !== 'past' && '0.6'}
          onClick={() => setAuctionStatus('past')}
        >
          Past
        </Button>
      </HStack>

      <Grid
        templateColumns="repeat(auto-fill, minmax(min(16rem, 100%), 1fr))"
        gap={6}
      >
        {/* {classes.map((listClass) => (
          <Box>{listClass.metadata.toString()}</Box>
        ))} */}
        {auctions.length > 0 ? (
          auctions
            .filter((auction) => getFilters(auction[1]))
            .sort(function (a, b) {
              return b[0] - a[0];
            })

            .map((auction) => (
              <Card
                key={auction[0]}
                id={auction[0]}
                auction={auction[1]}
                accountPair={accountPair}
                currentBlock={blockNumber}
              />
            ))
        ) : (
          <>
            <Box
              maxW="sm"
              minHeight="300px"
              borderWidth="1px"
              borderStyle="dashed"
              borderRadius="lg"
              // bgColor="blue.50"
              overflow="hidden"
              as={Center}
              p={8}
            >
              <Stack spacing={8} align="center">
                <Heading fontSize="lg">There are no auctions yet</Heading>
                <Stack spacing={2}>
                  <Button colorScheme="blue" onClick={onOpen}>
                    Create auction
                  </Button>

                  <Button variant="outline" onClick={onOpenNft}>
                    Create NFT
                  </Button>
                </Stack>
              </Stack>
            </Box>
            <CreateAuction
              isOpen={isOpen}
              onClose={onClose}
              accountPair={accountPair}
            />
            <CreateNft
              isOpen={isOpenNft}
              onClose={onCloseNft}
              accountPair={accountPair}
            />
          </>
        )}
      </Grid>
    </>
  );
};
export default CardList;
