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
import { useSubstrate } from '../../substrate-lib';

// Date manipulation
import moment from 'moment';

import BidModal from '@/components/BidModal';

// Types
import { CardProps } from './Card.types';
import { hexToString } from '@polkadot/util';
import { avatar } from '@/utils/avatars';

export const Card: React.FC<CardProps> = ({
  auction,
  accountPair,
  id,
  currentBlock,
}: CardProps) => {
  const { api } = useSubstrate();
  // const [owner, setOwner] = React.useState<string>(null);
  const [metadata, setMetadata] = React.useState<string>(null);

  const bgColor = useColorModeValue('white', 'gray.900');
  const color = useColorModeValue('black', 'white');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const imgSrc =
    (metadata && JSON.parse(hexToString(metadata).replace(/'/g, '"')).image) ||
    '';

  // const imgSrc =
  //   typeof metadata === 'string'
  //     ? `https://ipfs.io/ipfs/${hexToString(metadata)}`
  //     : 'https://bit.ly/2Z4KKcF';

  const dummy = {
    imageUrl: imgSrc || '',
    imageAlt: 'Rear view of modern home with pool',
    beds: 3,
    baths: 2,
    reviewCount: 34,
    rating: 4,
  };

  const isActive = auction.start < currentBlock && auction.end > currentBlock;

  // const currPrice =
  //   auction.bids.length > 0
  //     ? auction.bids[auction.bids.length - 1]?.price
  //     : auction.startPrice;

  const auctionState = (auction) => {
    if (auction.start > currentBlock) {
      // return `starts ${moment(auction.startAt).fromNow()}`;
      const blockDifference = auction.start - currentBlock;
      const timeDifference = moment().add(blockDifference * 6, 'seconds');
      return `starts ${moment(timeDifference).fromNow()}`;
    }
    if (auction.end < currentBlock) {
      const blockDifference = currentBlock - auction.end;
      const timeDifference = moment().subtract(blockDifference * 6, 'seconds');
      return `ended ${moment(timeDifference).fromNow()}`;
    } else {
      const blockDifference = auction.end - currentBlock;
      const timeDifference = moment().add(blockDifference * 6, 'seconds');

      return `ends ${moment(timeDifference).fromNow()}`;
    }
  };

  React.useEffect(() => {
    let unsub = null;

    const getOwner = async () => {
      unsub = await api.query.ormlNft.tokens(
        auction.token_id[0],
        auction.token_id[1],
        async (data) => {
          // setOwner(data.toJSON().owner);
          setMetadata(data.toJSON().metadata);
        },
      );
    };

    auction && getOwner();

    return () => unsub && unsub();
  }, [api, setMetadata]);

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      color={color}
      bgColor={bgColor}
      overflow="hidden"
    >
      <Image
        src={dummy.imageUrl}
        alt={dummy.imageAlt}
        maxH="300px"
        w="100%"
        objectFit="cover"
      />

      <Box p="6">
        <Box d="flex" alignItems="baseline">
          {isActive && (
            <Badge borderRadius="full" px="2" mr="2" colorScheme="blue">
              Live
            </Badge>
          )}
          <Box
            color="gray.100"
            fontWeight="semibold"
            letterSpacing="wide"
            fontSize="xs"
            textTransform="uppercase"
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
          } SUB`}</Box>
          {auction.last_bid ? (
            <Flex align="center">
              <Text fontSize="sm" color="gray.200" mr="2">
                Last bid
              </Text>

              <Tooltip
                hasArrow
                placement="top"
                label={auction.last_bid[0]}
                aria-label="Last bid"
              >
                <Avatar size="xs" src={avatar[auction.last_bid[0]]} />
              </Tooltip>
            </Flex>
          ) : null}
        </Flex>
        {auction.owner && (
          <Flex align="center">
            <Text mr="2">Owner</Text>

            <Tooltip
              hasArrow
              placement="top"
              label={auction.owner}
              aria-label="Owner"
            >
              <Avatar size="xs" src={avatar[auction.owner]} />
            </Tooltip>
          </Flex>
        )}
        {isActive && (
          <Button colorScheme="blue" variant="link" onClick={onOpen}>
            Place a bid
          </Button>
        )}
        <BidModal
          auction={auction}
          accountPair={accountPair}
          isOpen={isOpen}
          onClose={onClose}
          id={id}
          // React-Hot-Loader: App container
        />
      </Box>
    </Box>
  );
};
export default Card;
