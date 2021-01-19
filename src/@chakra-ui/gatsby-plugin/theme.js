// 1. Import the extendTheme function
import { extendTheme } from '@chakra-ui/react';

// 2. Extend the theme to include custom colors, fonts, etc
const global = (props) => ({
  '*::placeholder': {
    color: props.colorMode === 'dark' ? 'gray.500' : 'whiteAlpha.400',
  },
});
const theme = extendTheme({ global });

export default theme;
