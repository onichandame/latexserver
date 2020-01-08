import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './Home'
import New from './New'

function App() {
  return (
				<Router>
      <div>
								<nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/new">New</Link>
            </li>
          </ul>
        </nav>
										<Switch>
          <Route path="/new">
            <New />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
				</Router>
  );
}

export default App;
