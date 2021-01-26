/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import HomePage from 'containers/HomePage/Loadable';

export default function App() {

  return (
    <React.Fragment>
      <Switch>
        <Route path="/" component={HomePage} />
      </Switch>
      <footer>
        <div className="text">Design and Developed by <a target="_blank" href="https://www.letscipher.com/">letscipher</a>
        </div>
      </footer>
    </React.Fragment>
  );
}
