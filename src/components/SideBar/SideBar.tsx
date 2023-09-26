import React, { useEffect} from 'react'
import "./SideBar.css"
import ClayButton from '@clayui/button';
import ClayLink from "@clayui/link";
import ClayNavigationBar from "@clayui/navigation-bar";
import  {useHistory}  from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveLink } from './../sidebarSlice'; 

export default function SideBar() {
    const history = useHistory();
    
    const active = useSelector((state:any) => state.sidebar.active); 
    const dispatch = useDispatch();
    const handleLinkClick = (value:any) => {
        if(value==="1"){
            history.push("/dashboard/project-details");
        }
        else if(value==="3"){
            history.push("/dashboard/create-project");
        }else if(value==="2"){
            history.push("/dashboard/create-issue");
        }

        dispatch(setActiveLink(value));
    };
    // useEffect(() => {
    //   const winactive=window.location.href().split("/")[2];
    //   console.log('winactive', winactive)
    // //   if(winactive==="create-issue"){
    // //     setActive("2");
    // //   }else if(winactive==="create-project"){
    // //     setActive("3");
    // //   }
    // //   else if(winactive==="project-details"){
    // //     setActive("1");
    // //   }
    // //   else{
    // //     setActive("0");
    // //   }
    
      
    // }, [])
    useEffect(() => {
      
        handleLinkClick(active);
    }, [active])
    
    
  
    return (
        <div className='sidebardiv'>
            <img className='sidebarimg' src='/Icon.png' alt='logo' />
            {/* <section className='sidebarul'>
                <span><aside active className='sidebarhr sidebaractive'></aside><ClayButton className='sidebarbtn sidebaractive'>Project Board</ClayButton></span>
                <span><aside className='sidebarhr'></aside><ClayButton className='sidebarbtn'>Create Issue</ClayButton></span>
                <span><aside className='sidebarhr'></aside><ClayButton className='sidebarbtn'>Create Issue</ClayButton></span>
            </section> */}
           
                <ClayNavigationBar className="sidebarul " triggerLabel="Links">
                    <ClayNavigationBar.Item className='' active={active === "1"}>
                        <ClayLink
                            //  href="/dashboard/project-details"
                            className='sidebarbtn'
                            onClick={(event) =>{event.preventDefault(); handleLinkClick("1");}}>
                            PROJECT BOARD
                        </ClayLink>
                    </ClayNavigationBar.Item>

                    <ClayNavigationBar.Item  className=''  active={active === "2"}>
                        <ClayLink
                            // href="/dashboard/create-issue" 
                            className='sidebarbtn'
                            onClick={(event) =>
                             {
                                event.preventDefault();
                                handleLinkClick("2");
                                }} >
                            CREATE ISSUES
                        </ClayLink>
                    </ClayNavigationBar.Item>
                    <ClayNavigationBar.Item  className=''  active={active === "3"}>
                        <ClayLink //   href="/dashboard/create-project"
                            className='sidebarbtn'
                            onClick={(event) => {event.preventDefault();handleLinkClick("3");}}
                        >
                            CREATE PROJECT
                        </ClayLink>
                    </ClayNavigationBar.Item>
                </ClayNavigationBar>
          


            <ClayButton className='sidebarbtn2'>    <img src='/translate.png' alt='' /> Language</ClayButton>
        </div>
    )
}
