import React from 'react';
import { render } from 'react-dom';
import { Link, HashRouter, BrowserRouter, Route, NavLink, Switch } from 'react-router-dom';
import PageA from './view/PageA';
import PageB from './view/PageB';
import PageC from './view/PageC';
import styles from './app.css'
const leftNav = () => {
  return (
    <nav>
      <ul className={styles.navUl}>
        <li><NavLink activeStyle={{ color: 'blue' }} to="/pageA">pageA</NavLink></li>
        <li><NavLink activeStyle={{ color: 'blue' }} to="/pageB">pageB</NavLink></li>
        <li><NavLink activeStyle={{ color: 'blue' }} to="/pageC">pageC</NavLink></li>
      </ul>
    </nav>
  )
};
class App extends React.Component {
  render() {
    return (
      <HashRouter>
        <Route render={({ location }) => (
          <div>
            <div>
              {leftNav()}
              <hr/>
            </div>
            <div>
              <div key={location.pathname}
                style={{background: 'lightblue'}}>
                <Switch key={location.key} location={location}>
                  <Route exact path="/" component={PageA} />
                  <Route exact path="/pageA" component={PageA} />
                  <Route exact path="/pageB" component={PageB} />
                  <Route exact path="/pageC" component={PageC} />
                </Switch>
              </div>
            </div>
          </div>
        )} />
      </HashRouter>
    )
  }
};

render(<App/>, document.getElementById('app'))

