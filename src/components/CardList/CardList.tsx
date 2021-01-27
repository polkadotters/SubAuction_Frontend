import React from 'react';

import { Grid, HStack, Button } from '@chakra-ui/react';
import Card from '../Card/Card';

import { useSubstrate } from '../../substrate-lib';
import { CardListProps } from './CardList.types';

import { xxhashAsHex } from '@polkadot/util-crypto';
import { nftList } from '@/utils/nft';

// const [filters, setFilters] = React.useState('');

export const CardList = ({ accountPair }: CardListProps): JSX.Element => {
  const { api } = useSubstrate();
  const [auctions, setAuctions] = React.useState([]);
  const [classes, setClasses] = React.useState([]);
  const [tokensList, setTokensList] = React.useState([]);

  React.useEffect(() => {
    const unsub = null;

    const getTokensByOwner = async () => {
      // unsub = await api.query.ormlNft.classes(null, async (data) => {
      //   console.log('nfts: ', data.toJSON());
      // });

      setTokensList(nftList);
    };

    accountPair && getTokensByOwner();

    return () => unsub && unsub();
  }, [api, accountPair, setTokensList]);

  React.useEffect(() => {
    let unsub = null;

    const getAuctions = async () => {
      unsub = await api.query.auctions.nextAuctionId((res) => {
        const length = parseInt(res.toString());
        const auctionIdArr = Array.from(Array(length).keys());
        const auctionList = [];
        for (const id in auctionIdArr) {
          api.query.auctions.auctions(id, async (data) => {
            auctionList.push(data.toJSON());
          });
        }
        setAuctions(auctionList);
      });

      // unsub = await api.query.auctions.auctions(id, async (data) => {
      //   setAuctions({ ...auctions, [id]: data.toJSON() });
      // });

      // unsub = await api.query.auctions.auctions(6, async (data) => {
      //   setAuctions([data, data]);
      // });

      // unsub = await api.rpc.state.getKeysPaged(
      //   '0x53aafa26381dc69f4424ecfa11278236ca32a41f4b3ed515863dc0a38697f84e',
      //   100,
      //   async (data) => {
      //     data
      //       ? await api.rpc.state.queryStorageAt(
      //           data.toJSON(),
      //           async (rawRes) => {
      //             const roles = rawRes
      //               .map((r) => r.toHuman())
      //               .map((r) => hexToString(r));
      //             console.log(roles);
      //             setAuctions(roles);
      //           },
      //         )
      //       : null;
      //     console.log('keys: ', data.toJSON());
      //   },
      // );
    };

    api && getAuctions();

    return () => unsub && unsub();
  }, [setAuctions, api]);

  React.useEffect(() => {
    const unsub = null;

    const getClasses = async () => {
      console.log(
        xxhashAsHex('ormlNft', 64) + xxhashAsHex('classes', 64).substr(2),
      );
      // unsub = await api.rpc.state.getKeysPaged(
      //   xxhashAsHex(['Auctions','Auctions'],64),
      //   100,
      //   '0xca32a41f4b3ed51541756374696f6e73ca32a41f4b3ed51541756374696f6e73',
      //   async (data) => {
      //     setClasses(data);
      //     console.log(data);
      //   },
      // );
    };

    getClasses();

    return () => unsub && unsub();
  }, [api, setClasses]);

  const [auctionStatus, setAuctionStatus] = React.useState('live');

  // const getFilters = (auction) => {
  //   if (auctionStatus === 'upcoming') {
  //     return new Date(auction.startAt) > new Date();
  //   }
  //   if (auctionStatus === 'past') {
  //     return new Date(auction.endAt) < new Date();
  //   } else {
  //     return (
  //       new Date(auction.startAt) < new Date() &&
  //       new Date(auction.endAt) > new Date()
  //     );
  //   }
  // };

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
        {auctions.length > 0 &&
          auctions
            // .filter((auction) => getFilters(auction))
            .map((auction, index) => (
              <Card
                key={index}
                id={index}
                auction={auction}
                accountPair={accountPair}
              />
            ))}
      </Grid>
    </>
  );
};
export default CardList;
