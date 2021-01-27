import React from 'react';

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
    mintClassId: '',
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
  const [mintStatus, setMintStatus] = React.useState<Record<string, unknown>>(
    {},
  );

  return (
    <>
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create new NFT</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Tabs onChange={(index) => console.log(index)} isLazy>
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
                  <Stack spacing={4}>
                    <FormLabel>Class ID</FormLabel>
                    <Input
                      value={state.mintClassId}
                      onChange={handleChange('mintClassId')}
                      size="lg"
                      ref={initialRef}
                    />

                    <FormLabel>Metadata</FormLabel>
                    <Input
                      value={state.mintMetadata}
                      onChange={handleChange('mintMetadata')}
                      size="lg"
                    />

                    <FormLabel>Token Data</FormLabel>
                    <Input
                      value={state.mintTokenData}
                      onChange={handleChange('mintTokenData')}
                      size="lg"
                      type="number"
                      min="0"
                    />

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
                      <Text>
                        {JSON.stringify(mintStatus.dispatchError, null, 2)}
                      </Text>
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
