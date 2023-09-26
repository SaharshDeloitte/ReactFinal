
import React, { useState, useEffect } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { ClayInput } from "@clayui/form";
import ClayButton from '@clayui/button';
import DropDown from "@clayui/drop-down";
import "./Navbar.css";

import ClayLoadingIndicator from '@clayui/loading-indicator';



const Navbar = () => {

    const { authState, oktaAuth } = useOktaAuth();
   
    const [userName, setuserName] = useState("Name");
    const [isloading, setisLoading] = useState(false);

  const logout = async () => {

    setisLoading(true);
  
    // localStorage.removeItem('okta-token-storage');
    // localStorage.removeItem('okta-cache-storage');
    // localStorage.removeItem('okta-shared-transaction-storage');
    
    await oktaAuth.signOut();
    // oktaAuth.tokenManager.clear();
    localStorage.clear();
    setTimeout(() => {
       
        setisLoading(false);
      }, 3000);
  };


    
   
    useEffect(() => {
        if (!authState || !authState.isAuthenticated) {
            
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
    }, [authState, oktaAuth]);
    return (
        <>
            <div className="navbar-container">
                <div className="search">🔎
                    <ClayInput placeholder="Search" />

                </div>
               
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