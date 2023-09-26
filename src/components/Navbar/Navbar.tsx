
import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { ClayInput } from "@clayui/form";
import ClayButton from '@clayui/button';
import DropDown from "@clayui/drop-down";
import "./Navbar.css";
// import { useLogout } from './../Home';
// import { useAuth } from './../AuthContext';
import ClayLoadingIndicator from '@clayui/loading-indicator';



const Navbar = () => {

    const { authState, oktaAuth } = useOktaAuth();
   
    const [userName, setuserName] = useState("Name");
    const [isloading, setisLoading] = useState(false);

  const logout = async () => {

    setisLoading(true);
    // Will redirect to Okta to end the session then redirect back to the configured `postLogoutRedirectUri`
    // localStorage.removeItem('okta-token-storage');
    // localStorage.removeItem('okta-cache-storage');
    // localStorage.removeItem('okta-shared-transaction-storage');
    
    await oktaAuth.signOut();
    // oktaAuth.tokenManager.clear();
    // localStorage.clear();
    setTimeout(() => {
        // After 3 seconds, initiate the Okta login redirect
  
  
        // Set isLoading back to false to hide the loader
        setisLoading(false);
      }, 3000);
  };


    
   
    useEffect(() => {
        if (!authState || !authState.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            //   setUserInfo(null);
        } else {


            // if (authState.idToken.claims) {
            //   setUserInfo(authState.idToken.claims);
            //   console.log('authState.idToken.claims', authState.idToken.claims)
            // }
            // You can also get user information from the `/userinfo` endpoint
            oktaAuth.getUser().then((info) => {
                if (info) {
                    console.log('info', info)
                    // setUserInfo(info);
                    setuserName(info.name ?? 'Name');

                }
                //   console.log('userInfo', userInfo)
            });


        }
    }, [authState, oktaAuth]); // Update if authState changes
    return (
        <>
            <div className="navbar-container">
                <div className="search">🔎
                    <ClayInput placeholder="Search" />

                </div>
                {/* <ClayButton onClick={props.logout}>Logout</ClayButton> */}
                <div className="user">



                    <DropDown
                        trigger={
                            <span className='userid'>
                                <h5>{userName}</h5>
                                <img className="navimg"
                                    src="https://static.vecteezy.com/system/resources/previews/000/380/945/original/edit-profile-vector-icon.jpg"
                                    alt="img" />
                            </span>
                        }>
                        <DropDown.Item>
                            <ClayButton onClick={logout}>Logout</ClayButton>
                        </DropDown.Item>
                    </DropDown>
                </div>

            </div>
                        {isloading?
                                <ClayLoadingIndicator className="loginLoadernav" displayType="primary" shape="squares" size="lg" />:<></>
                        }
          
        </>
    );
};

export default Navbar;