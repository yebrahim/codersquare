import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { ListPosts } from './pages/list-posts';
import { ViewPost } from './pages/view-post';

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListPosts />} />
        <Route path="/p/:id" element={<ViewPost />} />
      </Routes>
    </BrowserRouter>
  );
};
