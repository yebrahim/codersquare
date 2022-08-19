import { Box } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Navbar } from './components/navbar';
import { ListPosts } from './pages/list-posts';
import { ViewPost } from './pages/view-post';

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Box m={4}>
          <Routes>
            <Route path="/" element={<ListPosts />} />
            <Route path="/p/:id" element={<ViewPost />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </>
  );
};
