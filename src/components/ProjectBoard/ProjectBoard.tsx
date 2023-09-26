import React from "react";
import SideBar from './../SideBar/SideBar';
import Navbar from '../Navbar/Navbar';
import ProjectDetails from "../ProjectDetails/ProjectDetails";
import CreateIssue from "../CreateIssue/CreateIssue";
import CreateProject from "../CreateProject/CreateProject";
import {  Route, Switch } from 'react-router-dom';
import './ProjectBoard.css';
import IssueDetails from "../IssueDetails/IssueDetails";
import ViewInsights from "../ViewInsights/ViewInsights";


export default function ProjectBoard() {

 

  return (
    <div>
      <SideBar/>
     
        <Navbar/>
        <div className="mainContainer">


        <Switch>
          <Route path="/dashboard/project-details" component={ProjectDetails} />
          <Route path="/dashboard/create-issue" component={CreateIssue} />
          <Route path="/dashboard/create-project" component={CreateProject} />
          <Route path="/dashboard/issue-details/:issueId" component={IssueDetails} /> 
          <Route path="/dashboard/project-insights/:projectId" component={ViewInsights} /> 
        </Switch>
        </div>
    </div>

  )
}
