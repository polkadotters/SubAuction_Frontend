import React from 'react';
import {
  Badge,
  Image,
  Box,
  Text,
  Avatar,
  useColorModeValue,
  Button,
  Flex,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import { hexToString } from '@polkadot/util';
import { useSubstrate } from '../../substrate-lib';

// Date manipulation
import moment from 'moment';

import BidModal from '@/components/BidModal';

// Types
import { CardProps } from './Card.types';

export const Card: React.FC<CardProps> = ({
  auction,
  accountPair,
}: CardProps) => {
  const { api } = useSubstrate();
  const [owner, setOwner] = React.useState<string>(null);

  const bgColor = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('black', 'white');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const dummy = {
    imageUrl: 'https://bit.ly/2Z4KKcF',
    imageAlt: 'Rear view of modern home with pool',
    beds: 3,
    baths: 2,
    reviewCount: 34,
    rating: 4,
  };

  // const currPrice =
  //   auction.bids.length > 0
  //     ? auction.bids[auction.bids.length - 1]?.price
  //     : auction.startPrice;

  const auctionState = (auction) => {
    if (new Date(auction.startAt) > new Date()) {
      return `starts ${moment(auction.startAt).fromNow()}`;
    }
    if (new Date(auction.endAt) < new Date()) {
      return `ended ${moment(auction.endAt).fromNow()}`;
    } else {
      return `ends ${moment(auction.endAt).fromNow()}`;
    }
  };

  React.useEffect(() => {
    let unsub = null;

    const getOwner = async () => {
      unsub = await api.query.ormlNft.tokens(
        auction.token_id[0],
        auction.token_id[1],
        async (data) => {
          setOwner(data.toJSON().owner);
        },
      );
    };

    getOwner();

    return () => unsub && unsub();
  }, [api, setOwner]);

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      color={color}
      bgColor={bgColor}
      overflow="hidden"
    >
      <Image src={dummy.imageUrl} alt={dummy.imageAlt} />

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          <Badge borderRadius="full" px="2" colorScheme="blue">
            Live
          </Badge>
          <Box
            color="gray.600"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
            ml="2"
          >
            {auctionState(auction)}
          </Box>
        </Box>

        <Box
          mt="1"
          fontWeight="semibold"
          as="h4"
          lineHeight="tight"
          isTruncated
        >
          {hexToString(auction.name)}
        </Box>
        <Flex alignItems="center">
          <Box minW={16}>{`${
            auction.last_bid ? auction.last_bid[1] : auction.minimal_bid
          } KSM`}</Box>
          {auction.last_bid ? (
            <Flex align="center">
              <Text fontSize="sm" color="gray.600" mr="2">
                by
              </Text>

              <Tooltip
                hasArrow
                placement="top"
                label={auction.last_bid[0]}
                aria-label="Last bid"
              >
                <Avatar size="xs" />
              </Tooltip>
            </Flex>
          ) : null}
        </Flex>
        {owner && (
          <Flex align="center">
            <Text mr="2">Owner</Text>

            <Tooltip hasArrow placement="top" label={owner} aria-label="Owner">
              <Avatar size="xs" />
            </Tooltip>
          </Flex>
        )}

        <Button colorScheme="blue" variant="link" onClick={onOpen}>
          Place a bid
        </Button>
        <BidModal
          auction={auction}
          accountPair={accountPair}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Box>
    </Box>
  );
};
export default Card;
