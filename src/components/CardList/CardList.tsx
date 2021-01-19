import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from 'urql';

import { Grid, BoxProps, HStack, Button, Skeleton } from '@chakra-ui/react';
import Card from '../Card/Card';

import { useSubstrate } from '../../substrate-lib';

const FEED_QUERY = gql`
  {
    feed {
      auctions {
        id
        createdAt
        startAt
        endAt
        startPrice
        postedBy {
          id
        }
        bids {
          price
        }
      }
    }
  }
`;

// const [filters, setFilters] = React.useState('');

export const CardList: React.FC<BoxProps> = () => {
  const { api } = useSubstrate();
  const [auctions, setAuctions] = React.useState<Record<string, unknown>>(null);

  React.useEffect(() => {
    const getInfo = async () => {
      try {
        const result = await Promise.all([api.query.auctions.auctions(0)]);
        setAuctions(result);
        console.log(result);
      } catch (e) {
        console.error(e);
      }
    };
    getInfo();
  }, [api.query.auctions]);

  const [auctionStatus, setAuctionStatus] = React.useState('live');

  // const [result] = useQuery({ query: FEED_QUERY });
  // const { data, fetching, error } = result;

  // if (fetching) return <Skeleton></Skeleton>;
  // if (error) return <div>Error</div>;

  const getFilters = (auction) => {
    if (auctionStatus === 'upcoming') {
      return new Date(auction.startAt) > new Date();
    }
    if (auctionStatus === 'past') {
      return new Date(auction.endAt) < new Date();
    } else {
      return (
        new Date(auction.startAt) < new Date() &&
        new Date(auction.endAt) > new Date()
      );
    }
  };

  // const auctionsToRender = !fetching && data.feed.auctions;

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
        {JSON.stringify(auctions, null, 2)}
        {auctions &&
          auctions
            // .filter((auction) => getFilters(auction))
            .map((auction) => <Card key={auction.id} auction={auction} />)}
      </Grid>
    </>
  );
};
export default CardList;
