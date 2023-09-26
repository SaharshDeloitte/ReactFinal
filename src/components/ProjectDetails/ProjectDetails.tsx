import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProjectDetails.css";
import { useFormik } from "formik";
import ClayCard from "@clayui/card";
import { Link } from 'react-router-dom';
// import ViewInsights from '../ViewInsights/ViewInsights';
import DragandDrop from "../DragandDrop/DragandDrop";


import ClayButton from '@clayui/button';

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

interface Issue {
  id: string;
  summary: string;
  type: number;
  projectID: string;
  description: string;
  priority: number;
  assignee: {
    id: number;
    name: string;
    email: string;
    teamName: string;
    desination: string;
  };
  tags: string[];
  sprint: string;
  storyPoint: number;
  status: number;
  createdBy: any;
  createdOn: string;
  updatedBy: {
    id: number;
    name: string;
    email: string;
    teamName: string;
    desination: string;
  };
  updatedOn: string;
}

const ProjectDetails: React.FC = () => {
  // State for project, issues, and filters
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<Project | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");

  // State to track whether projects are created or not
  const [projectsCreated, setProjectsCreated] = useState(false);
  const statusstr=["TO DO","DEVELOPMENT","TESTING","Completed"];
  const prioritystr=["LOW", "MEDIUM","HIGH" ]
  const priorityclr=["green", "yellow", "red"]


  const [statusColumns, setStatusColumns] = useState<Array<Issue[]>>([]);
  const [draggedCard, setDraggedCard] = useState<Issue | null>(null);

  // Initialize the status columns with issues based on status values
 
  // Fetch projects and set them in the projects state
  useEffect(() => {
    axios
      .get("https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/project", {
        headers: { userID: "1" },
      })
      .then((response) => {
        setProjects(response.data);

        // Check if projects are created
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

  // Fetch issues for the selected project and set them in the issues state
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

  // Create a Formik instance to manage the form state
  const formik = useFormik({
    initialValues: {
      selectedProject: "",
    },
    onSubmit: (values) => {
      // Handle form submission here
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter issues based on priority and assignee
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
    // const initialColumns = statusstr.map(() => []);
    let filteredAndSortedIssues = filteredIssues;
    filteredAndSortedIssues.sort((a, b) => a.status - b.status);

    // Initialize an array to hold the status columns
    // const initialColumns: Array<Array<Issue>> = statusstr.map(() => []);

    // ...
    
    // Initialize an array to hold the status columns
    const newStatusColumns: Array<Array<Issue>> = statusstr.map(() => []);
    
    // Distribute issues into their respective status columns
    filteredAndSortedIssues.forEach((issue) => {
      const statusIndex = issue.status - 1; // Assuming status is 1-based
      newStatusColumns[statusIndex].push(issue);
    });
    // Update the state with the new statusColumns
    setStatusColumns(newStatusColumns);

  }, [filteredIssues]);

  const handleProjectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedProjectID = event.target.value;
    formik.setFieldValue("selectedProject", selectedProjectID);
    setSelectedProject(selectedProjectID);

    // Find the selected project details
    const projectDetail = projects.find(
      (project) => project.projectID === selectedProjectID
    );

    if (projectDetail) {
      setSelectedProjectDetails(projectDetail);
    } else {
      setSelectedProjectDetails(null);
    }
  };


// Function to update issue status on the server
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
      // Handle successful status update
    })
    .catch((error) => {
      console.error("Error updating issue status:", error);
    });
};


  // Function to handle drag-and-drop

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, issue: Issue) => {
    console.log("drag start")
    setDraggedCard(issue);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, statusIndex: number) => {
    console.log("drag over")
    e.preventDefault();
    if (draggedCard) {
      // Create a copy of the status columns
      const newStatusColumns = [...statusColumns];
      
      // Remove the dragged card from its current column
      const sourceColumnIndex = statusColumns.findIndex(column => column.includes(draggedCard));
      const updatedSourceColumn = [...statusColumns[sourceColumnIndex].filter(card => card.id !== draggedCard.id)];
      newStatusColumns[sourceColumnIndex] = updatedSourceColumn;

      // Add the dragged card to the target column
      newStatusColumns[statusIndex].push(draggedCard);
      
      setStatusColumns(newStatusColumns);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, statusIndex: number) => {
    console.log("handle drop")
    e.preventDefault();
    if (draggedCard) {
      // Update the status of the card using an API call
      const newStatus = statusIndex + 1; // Assuming your status indices are 0-based
      // Make an API call to update the status of the card with the newStatus value
      updateIssueStatus(draggedCard.id, newStatus);
      // Clear the draggedCard state
      setDraggedCard(null);
    }
  };















  return (
    <div className="ProjectDetailsDiv">
      <h1>Project Details</h1> 
     

      {projectsCreated ? (
        // Render the issue tracker when projects are created
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
                {/* Add more priority options as needed */}
              </select>
            </div>

            <div className="form-group">
              <label>Filter by Assignee:</label>
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
              >
                <option value="">All</option>
                {/* <option value="Anusha Somashekar">Anusha Somashekar</option> */}
                {/* <option value="Other">Other Assignee</option> */}
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
              {/* {console.log("column",statusColumns)} */}
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
        // Render the HTML block when no projects are created
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
