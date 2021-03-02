/**
 *
 * Asynchronously loads the component for MainLoader
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
