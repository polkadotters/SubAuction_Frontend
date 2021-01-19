import React from 'react';
import {
  Badge,
  Image,
  Box,
  BoxProps,
  useColorModeValue,
  Button,
  Flex,
  useDisclosure,
} from '@chakra-ui/react';

// Types
import { Auction } from '@/@types/auction';

// Date manipulation
import moment from 'moment';
import BidModal from '@/components/BidModal';

// Types
import { CardProps } from './Card.types';

export const Card: React.FC<BoxProps & Auction> = ({ auction }: CardProps) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('black', 'white');

  console.log(auction);

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
          {auction.name}
        </Box>
        <Flex alignItems="center">
          <Box>{`${auction.minimal_bid} KSM`}</Box>
          <Box as="span" ml="2" color="gray.600" fontSize="sm">
            {`X bids`}
          </Box>
        </Flex>
        {/* <Box>{`Owner: User #${auction.postedBy.id} `}</Box> */}
        <Box>{`Owner: Account xx `}</Box>

        <Button colorScheme="blue" variant="link" onClick={onOpen}>
          Place a bid
        </Button>
        <BidModal
          auction={auction}
          price={auction.minimal_bid}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Box>
    </Box>
  );
};
export default Card;
