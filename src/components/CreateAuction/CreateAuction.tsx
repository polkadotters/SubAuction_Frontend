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
  Stack,
  HStack,
} from '@chakra-ui/react';

// Components
import { TxButton } from '../../substrate-lib/components';

// Types
// import { Auction } from '@/@types/auction';
import { TxButtonType } from '../../substrate-lib/components/txButton.types';
import { CreateAuctionProps } from './CreateAuction.types';

// // Date manipulation
// import moment from 'moment';

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

  const [state, setState] = React.useState({
    title: '',
    price: null,
    start: null,
    end: null,
    type: 'English',
    tokenId: null,
    tokenClass: null,
  });

  type FieldNames = {
    title: string;
    price: number;
    start: number;
    end: number;
    type: string;
    tokenId: number;
    tokenClass: number;
  };

  const handleChange = (fieldName: keyof FieldNames) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => setState({ ...state, [fieldName]: e.target.value });

  // Transaction status
  const [status, setStatus] = React.useState(null);

  // const toast = useToast();

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
            <Stack spacing={4}>
              <FormControl id="title">
                <FormLabel>Title</FormLabel>
                <Input
                  onChange={handleChange('title')}
                  value={state.title}
                  size="lg"
                />
                <FormHelperText>Pick a name for your auction</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Start price</FormLabel>
                <InputGroup size="lg">
                  <InputLeftAddon>KSM</InputLeftAddon>
                  <NumberInput
                    placeholder="Enter start price"
                    size="lg"
                    min={0}
                  >
                    <NumberInputField
                      onChange={handleChange('price')}
                      value={state.price}
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
                <Input
                  value={state.start}
                  onChange={handleChange('start')}
                  size="lg"
                />
              </FormControl>
              <FormControl id="end">
                <FormLabel>End</FormLabel>
                <Input
                  value={state.end}
                  onChange={handleChange('end')}
                  size="lg"
                />
              </FormControl>

              <FormControl id="tokenClass">
                <FormLabel>Token class</FormLabel>
                <Input
                  value={state.tokenClass}
                  onChange={handleChange('tokenClass')}
                  size="lg"
                />
              </FormControl>
              <FormControl id="tokenId">
                <FormLabel>Token id</FormLabel>
                <Input
                  value={state.tokenId}
                  onChange={handleChange('tokenId')}
                  size="lg"
                />
              </FormControl>

              <Text fontSize="sm" mt={6}>
                You&apos;re about to create an auction for token ID{' '}
                {state.tokenId}, token class {state.tokenClass} with a starting
                price {state.price} KSM. Your auction starts at block{' '}
                {state.start} and ends at block {state.end}.
              </Text>
            </Stack>
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
            <HStack spacing={4}>
              <TxButton
                accountPair={accountPair}
                label="Create auction"
                type={TxButtonType.SIGNEDTX}
                setStatus={setStatus}
                attrs={{
                  palletRpc: 'auctions',
                  callable: 'createAuction',
                  inputParams: [
                    {
                      name: state.title,
                      last_bid: null,
                      start: state.start,
                      end: state.end,
                      auction_type: state.type,
                      token_id: [state.tokenClass, state.tokenId],
                      minimal_bid: state.price,
                    },
                  ],
                  paramFields: [false],
                }}
              />
              <Text>{status}</Text>
              <Button onClick={onClose}>Cancel</Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateAuction;
