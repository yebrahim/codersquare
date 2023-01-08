import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import mixpanel from 'mixpanel-browser';
import React from 'react';
import ReactDOM from 'react-dom/client';

import { App } from './App';
import { queryClient } from './fetch';
import './index.css';
import { theme } from './theme';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
mixpanel.init('2fd452cb471cdb39e90abc14bdcc3257');

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
