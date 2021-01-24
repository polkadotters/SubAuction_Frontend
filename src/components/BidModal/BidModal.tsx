import React from 'react';

import {
  Text,
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInputField,
  NumberInputStepper,
  InputGroup,
  InputLeftAddon,
  useToast,
} from '@chakra-ui/react';

// Utils
import { hexToString } from '@polkadot/util';

// Graphql connection
import gql from 'graphql-tag';
import { useMutation } from 'urql';

// Types
import { TxButtonType } from '@/substrate-lib/components/txButton.types';
import { BidModalProps } from './BidModal.types';
import { TxButton } from '@/substrate-lib/components/TxButton';

const BID_MUTATION = gql`
  mutation NewBid($auctionId: ID!, $price: Float!) {
    bid(auctionId: $auctionId, price: $price) {
      id
    }
  }
`;

export const BidModal = ({
  isOpen,
  onClose,
  auction,
  accountPair,
}: BidModalProps): JSX.Element => {
  const initialRef = React.useRef();

  const [bidValue, setBidValue] = React.useState(auction.minimal_bid);

  const [state, executeMutation] = useMutation(BID_MUTATION);

  console.log(accountPair);

  // Transaction status
  const [status, setStatus] = React.useState(null);

  const toast = useToast();

  const submit = React.useCallback(() => {
    executeMutation({ auctionId: auction?.id, price: bidValue }).then(
      (data) => {
        if (data.error) {
          toast({
            title: 'Oh, something went wrong.',
            description: data.error.message,
            status: 'error',
            isClosable: true,
          });
        }
      },
    );
  }, [executeMutation, auction?.id, bidValue]);

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Place a Bid</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Your bid</FormLabel>
              <InputGroup size="lg">
                <InputLeftAddon>KSM</InputLeftAddon>
                <NumberInput
                  placeholder="Enter your amount"
                  size="lg"
                  onChange={(val) => setBidValue(parseInt(val))}
                  value={bidValue}
                  min={auction.minimal_bid}
                >
                  <NumberInputField ref={initialRef} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            </FormControl>

            <Text fontSize="sm" fontStyle="italic" mt={2}>
              Minimum bid is {auction.minimal_bid} KSM
            </Text>
            <Text fontSize="sm" mt={6}>
              You&apos;re about to place a bid of{' '}
              <Text as="span" fontWeight="bold">
                {bidValue} KSM
              </Text>{' '}
              on auction{' '}
              <Text as="span" fontWeight="bold">
                {hexToString(auction.name)}
              </Text>
              . We&apos;ll transfer your funds to an escrow. If somebody places
              higher bid, you get the funds back automatically.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={submit}
              disabled={state.fetching}
              isLoading={state.fetching}
            >
              Bid
            </Button>
            <TxButton
              accountPair={accountPair}
              label="Bid"
              type={TxButtonType.SIGNEDTX}
              setStatus={setStatus}
              attrs={{
                palletRpc: 'auctions',
                callable: 'bidValue',
                // To-do: swap 0 for auction.Id
                inputParams: [0, bidValue],
                paramFields: [false, false],
              }}
            />
            <Text>{status}</Text>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default BidModal;
