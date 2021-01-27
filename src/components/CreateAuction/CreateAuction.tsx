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
  Input,
  Stack,
  HStack,
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react';

// Components
import { TxButton } from '../../substrate-lib/components';
import Radio from './Form/Radio';

// Types
// import { Auction } from '@/@types/auction';
import { TxButtonType } from '../../substrate-lib/components/txButton.types';
import { CreateAuctionProps } from './CreateAuction.types';
import { nftList } from '@/utils/nft';

// // Date manipulation
// import moment from 'moment';

export const CreateAuction = ({
  isOpen,
  onClose,
  accountPair,
}: CreateAuctionProps): JSX.Element => {
  const initialRef = React.useRef();

  // const [startAt, setStartAt] = React.useState(moment().add(30, 'minutes'));
  // const [endAt, setEndAt] = React.useState(moment().add(7, 'days'));

  // const [state, executeMutation] = useMutation(AUCTION_MUTATION);

  const options = nftList.map((i) => i[0][1].join('-'));

  const [state, setState] = React.useState({
    title: '',
    price: 0,
    start: null,
    end: null,
    type: 'English',
    token: options[0] || '',
  });

  const [tokenClass, tokenId] = state.token && state.token.split('-');

  type FieldNames = {
    title: string;
    price: number;
    start: number;
    end: number;
    type: string;
    token: string;
  };

  const handleChange = (fieldName: keyof FieldNames) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void =>
    fieldName === 'price'
      ? setState({ ...state, [fieldName]: e })
      : setState({ ...state, [fieldName]: e.target.value });

  const handleToken = (token): void => setState({ ...state, ['token']: token });

  // Transaction status
  const [status, setStatus] = React.useState(null);

  // Form steps
  const [tabIndex, setTabIndex] = React.useState(0);

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const validation = [
    state.token,
    state.title,
    state.price,
    state.start && state.end,
  ];

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new auction</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <Progress value={tabIndex} max={4} size="sm" />
              <Tabs index={tabIndex} onChange={handleTabsChange}>
                <TabList color="gray.300">
                  <Tab fontSize="2xl">NFT</Tab>
                  <Tab fontSize="2xl">Title</Tab>
                  <Tab fontSize="2xl">Price</Tab>
                  <Tab fontSize="2xl">Duration</Tab>
                  <Tab fontSize="2xl">Summary</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <FormLabel fontSize="lg">What are you selling?</FormLabel>
                    <Radio options={options} handleChange={handleToken} />
                  </TabPanel>
                  <TabPanel>
                    <FormControl id="email">
                      <FormLabel>Pick a name for your auction</FormLabel>
                      <Input
                        onChange={handleChange('title')}
                        value={state.title}
                        size="lg"
                      />
                    </FormControl>
                  </TabPanel>
                  <TabPanel>
                    <FormLabel fontSize="lg">Set a starting price</FormLabel>
                    <InputGroup size="lg">
                      <InputLeftAddon>KSM</InputLeftAddon>
                      <NumberInput
                        placeholder="Enter start price"
                        size="lg"
                        min={0}
                        defaultValue={state.price}
                        onChange={handleChange('price')}
                        value={state.price}
                        maxW={32}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </InputGroup>
                  </TabPanel>
                  <TabPanel>
                    <FormControl id="start">
                      <FormLabel fontSize="lg">
                        Set the start block for auction
                      </FormLabel>
                      <Input
                        value={state.start}
                        onChange={handleChange('start')}
                        size="lg"
                      />
                    </FormControl>
                    <FormControl id="end" mt={4}>
                      <FormLabel fontSize="lg">
                        Set the end block for auction
                      </FormLabel>
                      <Input
                        value={state.end}
                        onChange={handleChange('end')}
                        size="lg"
                      />
                    </FormControl>
                  </TabPanel>
                  <TabPanel>
                    <Text fontSize="lg" mt={6}>
                      You&apos;re about to create an auction{' '}
                      <Text as="span" fontWeight="bold">
                        {state.title}
                      </Text>{' '}
                      for token{' '}
                      <Text as="span" fontWeight="bold">
                        (ID: {tokenId}, class: {tokenClass})
                      </Text>
                      , with a starting price{' '}
                      <Text as="span" fontWeight="bold">
                        {state.price} KSM
                      </Text>
                      . Your auction starts at{' '}
                      <Text as="span" fontWeight="bold">
                        block {state.start}
                      </Text>{' '}
                      and ends at{' '}
                      <Text as="span" fontWeight="bold">
                        block {state.end}
                      </Text>
                      .
                    </Text>
                  </TabPanel>
                </TabPanels>
              </Tabs>

              {/* <FormControl id="tokenClass">
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
              </FormControl> */}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={4}>
              {tabIndex !== 0 && (
                <Button onClick={() => setTabIndex(tabIndex - 1)}>Back</Button>
              )}
              {tabIndex !== 4 ? (
                <Button
                  colorScheme="blue"
                  onClick={() => setTabIndex(tabIndex + 1)}
                  isDisabled={!validation[tabIndex]}
                >
                  Next
                </Button>
              ) : (
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
                        token_id: [tokenClass, tokenId],
                        minimal_bid: state.price,
                      },
                    ],
                    paramFields: [false],
                  }}
                />
              )}
            </HStack>
            {/* <Text>{status}</Text> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateAuction;
