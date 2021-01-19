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
  Input,
  FormHelperText,
} from '@chakra-ui/react';

// Components
import { TxButton } from '../../substrate-lib/components';

// Graphql connection
import gql from 'graphql-tag';
import { useMutation } from 'urql';

// Types
import { Auction } from '@/@types/auction';
import { TxButtonType } from '../../substrate-lib/components/txButton.types';
import { CreateAuctionProps } from './CreateAuction.types';

// Date manipulation
import moment from 'moment';

// const AUCTION_MUTATION = gql`
//   mutation NewAuction(
//     $type: String!
//     $startAt: DateTime!
//     $endAt: DateTime!
//     $startPrice: Float!
//   ) {
//     createAuction(
//       type: $type
//       startAt: $startAt
//       endAt: $endAt
//       startPrice: $startPrice
//     ) {
//       id
//     }
//   }
// `;

export const CreateAuction = ({
  isOpen,
  onClose,
  accountPair,
}: CreateAuctionProps): JSX.Element => {
  const initialRef = React.useRef();

  // const [startAt, setStartAt] = React.useState(moment().add(30, 'minutes'));
  // const [endAt, setEndAt] = React.useState(moment().add(7, 'days'));

  // const [state, executeMutation] = useMutation(AUCTION_MUTATION);

  // Title
  const [title, setTitle] = React.useState<string>('');
  const onTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Start price
  const [price, setPrice] = React.useState<number>(0);
  const onPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrice(e.target.value);
  };

  // Time
  const [start, setStart] = React.useState<number>(0);
  const onStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStart(e.target.value);
  };
  const [end, setEnd] = React.useState<number>(0);
  const onEndChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEnd(e.target.value);
  };

  // Token
  const [tokenClass, setTokenClass] = React.useState<number>(0);
  const onTokenClassChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTokenClass(e.target.value);
  };
  const [tokenId, setTokenId] = React.useState<number>(0);
  const onTokenIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTokenId(e.target.value);
  };

  // Transaction status
  const [status, setStatus] = React.useState(null);

  const toast = useToast();

  // const submit = React.useCallback(() => {
  //   executeMutation({ type, startAt, endAt, startPrice }).then((data) => {
  //     console.log(data);
  //     if (data.error) {
  //       toast({
  //         title: 'Oh, something went wrong.',
  //         description: data.error.message,
  //         status: 'error',
  //         isClosable: true,
  //       });
  //     }
  //   });
  // }, [executeMutation, type, startAt, endAt, startPrice]);

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new auction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl id="title">
              <FormLabel>Title</FormLabel>
              <Input onChange={onTitleChange} value={title} size="lg" />
              <FormHelperText>Pick a name for your auction</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Start price</FormLabel>
              <InputGroup size="lg">
                <InputLeftAddon>KSM</InputLeftAddon>
                <NumberInput placeholder="Enter start price" size="lg" min={0}>
                  <NumberInputField
                    onChange={onPriceChange}
                    value={price}
                    ref={initialRef}
                  />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </InputGroup>
            </FormControl>

            <FormControl id="start">
              <FormLabel>Start</FormLabel>
              <Input value={start} onChange={onStartChange} size="lg" />
            </FormControl>
            <FormControl id="end">
              <FormLabel>End</FormLabel>
              <Input value={end} onChange={onEndChange} size="lg" />
            </FormControl>

            <FormControl id="tokenClass">
              <FormLabel>Token class</FormLabel>
              <Input
                value={tokenClass}
                onChange={onTokenClassChange}
                size="lg"
              />
            </FormControl>
            <FormControl id="tokenId">
              <FormLabel>Token id</FormLabel>
              <Input value={tokenId} onChange={onTokenIdChange} size="lg" />
            </FormControl>

            <Text fontSize="sm" mt={6}>
              You&apos;re about to create an auction for token ID {tokenId},
              token class {tokenClass} with a starting price {price} KSM. Your
              auction starts at block {start} and ends at block {end}.
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
              Create auction
            </Button> */}
            <TxButton
              accountPair={accountPair}
              label="Create auction"
              type={TxButtonType.SIGNEDTX}
              setStatus={setStatus}
              attrs={{
                palletRpc: 'auctions',
                callable: 'createAuction',
                inputParams: {
                  name: title,
                  start: start,
                  end: end,
                  auction_type: 'English',
                  tokenClass,
                  tokenId,
                  minimal_bid: price,
                },
                paramFields: [true],
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
export default CreateAuction;
