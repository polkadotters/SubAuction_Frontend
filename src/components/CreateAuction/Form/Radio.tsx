import React from 'react';

import {
  Box,
  Grid,
  HStack,
  Image,
  Tooltip,
  useRadio,
  useRadioGroup,
} from '@chakra-ui/react';
import { hexToString } from '@polkadot/util';

// 1. Create a component that consumes the `useRadio` hook
function RadioCard(props: { children: React.ReactNode }): JSX.Element {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="md"
        _checked={{
          bg: 'blue.500',
          color: 'white',
          borderColor: 'blue.500',
        }}
        _focus={{
          boxShadow: 'outline',
        }}
        px={5}
        py={3}
      >
        {props.children}
      </Box>
    </Box>
  );
}

interface ExampleProps {
  tokens: any[];
  handleChange: void;
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function Example({ tokens, handleChange }: ExampleProps): JSX.Element {
  const options = tokens.map((i) => i[0].toHuman().join('-'));

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'NFT',
    defaultValue: null,
    onChange: (e) => {
      handleChange(e);
    },
  });

  const group = getRootProps();

  return (
    <Grid
      templateColumns="repeat(auto-fill, minmax(min(4rem, 100%), 1fr))"
      gap={6}
      {...group}
    >
      {tokens.map((token, index) => {
        const value = token[0].toHuman().join('-');
        const radio = getRadioProps({ value });
        const [classId, tokenId] = value.split('-');
        const metadata = token[1].toHuman().metadata;
        // const hash = token[1].toHuman().metadata;
        const imgSrc = JSON.parse(metadata.replace(/'/g, '"')).image || '';

        return (
          <Box key={index}>
            <RadioCard key={value} {...radio}></RadioCard>
            <Tooltip label={`Class: ${classId}, TokenId: ${tokenId}`}>
              <Image
                src={imgSrc}
                fallbackSrc="https://via.placeholder.com/150"
              />
            </Tooltip>
          </Box>
        );
      })}
    </Grid>
  );
}

export default React.memo(Example);
