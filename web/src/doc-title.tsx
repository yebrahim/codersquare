import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = 'Codersquare | ' + title;
    mixpanel.track(title);
  }, [title]);
};
