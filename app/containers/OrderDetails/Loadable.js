/**
 *
 * Asynchronously loads the component for OrderDetails
 *
 */

import loadable from 'loadable-components';

export default loadable(() => import('./index'));
