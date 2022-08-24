import { Box } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { Navbar } from './components/navbar';
import { ListPosts } from './pages/list-posts';
import { NewPost } from './pages/new-post';
import { SignIn } from './pages/sign-in';
import { SignUp } from './pages/sign-up';
import { ViewPost } from './pages/view-post';
import { ROUTES } from './routes';

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />

        <Box m={4}>
          <Routes>
            <Route path={ROUTES.HOME} element={<ListPosts />} />
            <Route path={ROUTES.VIEW_POST(':id')} element={<ViewPost />} />
            <Route path={ROUTES.SIGN_IN} element={<SignIn />} />
            <Route path={ROUTES.SIGN_UP} element={<SignUp />} />
            <Route path={ROUTES.NEW_POST} element={<NewPost />} />
          </Routes>
        </Box>
      </BrowserRouter>
    </>
  );
};
