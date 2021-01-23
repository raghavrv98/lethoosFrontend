/**
 *
 * Asynchronously loads the component for SamplePage
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
