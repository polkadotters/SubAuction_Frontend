import React from 'react';
import { navigate } from 'gatsby';

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
  Grid,
} from '@chakra-ui/react';

import moment from 'moment';

import { useSubstrate } from '@/substrate-lib';

// Components
import { TxButton } from '../../substrate-lib/components';
import Radio from './Form/Radio';

// Types
// import { Auction } from '@/@types/auction';
import { TxButtonType } from '../../substrate-lib/components/txButton.types';
import { CreateAuctionProps } from './CreateAuction.types';
import DatePicker from './Datepicker/Datepicker';

// // Date manipulation
// import moment from 'moment';

export const CreateAuction = ({
  isOpen,
  onClose,
  accountPair,
}: CreateAuctionProps): JSX.Element => {
  const { api } = useSubstrate();

  const initialRef = React.useRef();

  // const [startAt, setStartAt] = React.useState(moment().add(30, 'minutes'));
  // const [endAt, setEndAt] = React.useState(moment().add(7, 'days'));

  // const [state, executeMutation] = useMutation(AUCTION_MUTATION);

  const [status, setStatus] = React.useState(null);
  const [tabIndex, setTabIndex] = React.useState(0);
  const [tokens, setTokens] = React.useState([]);
  const [blockNumber, setBlockNumber] = React.useState(0);
  const [numberTimer, setNumberTimer] = React.useState(0);

  // const timer = () => {
  //   setNumberTimer((time) => time + 1);
  // };

  // React.useEffect(() => {
  //   const id = setInterval(timer, 3000);
  //   return () => clearInterval(id);
  // }, []);

  const bestNumber = api.derive.chain.bestNumberFinalized;

  React.useEffect(() => {
    let unsubscribeAll = null;

    bestNumber((number) => {
      setBlockNumber(number.toNumber());
    })
      .then((unsub) => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber]);

  const [state, setState] = React.useState({
    title: '',
    price: 0,
    start: null,
    end: null,
    type: 'English',
    token: '',
  });

  const reset = () =>
    setState({
      title: '',
      price: 0,
      start: null,
      end: null,
      type: 'English',
      token: '',
    });

  const onSuccess = () => {
    onClose();
    reset();
  };

  const [tokenClass, tokenId] = state.token && state.token.split('-');

  type FieldNames = {
    title: string;
    price: number;
    start: number;
    end: number;
    startDate: Date;
    endDate: Date;
    type: string;
    token: string;
  };

  const handleChange = (fieldName: keyof FieldNames) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    if (fieldName === 'price') {
      setState({ ...state, [fieldName]: e });
    } else {
      setState({ ...state, [fieldName]: e.target.value });
    }
  };

  const handleToken = (token): void => setState({ ...state, ['token']: token });

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  const validation = [
    state.token,
    state.title,
    state.price,
    state.start && state.end,
  ];

  React.useEffect(() => {
    let unsub = null;

    const getTokensByOwner = async (owner) => {
      unsub = await api.query.ormlNft.tokens.entries();
      const ownerTokens = unsub.filter(
        (token) => token[1].toHuman().owner === owner,
      );
      setTokens(ownerTokens);
    };

    accountPair && getTokensByOwner(accountPair.address);

    return () => unsub && unsub;
  }, [api, accountPair, setTokens]);

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        motionPreset="scale"
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

                    <Radio tokens={tokens} handleChange={handleToken} />
                  </TabPanel>
                  <TabPanel>
                    <FormControl id="email">
                      <FormLabel fontSize="lg">
                        Pick a name for your auction
                      </FormLabel>
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
                      <InputLeftAddon>SUB</InputLeftAddon>
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
                      {/* <Input
                        value={state.startDate}
                        onBlur={handleChange('startDate')}
                        size="lg"
                      /> */}
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
                        {state.price} SUB
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
                  onSuccess={onSuccess}
                  attrs={{
                    palletRpc: 'auctions',
                    callable: 'createAuction',
                    inputParams: [
                      {
                        name: state.title,
                        last_bid: null,
                        start: state.start,
                        end: state.end,
                        owner: accountPair.address,
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
