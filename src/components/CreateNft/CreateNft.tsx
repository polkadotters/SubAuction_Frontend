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
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Box,
  Stack,
} from '@chakra-ui/react';

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
  const initialRef = React.useRef();

  const [state, setState] = React.useState({
    classMetadata: '',
    classData: '',
    mintClassId: null,
    mintMetadata: '',
    mintTokenData: '',
  });

  type FieldNames = {
    classMetadata: string;
    classData: string;
    mintClassId: number;
    mintMetadata: string;
    mintTokenData: string;
  };

  const handleChange = (fieldName: keyof FieldNames) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => setState({ ...state, [fieldName]: e.target.value });

  // Transaction status
  const [classStatus, setClassStatus] = React.useState<string>('');
  const [mintStatus, setMintStatus] = React.useState<string>('');

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs>
              <TabList>
                <Tab>Create NFT class</Tab>
                <Tab>Mint NFT token</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Stack spacing={4}>
                    <FormControl id="classMetadata">
                      <FormLabel>Metadata</FormLabel>
                      <Input
                        value={state.classMetadata}
                        onChange={handleChange('classMetadata')}
                        size="lg"
                      />
                    </FormControl>
                    <FormControl id="classData">
                      <FormLabel>Data</FormLabel>
                      <Input
                        value={state.classData}
                        onChange={handleChange('classData')}
                        size="lg"
                      />
                    </FormControl>

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
                  <Stack spacing={4}>
                    <FormControl id="classId">
                      <FormLabel>Class ID</FormLabel>
                      <Input
                        value={state.mintClassId}
                        onChange={handleChange('mintClassId')}
                        size="lg"
                      />
                    </FormControl>
                    <FormControl id="mintMetadata">
                      <FormLabel>Metadata</FormLabel>
                      <Input
                        value={state.mintMetadata}
                        onChange={handleChange('mintMetadata')}
                        size="lg"
                      />
                    </FormControl>
                    <FormControl id="mintTokenData">
                      <FormLabel>Token ID</FormLabel>
                      <Input
                        value={state.mintTokenData}
                        onChange={handleChange('mintTokenData')}
                        size="lg"
                      />
                    </FormControl>

                    <TxButton
                      accountPair={accountPair}
                      label="Mint NFT"
                      type={TxButtonType.SIGNEDTX}
                      setStatus={setMintStatus}
                      attrs={{
                        palletRpc: 'nft',
                        callable: 'mint',
                        inputParams: [
                          state.mintClassId,
                          state.mintMetadata,
                          state.mintTokenData,
                        ],
                        paramFields: [false, false, false],
                      }}
                    />
                    <Box>
                      <Text>{mintStatus}</Text>
                    </Box>
                  </Stack>
                </TabPanel>
              </TabPanels>
            </Tabs>
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
