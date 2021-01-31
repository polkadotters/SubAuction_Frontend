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
} from '@chakra-ui/react';

// Types
import { TxButtonType } from '@/substrate-lib/components/txButton.types';
import { BidModalProps } from './BidModal.types';
import { TxButton } from '@/substrate-lib/components/TxButton';
import { hexToString } from '@polkadot/util';

export const BidModal = ({
  isOpen,
  onClose,
  auction,
  accountPair,
  id,
}: BidModalProps): JSX.Element => {
  const initialRef = React.useRef();

  const [state, setState] = React.useState({
    bid: auction.minimal_bid || 0,
  });

  type FieldNames = {
    bid: number;
  };

  const handleChange = (fieldName: keyof FieldNames) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => setState({ ...state, [fieldName]: e });

  const onSuccess = () => {
    onClose();
  };

  // Transaction status
  const [status, setStatus] = React.useState(null);

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
                <InputLeftAddon>SUB</InputLeftAddon>
                <NumberInput
                  placeholder="Enter your amount"
                  size="lg"
                  onChange={handleChange('bid')}
                  value={state.bid}
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
              Minimum bid is {auction.minimal_bid} SUB
            </Text>
            <Text fontSize="sm" mt={6}>
              You&apos;re about to place a bid of{' '}
              <Text as="span" fontWeight="bold">
                {state.bid} SUB
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
            {/* <Button
              colorScheme="blue"
              mr={3}
              onClick={submit}
              disabled={state.fetching}
              isLoading={state.fetching}
            >
              Bid
            </Button> */}
            <TxButton
              accountPair={accountPair}
              label="Bid"
              type={TxButtonType.SIGNEDTX}
              setStatus={setStatus}
              onSuccess={onSuccess}
              attrs={{
                palletRpc: 'auctions',
                callable: 'bidValue',
                // To-do: swap 0 for auction.Id
                inputParams: [id, state.bid],
                paramFields: [false, false],
              }}
            />
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default BidModal;
