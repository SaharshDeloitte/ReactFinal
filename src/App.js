import React, { Component } from 'react';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
// import AuthProvider from './components/AuthContext';
import { LoginCallback, Security} from '@okta/okta-react';
import Home from './components/Home';
// import Profile from './components/Profile';
import ProjectBoard from './components/ProjectBoard/ProjectBoard';
import {  SecureRoute } from '@okta/okta-react';


const oktaAuth = new OktaAuth({
  issuer: 'https://dev-20176439.okta.com/oauth2/default',
  clientId: '0oabgjzts6AqrHhqZ5d7',
  redirectUri: window.location.origin + '/login/callback'
});

class App extends Component {

  constructor(props) {
    super(props);
    this.restoreOriginalUri = async (_oktaAuth, originalUri) => {
      props.history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
    };
  }

  render() {
    return (
      // <Provider store={store}>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={this.restoreOriginalUri}>
      <Route path="/" exact={true} component={Home}/>
      <Route path="/login/callback" component={LoginCallback}/>
      {/* <SecureRoute path="/profile" component={Profile}/> */}
      <SecureRoute path="/dashboard" component={ProjectBoard}/>

    </Security>
    // </Provider>
    
    );
  }
}

const AppWithRouterAccess = withRouter(App);

class RouterApp extends Component {
  render() {
    return (<Router> <AppWithRouterAccess/></Router>);
  }
}

export default RouterApp;




