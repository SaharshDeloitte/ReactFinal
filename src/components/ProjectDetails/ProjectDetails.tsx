import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProjectDetails.css";
import { useFormik } from "formik";
import ClayCard from "@clayui/card";
import { Link } from 'react-router-dom';



import ClayButton from '@clayui/button';
import {Project,Issue} from './../interface'


const ProjectDetails: React.FC = () => {
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);

  const [projectsCreated, setProjectsCreated] = useState(false);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<Project | null>(null);
  
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");


  
  const statusstr=["TO DO","DEVELOPMENT","TESTING","Completed"];
  const prioritystr=["LOW", "MEDIUM","HIGH" ]
  const priorityclr=["green", "yellow", "red"]


  const [statusColumns, setStatusColumns] = useState<Array<Issue[]>>([]);
  const [draggedCard, setDraggedCard] = useState<Issue | null>(null);

 
  useEffect(() => {
    axios
      .get("https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/project", {
        headers: { userID: "1" },
      })
      .then((response) => {
        setProjects(response.data);

        
        if (response.data.length === 0) {
          setProjectsCreated(false);
        } else {
          setProjectsCreated(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
  }, []);

  
  useEffect(() => {
    if (selectedProject) {
      axios
        .get(
          `https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/issue?projectID=${selectedProject}`,
          {
            headers: { userid: "1" },
          }
        )
        .then((response) => {
          setIssues(response.data);
        })
        .catch((error) => {
          console.error("Error fetching issues:", error);
        });
    }
  }, [selectedProject]);

 
  const formik = useFormik({
    initialValues: {
      selectedProject: "",
    },
    onSubmit: (values) => {
     
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

 
  useEffect(() => {
    let filtered = issues;
    if (priorityFilter) {
      filtered = filtered.filter(
        (issue) => issue.priority.toString() === priorityFilter
      );
    }

    if (assigneeFilter) {
      filtered = filtered.filter(
        (issue) => issue.assignee.name === assigneeFilter
      );
    }

    setFilteredIssues(filtered);

  }, [issues, priorityFilter, assigneeFilter]);



  useEffect(() => {
   
    let filteredAndSortedIssues = filteredIssues;
    filteredAndSortedIssues.sort((a, b) => a.status - b.status);

   
    const newStatusColumns: Array<Array<Issue>> = statusstr.map(() => []);
    
    
    filteredAndSortedIssues.forEach((issue) => {
      const statusIndex = issue.status - 1; 
      newStatusColumns[statusIndex].push(issue);
    });
   
    setStatusColumns(newStatusColumns);

  }, [filteredIssues]);

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectID = event.target.value;
    formik.setFieldValue("selectedProject", selectedProjectID);
    setSelectedProject(selectedProjectID);

   
    const projectDetail = projects.find(
      (project) => project.projectID === selectedProjectID
    );

    if (projectDetail) {
      setSelectedProjectDetails(projectDetail);
    } else {
      setSelectedProjectDetails(null);
    }
  };



const updateIssueStatus = (issueId: string, newStatus: number) => {
  axios
    .put(
      `https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/issue/${issueId}`,
      {
        status: newStatus,
      },
      {
        headers: { userid: "1" },
      }
    )
    .then((response) => {
    
    })
    .catch((error) => {
      console.error("Error updating issue status:", error);
    });
};


 

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issue: Issue) => {
    console.log("drag start")
    setDraggedCard(issue);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, statusIndex: number) => {
    console.log("drag over")
    e.preventDefault();
    if (draggedCard) {
     
      const newStatusColumns = [...statusColumns];
      
     
      const sourceColumnIndex = statusColumns.findIndex(column => column.includes(draggedCard));
      const updatedSourceColumn = [...statusColumns[sourceColumnIndex].filter(card => card.id !== draggedCard.id)];
      newStatusColumns[sourceColumnIndex] = updatedSourceColumn;

     
      newStatusColumns[statusIndex].push(draggedCard);
      
      setStatusColumns(newStatusColumns);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, statusIndex: number) => {
    console.log("handle drop")
    e.preventDefault();
    if (draggedCard) {

      const newStatus = statusIndex + 1; 
    
      updateIssueStatus(draggedCard.id, newStatus);
      
      setDraggedCard(null);
    }
  };















  return (
    <div className="ProjectDetailsDiv">
      <h1>Project Details</h1> 
     

      {projectsCreated ? (
       
        <>
          <form className="proform">
            <div className="form-group">
              <label htmlFor="selectedProject">Select a Project:</label>
              <div className="custom-select-container">
                <select
                className="PDformselect"
                  id="selectedProject"
                  name="selectedProject"
                  onChange={handleProjectChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.selectedProject}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.projectID} value={project.projectID}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
                {formik.values.selectedProject && selectedProjectDetails && (
                  <div className="project-details">
                    <div className="">
                      <label htmlFor="projectOwner">Project Owner:</label>
                      <input
                        type="text"
                        id="projectOwner"
                        name="projectOwner"
                        value={selectedProjectDetails.projectOwner.name}
                        disabled
                      />
                    </div>
                    <p>{formatDate( selectedProjectDetails.projectStartDate )} TO {formatDate( selectedProjectDetails.projectEndDate)}</p> 
                    <span> <Link to={`/dashboard/project-insights/${selectedProjectDetails?.projectID}`}><ClayButton>ViewInsights</ClayButton> </Link></span>
                  </div>
                  
                )}
             
              </div>
              </div>
              
          </form>
          <form className="filterclass">
            <div className="form-group">
              <label>Filter by Priority:</label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="1">LOW</option>
                <option value="2">MEDIUM</option>
                <option value="3">HIGH</option>
               
              </select>
            </div>

            <div className="form-group">
              <label>Filter by Assignee:</label>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <option value="">All</option>
               
                {issues.map((issue) => (
                      <option key={issue.id} value={issue.assignee.name}>{issue.assignee.name}</option>
                    ))}
              </select>
            </div>
          </form>
          {/* <div>
            <h2>Issues:</h2>
            
            <div className="status-columns">
              {[1, 2, 3, 4].map((status) => (
                <div key={status} className="status-column">
                  <h3>{statusstr[status-1]}</h3>
                  {filteredIssues
                    .filter((issue) => issue.status === status)
                    .map((issue,index) => (
                      <Link to={`/dashboard/issue-details/${issue.id}`} key={index}>
                      <ClayCard
                      key={issue.id}
                      title={`Summary: ${issue.summary}`}
                      className="issuecard"
                    >
                      <div className="issueid">
                        <p>ID: {issue.id}</p>
                        <p>{formatDate( issue.createdOn)}</p>
                      </div>
                      <div className="issuesum">
                        <h5>{issue.summary}</h5>
                        <p> {issue.description}</p>
                      </div>
                      <div className="issuename">
                        <h5>{issue.assignee.name}</h5>
                        <div className="issuepriority">
                          <p> Priority</p>
                          <span style={{background:priorityclr[issue.priority-1]}}> {prioritystr[issue.priority-1]}</span>
                        </div>
                      </div>
                    </ClayCard></Link>
                    ))}
                </div>
              ))}
            </div>
          </div> */}

      <div>
        <h2>Issues:</h2>
        <div className="status-columns">
          {statusColumns.map((column, statusIndex) => (
            <div
              key={statusIndex}
              className="status-column"
              onDragOver={(e) => handleDragOver(e, statusIndex)}
              onDrop={(e) => handleDrop(e, statusIndex)}
            >
              <h3>{statusstr[statusIndex]}</h3>
             
              {column.map((issue, index) => (
                <Link to={`/dashboard/issue-details/${issue.id}`} key={index}>
                  <ClayCard
                    key={issue.id}
                    title={`Summary: ${issue.summary}`}
                    className="issuecard"
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, issue)}
                  >
                    <div className="issueid">
                        <p>ID: {issue.id}</p>
                        <p>{formatDate( issue.createdOn)}</p>
                      </div>
                      <div className="issuesum">
                        <h5>{issue.summary}</h5>
                        <p> {issue.description}</p>
                      </div>
                      <div className="issuename">
                        <h5>{issue.assignee.name}</h5>
                        <div className="issuepriority">
                          <p> Priority</p>
                          <span style={{background:priorityclr[issue.priority-1]}}> {prioritystr[issue.priority-1]}</span>
                        </div>
                      </div>
                  </ClayCard>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    


          
        </>
      ) : (
      
        <div className="mainProjectDetails">
          <div className="pDnone">
            <h1>Welcome to Tracker</h1>
            <h3>
              Seems like you have not created any projects yet.{" "}
              <a href="/dashboard/create-project">Click here</a> to upload a new
              Project
            </h3>
            <img src="/undraw.png" alt="img" className="pdimg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
