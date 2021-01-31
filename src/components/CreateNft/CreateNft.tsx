import React from 'react';

import axios from 'axios';

import {
  Text,
  Button,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Stack,
  Image,
  HStack,
  useToast,
  Select,
} from '@chakra-ui/react';

import { stringToHex } from '@polkadot/util';
import { useSubstrate } from '@/substrate-lib';

// Components
import { TxButton } from '../../substrate-lib/components';

// Types
import { TxButtonType } from '../../substrate-lib/components/txButton.types';
import { CreateNftProps } from './CreateNft.types';

export const CreateNft = ({
  isOpen,
  onClose,
  accountPair,
}: CreateNftProps): JSX.Element => {
  const { api } = useSubstrate();

  const initialRef = React.useRef();

  const toast = useToast();

  const [classes, setClasses] = React.useState();

  const [state, setState] = React.useState({
    classMetadata: '',
    classData: '',
    mintClassId: 0,
    mintMetadata: null,
    mintTokenData: { locked: false },
  });

  type FieldNames = {
    classMetadata: string;
    classData: string;
    mintClassId: number;
    mintMetadata: Record<string, unknown>;
    mintTokenData: Record<string, unknown>;
  };

  const handleChange = (fieldName: keyof FieldNames) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => setState({ ...state, [fieldName]: e.target.value });

  const onSuccess = () => {
    onClose();
  };

  // IPFS NFT image

  const [selectedFile, setSelectedFile] = React.useState();
  const [isFilePicked, setIsFilePicked] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const imageSrc = selectedFile && URL.createObjectURL(selectedFile);

  const cancelImage = () => {
    setSelectedFile(null);
    setIsFilePicked(false);
  };

  const changeHandler = (event) => {
    setSelectedFile(event.target.files[0]);
    setIsFilePicked(true);
  };

  const onUpload = (file) => {
    setIsLoading(true);
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();

    // Update the formData object
    data.append('file', file);

    return axios
      .post(url, data, {
        maxContentLength: 'Infinity', //this is needed to prevent axios from erroring out with large files
        headers: {
          'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
          pinata_api_key: process.env.GATSBY_API_KEY,
          pinata_secret_api_key: process.env.GATSBY_SECRET_API_KEY,
        },
      })
      .then(function ({ data }) {
        setState({
          ...state,
          ['mintMetadata']: data.IpfsHash,
        });
        toast({
          title: 'Image successfully uploaded',
          status: 'success',
        });
      })
      .catch(function (error) {
        console.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  // Transaction status
  const [classStatus, setClassStatus] = React.useState<string>('');
  const [mintStatus, setMintStatus] = React.useState<string>('');

  React.useEffect(() => {
    let unsub = null;

    const getClasses = async () => {
      unsub = await api.query.ormlNft.classes.entries();
      setClasses(unsub);
    };

    getClasses();

    return () => unsub && unsub;
  }, [api, setClasses]);

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Stack spacing={4}>
              <FormLabel>Image</FormLabel>
              {isFilePicked ? (
                <Box>
                  <Image src={imageSrc} maxH="200px" />
                  <HStack spacing={3} align="center" mt="4">
                    <Button
                      loadingText="Uploading..."
                      isLoading={isLoading}
                      disabled={isLoading}
                      onClick={() => onUpload(selectedFile)}
                    >
                      Upload to IPFS
                    </Button>
                    <Button variant="link" onClick={cancelImage}>
                      Cancel
                    </Button>
                  </HStack>
                </Box>
              ) : (
                <Input type="file" onChange={changeHandler} size="lg" />
              )}

              <FormLabel>Class ID</FormLabel>
              <Select
                value={state.mintClassId}
                onChange={handleChange('mintClassId')}
                size="lg"
              >
                <option value="0">0</option>;<option value="1">1</option>;
                <option value="2">2</option>;<option value="3">3</option>;
                {/* {classes &&
                        classes.map((_, index) => {
                          <option value={index}>Option {index}</option>;
                        })} */}
              </Select>

              {/* <FormLabel>Metadata</FormLabel>
                    <Input
                      value={JSON.stringify(state.mintMetadata, null, 2)}
                      onChange={handleChange('mintMetadata')}
                      size="lg"
                    /> */}

              {/* <FormLabel>Token Data</FormLabel>
                    <Input
                      value={JSON.stringify(state.mintTokenData)}
                      onChange={handleChange('mintTokenData')}
                      size="lg"
                      type="number"
                      min="0"
                    /> */}

              <TxButton
                accountPair={accountPair}
                label="Mint NFT"
                type={TxButtonType.SIGNEDTX}
                setStatus={setMintStatus}
                onSuccess={onSuccess}
                attrs={{
                  palletRpc: 'nft',
                  callable: 'mint',
                  inputParams: [
                    state.mintClassId,
                    state.mintMetadata &&
                      stringToHex(
                        `{'image': 'https://ipfs.io/ipfs/${state.mintMetadata}'}`,
                      ),
                    state.mintTokenData,
                  ],
                  paramFields: [false, false, false],
                }}
              />
              <Box>
                <Text>{mintStatus}</Text>
              </Box>
            </Stack>
            {/* <Tabs isLazy>
              <TabList>
                <Tab>1. Create NFT class</Tab>
                <Tab>2. Mint NFT token</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    <FormLabel>Metadata</FormLabel>
                    <Input
                      value={state.classMetadata}
                      onChange={handleChange('classMetadata')}
                      size="lg"
                      ref={initialRef}
                    />

                    <FormLabel>Data</FormLabel>
                    <Input
                      value={state.classData}
                      onChange={handleChange('classData')}
                      size="lg"
                    />

                    <TxButton
                      accountPair={accountPair}
                      label="Create NFT class"
                      type={TxButtonType.SIGNEDTX}
                      setStatus={setClassStatus}
                      attrs={{
                        palletRpc: 'nft',
                        callable: 'createClass',
                        inputParams: [state.classMetadata, state.classData],
                        paramFields: [false, true],
                      }}
                    />
                    <Box>
                      <Text>{classStatus}</Text>
                    </Box>
                  </Stack>
                </TabPanel>
                <TabPanel>
                  
                </TabPanel>
              </TabPanels>
            </Tabs> */}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateNft;
