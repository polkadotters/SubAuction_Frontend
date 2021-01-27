import React from 'react';

import { Box, HStack, useRadio, useRadioGroup } from '@chakra-ui/react';

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
  options: any[];
  handleChange: void;
}

// Step 2: Use the `useRadioGroup` hook to control a group of custom radios.
function Example({ options, handleChange }: ExampleProps): JSX.Element {
  const optionList = options ? options : ['react', 'vue', 'svelte'];

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'NFT',
    defaultValue: options ? options[0] : 'react',
    onChange: (e) => {
      handleChange(e);
    },
  });

  const group = getRootProps();

  return (
    <HStack {...group}>
      {optionList.map((value) => {
        const radio = getRadioProps({ value });
        const [classId, tokenId] = value.split('-');
        return (
          <RadioCard key={value} {...radio}>
            Class: {classId}, TokenId: {tokenId}
          </RadioCard>
        );
      })}
    </HStack>
  );
}

export default Example;
