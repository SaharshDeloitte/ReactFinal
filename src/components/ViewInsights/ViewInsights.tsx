import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ViewInsights.css";
import { Project } from "./../interface";
import ClayLoadingIndicator from "@clayui/loading-indicator";

interface total {
  value?: number | undefined;
  todo?: number | undefined;
  dev?: number | undefined;
  test?: number | undefined;
  complete?: number | undefined;
  segmentAWidth:number  | undefined;
   segmentBWidth:number | undefined;
  segmentCWidth :number | undefined;
   segmentDWidth :number | undefined;

}

export default function ViewInsights() {
  const { projectId } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [curprojects, setcurProjects] = useState<Project>();
  const [issues, setIssues] = useState([]);
  const [total, settotal] = useState<total>();
  const [data, setdata] = useState(false);


  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchDataissue();
  }, [projectId]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchData();
  }, [projectId]);
  useEffect(() => {
    getIssues();
    findproject();
  }, [data]);


  const getIssues = () => {
    const totalIssues = issues.length;
    console.log(totalIssues);
    console.log("issues", issues);
    const temp = { ...total};
    const totalIssuesWithStatus1 = issues.filter(
      (issue1: any) => issue1.status === 1
    ).length;
    const totalIssuesWithStatus2 = issues.filter(
      (issue1: any) => issue1.status === 2
    ).length;
    const totalIssuesWithStatus3 = issues.filter(
      (issue1: any) => issue1.status === 3
    ).length;
    const totalIssuesWithStatus4 = issues.filter(
      (issue1: any) => issue1.status === 4
    ).length;
    temp.value = totalIssues;
    temp.todo = totalIssuesWithStatus1;
    temp.dev = totalIssuesWithStatus2;
    temp.test = totalIssuesWithStatus3;
    temp.complete = totalIssuesWithStatus4;

   temp.segmentAWidth = (totalIssuesWithStatus1 / totalIssues) * 100;
   temp.segmentBWidth = (totalIssuesWithStatus2 / totalIssues) * 100;
   temp.segmentCWidth = (totalIssuesWithStatus3 / totalIssues) * 100;
   temp.segmentDWidth = (totalIssuesWithStatus4 / totalIssues) * 100;
    console.log(temp.segmentAWidth );
    settotal(temp);
    console.log(temp);
  };
  const fetchData = async () => {
    await axios
      .get("https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/project", {
        headers: { userID: "1" },
      })
      .then((response) => {
        console.log("projects set");
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching projects:", error);
      });
    findproject();
  };
  const findproject = () => {
    const projectDetail = projects.find(
      (project) => project.projectID === projectId
    );
    console.log("projectDetails", projectDetail);
    setcurProjects(projectDetail);
  };

  const fetchDataissue = async () => {
    console.log("id", projectId);
    // if (curprojects) {
    await axios
      .get(
        `https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/issue?projectID=${projectId}`,
        {
          headers: { userid: "1" },
        }
      )
      .then((response) => {
        setIssues(response.data);
        setTimeout(() => {
          setdata(true);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error fetching issues:", error);
      });

    // }
    // else{
    // console.log("Error fetching issues");
    // }
  };
  return (
    <div>
      {data ? (
        <></>
      ) : (
        <ClayLoadingIndicator
          className="loginLoader"
          displayType="primary"
          shape="squares"
          size="lg"
        />
      )}
      <p>Project Board / view Insights</p>
      <div className="VImain">
        <div className="VIhead">
          <h1>{curprojects?.projectName}</h1>
          <h3>Total Number of Issues: {total?.value}</h3>
        </div>
        <div className="VIdata">
          <span>
            <h4>TO DO</h4>
            <p style={{ color: "yellow" }}>{total?.todo}</p>
          </span>
          <span>
            <h4>Devlopment</h4>
            <p style={{ color: "orange" }}>{total?.dev}</p>
          </span>
          <span>
            <h4>Testing</h4>
            <p style={{ color: "blue" }}>{total?.test}</p>
          </span>
          <span>
            <h4>Completed</h4>
            <p style={{ color: "green" }}>{total?.complete}</p>
          </span>
        </div>
        <div className="VIbar">
          <div
            className="bar1"
            style={{ width: `${total?.segmentAWidth}%`}}
          ></div>
          <div
            className="bar2"
            style={{ width: `${total?.segmentBWidth}%`}}
          ></div>
          <div
            className="bar3"
            style={{ width: `${total?.segmentCWidth}%`}}
          ></div>
          <div
            className="bar4"
            style={{ width: `${total?.segmentDWidth}%`}}
          ></div>
        </div>
      </div>
    </div>
  );
}
