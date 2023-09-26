import React, { Component } from 'react';
import { withOktaAuth } from '@okta/okta-react';
import './Home.css';
import ClayButton from '@clayui/button';
import ClayLoadingIndicator from '@clayui/loading-indicator';

import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';



export default withOktaAuth(class Home extends Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isLoading: false, 
    };
  }

  async login() {

    this.setState({ isLoading: true }); 
    await this.props.oktaAuth.signInWithRedirect();
    setTimeout(() => {
  
      this.setState({ isLoading: false });
    }, 3000);
  }

  async logout() {
    this.setState({ isLoading: true }); 
    console.log("logout context called");
    await this.props.oktaAuth.signOut();

    setTimeout(() => {
     
      this.setState({ isLoading: false });
    }, 3000);

  }

  render() {
   

    if (this.state.isLoading) {
      
      return( <ClayLoadingIndicator className="loginLoader" displayType="primary" shape="squares" size="lg" />)
    } else if (this.props.authState?.isAuthenticated) {
      return (
        <Redirect to="/dashboard" />
            
          
       
      );
    } else {
      return (
        


          <div className="App">

            <div className="loginDiv">
              <div className="loginLeft">
                <img src="./../../Left_Nanigation.png" className="" alt="pic" /></div>

              <div className="loginRight">
                <div className="Buttons">
                  <ClayButton onClick={this.login}>Login</ClayButton>
                </div>
              </div>

            </div>

          </div>
       
      );

    }



  }
});
