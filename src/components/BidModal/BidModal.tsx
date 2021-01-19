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

// Graphql connection
import gql from 'graphql-tag';
import { useMutation } from 'urql';

// Types
import { Auction } from '@/@types/auction';

const BID_MUTATION = gql`
  mutation NewBid($auctionId: ID!, $price: Float!) {
    bid(auctionId: $auctionId, price: $price) {
      id
    }
  }
`;

type BidModalProps = {
  isOpen: boolean;
  onClose: () => void;
  price: number;
  auction: Auction;
};

export const BidModal = ({
  isOpen,
  onClose,
  price,
  auction,
}: BidModalProps): JSX.Element => {
  const initialRef = React.useRef();

  const [bidValue, setBidValue] = React.useState(Math.ceil(price * 1.1));

  const [state, executeMutation] = useMutation(BID_MUTATION);

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
                  min={Math.ceil(price * 1.1)}
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
              Minimum bid is {Math.ceil(price * 1.1)} KSM
            </Text>
            <Text fontSize="sm" mt={6}>
              You&apos;re about to place a bid on auction #{auction?.id}.
              We&apos;ll transfer your funds to an escrow. If somebody places
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
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default BidModal;
