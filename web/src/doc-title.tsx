import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = 'Codersquare | ' + title;
  }, [title]);
};
