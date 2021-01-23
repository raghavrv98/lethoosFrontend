/*
 * SamplePage Messages
 *
 * This contains all the text for the SamplePage container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.SamplePage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the SamplePage container!',
  },
});
