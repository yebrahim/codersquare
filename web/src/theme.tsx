import { extendTheme, withDefaultColorScheme } from '@chakra-ui/react';

export const theme = extendTheme(
  {
    colors: {
      brand: {
        50: '#e4d2cc',
        100: '#d9bdb4',
        200: '#c9a093',
        300: '#c08472',
        400: '#a95b43',
        500: '#92462f',
        600: '#85361d',
        700: '#6d230c',
        800: '#4c1707',
        900: '#310c01',
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'brand' })
);
