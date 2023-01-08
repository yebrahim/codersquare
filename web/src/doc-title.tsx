import { ENDPOINT_CONFIGS, TrackRequest } from '@codersquare/shared';
import { useEffect } from 'react';

import { callEndpoint } from './fetch';
import { isDev } from './util';

export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = 'Codersquare | ' + title;
    if (!isDev) {
      callEndpoint<TrackRequest, unknown>(ENDPOINT_CONFIGS.track, {
        eventName: title,
      });
    }
  }, [title]);
};
