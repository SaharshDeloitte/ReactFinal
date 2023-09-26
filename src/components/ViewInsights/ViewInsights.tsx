import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import './ViewInsights.css'
// import { toast } from 'react-toastify';
import ClayLoadingIndicator from '@clayui/loading-indicator';

interface Project {
    projectID: string;
    projectName: string;
    projectStartDate: string;
    projectEndDate: string;
    projectOwner: {
      id: number;
      name: string;
      email: string;
      teamName: string;
      desination: string;
    };
  }
  interface total{
    value?: number|undefined;
    todo?: number|undefined;
    dev?: number|undefined;
    test?: number|undefined;
    complete?:number|undefined;
  }
  
export default function ViewInsights() {
    const { projectId } = useParams();
    const [projects, setProjects] = useState<Project[]>([]);
    const [curprojects, setcurProjects] = useState<Project>(); 
    const [issues, setIssues] = useState([]);
    const [total, settotal] = useState<total>(); 
    const [data, setdata] = useState(false)
      // Fetch projects and set them in the projects state
      // let data=false;
  useEffect( () => {
    fetchDataissue();

    
  
  }, [projectId]);
  useEffect( () => {
    
    fetchData();
   

  }, [projectId]);
  useEffect( () => {
    
    getIssues();
    findproject();
   

  }, [data]);


const getIssues = ()=>{

// Find the total number of issues
const totalIssues = issues.length;
console.log(totalIssues);
console.log('issues', issues);
const temp={...total};
// Find the total number of issues with status 1, 2, 3, or 4
const totalIssuesWithStatus1 = issues.filter((issue1:any) => issue1.status === 1).length;
const totalIssuesWithStatus2 = issues.filter((issue1:any) => issue1.status === 2).length;
const totalIssuesWithStatus3 = issues.filter((issue1:any) => issue1.status === 3).length;
const totalIssuesWithStatus4 = issues.filter((issue1:any) => issue1.status === 4).length;
temp.value=totalIssues;
temp.todo=totalIssuesWithStatus1;
temp.dev=totalIssuesWithStatus2;
temp.test=totalIssuesWithStatus3;
temp.complete=totalIssuesWithStatus4;
settotal(temp);
console.log(temp);

}
const fetchData = async () => {

 await axios.get("https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/project", {
    headers: { userID: "1" },
  })
  .then((response) => {
    console.log("projects set")
    setProjects(response.data);

   
  })
  .catch((error) => {
    console.error("Error fetching projects:", error);
  });
findproject();

}
const findproject =()=>{
  const projectDetail = projects.find(
    (project) => project.projectID === projectId
    );
    console.log('projectDetails', projectDetail);
    setcurProjects(projectDetail);
}


const fetchDataissue = async () => {
  console.log('id', projectId);
  // if (curprojects) {
  await  axios
      .get(
        `https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/issue?projectID=${projectId}`,
        {
          headers: { userid: "1" },
        }
      )
      .then((response) => {
        setIssues(response.data);
        setTimeout( () => {
          setdata(true);
        },3000);
      })
      .catch((error) => {
        console.error("Error fetching issues:", error);
      });
     
  // }
  // else{
    // console.log("Error fetching issues");
  // }

}
  return (
    <div>
      {data?<></>:<ClayLoadingIndicator className="loginLoader" displayType="primary" shape="squares" size="lg" />}
        <p>Project Board / view Insights</p>
        <div className='VImain'>
            <div className='VIhead'>
                <h1>{curprojects?.projectName}</h1>
                <h3>Total Number of Issues: {total?.value}</h3>
            </div>
            <div className='VIdata'>
                <span ><h4>TO DO</h4><p style={{color:"yellow"}}>{total?.todo}</p></span>
                <span ><h4>Devlopment</h4><p style={{color:"orange"}}>{total?.dev}</p></span>
                <span ><h4>Testing</h4><p style={{color:"blue"}}>{total?.test}</p></span>
                <span ><h4>Completed</h4><p style={{color:"green"}}>{total?.complete}</p></span>
            </div>
            <div className="VIbar">
              
            </div>
        </div>
    </div>
  )
}

