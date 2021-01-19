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

  // Create class
  const [classMetadata, setClassMetadata] = React.useState<string>('');
  const onClassMetadataChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassMetadata(e.target.value);
  };

  const [classData, setClassData] = React.useState<string>('');
  const onClassDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClassData(e.target.value);
  };

  // Mint
  const [mintClassId, setMintClassId] = React.useState<number>(null);
  const onMintClassIdChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMintClassId(e.target.value);
  };

  const [mintMetadata, setMintMetadata] = React.useState<string>('');
  const onMintMetadataChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMintMetadata(e.target.value);
  };
  const [mintTokenData, setMintTokenData] = React.useState<string>('');
  const onMintTokenDataChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMintTokenData(e.target.value);
  };

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
                        value={classMetadata}
                        onChange={onClassMetadataChange}
                        size="lg"
                      />
                    </FormControl>
                    <FormControl id="classData">
                      <FormLabel>Data</FormLabel>
                      <Input
                        value={classData}
                        onChange={onClassDataChange}
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
                        inputParams: [classMetadata, classData],
                        paramFields: [true, true],
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
                        value={mintClassId}
                        onChange={onMintClassIdChange}
                        size="lg"
                      />
                    </FormControl>
                    <FormControl id="mintMetadata">
                      <FormLabel>Metadata</FormLabel>
                      <Input
                        value={mintMetadata}
                        onChange={onMintMetadataChange}
                        size="lg"
                      />
                    </FormControl>
                    <FormControl id="mintMetadata">
                      <FormLabel>Token ID</FormLabel>
                      <Input
                        value={mintTokenData}
                        onChange={onMintTokenDataChange}
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
                        inputParams: [mintClassId, mintMetadata, mintTokenData],
                        paramFields: [true, true, true],
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
