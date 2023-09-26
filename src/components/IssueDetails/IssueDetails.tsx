import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// import ClayButton from '@clayui/button';
import { useFormik } from "formik";
import * as Yup from "yup";
import ClayLoadingIndicator from "@clayui/loading-indicator";
import ClayCard from "@clayui/card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Issue, Comment } from "../interface";
import "./IssueDetails.css";

export default function IssueDetails() {
  const { issueId } = useParams();
  const [issue, setissue] = useState<Issue>();
  const [data, setdata] = useState(false);
  const [datacmt, setdatacmt] = useState(1);
  const [commentdata, setcommentdata] = useState<Comment[]>([]);
  const [cmtstate, setcmtstate] = useState(false);
  const prioritystr=["LOW", "MEDIUM","HIGH" ]
  const priorityclr=["green", "yellow", "red"]
  const typestr=["Bugs","Task","Story"]

  const initialValues = {
    status: "",
  };
  const initialValuescmt = {
    comment: "",
  };

  const validationSchema = Yup.object({
    status: Yup.string().required("Status is required"),
    // assignee: Yup.string().required('Assignee is required'),
  });
  const validationSchemacmt = Yup.object({
    comment: Yup.string().required("comment is required"),
    // assignee: Yup.string().required('Assignee is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log("onsubmit");
      console.log("values", values);
      //  await postIssue(values);
      updateIssueStatus(issueId, values.status);
      // alert("Issue status updated!!");
      toast.success("Issue status updated!! ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    },
  });

  const formikcmt = useFormik({
    initialValues: initialValuescmt,
    validationSchema: validationSchemacmt,
    onSubmit: async (values) => {
      console.log("onsubmit");
      console.log("values", values);

      createcomment(values.comment, issue?.projectID, issueId);
      formikcmt.resetForm();
      setcmtstate(false);
      toast.success("Comment Added updated!! ", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
     
    },
  });

  useEffect(() => {
    // setTimeout( () => {
    getissues();

    // },4000);
  }, [issueId]);
  useEffect(() => {
    console.log("issue", issue);
    getComments();
  }, [data,datacmt]);

  const getissues = async () => {
    console.log("issueid", issueId);
    await axios
      .get(
        `https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/issue/${issueId}`,
        {
          headers: { userid: "1" },
        }
      )
      .then((response) => {
        setissue(response.data);
        setdata(true);
        // initialValues.status=response.data.status;
        // Check if projects are created
      })
      .catch((error) => {
        console.error("Error fetching issue:", error);
      });
  };

  const getComments = async () => {
    console.log("issueid", issueId);
    console.log("projectid", issue?.projectID);

    await axios
      .get(
        `https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/comment?projectID=${issue?.projectID}&issueID=${issueId}`,
        {
          headers: { userid: "1" },
        }
      )
      .then((response) => {
        setcommentdata(response.data);
        setdata(true);
      })
      .catch((error) => {
        console.error("Error fetching comments:", error);
      });
  };

  // Function to update issue status on the server
  const updateIssueStatus = (issueId: string, newStatus: string) => {
    axios
      .put(
        `https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/issue/${issueId}`,
        {
          status: parseInt(newStatus),
        },
        {
          headers: { userid: "1" },
        }
      )
      .then((response) => {
        // Handle successful status update
        alert("issue Status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating issue status:", error);
      });
  };
  const createcomment = (
    comment: string,
    projectID: string | undefined,
    issueID: string
  ) => {
    console.log("craete cmt", comment);
    axios
      .post(
        `https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/comment?projectID=${projectID}&issueID=${issueID}`,
        {
          comment: comment,
        },
        {
          headers: { userid: "1" },
        }
      )
      .then((response) => {
         setdatacmt(datacmt+1);
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };

  return (
    <div className="issuemaindiv">
      <p>Project Board / issue Details</p>
      <h1>IssueDetails</h1>
      <ToastContainer containerId="notification-container" />
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
      <div className="IDhead">
        <h1>{issue?.projectID}</h1>
        <h3>{issue?.summary}</h3>
      </div>
      <div className="IDdisplay">
        <div className="left">
          <div className="desc">
            <h5>Description:</h5>
            <p>{issue?.description}</p>
          </div>
          {/* <hr /> */}
          <div className="detail">
            <hr />
            <h2>Details</h2>
            <div className="subdetails">
              <span>
                <h5>Type</h5>
                <p>{typestr[issue?.type||0]}</p>
              </span>
              <span>
                <h5>Tags</h5>
                <p>{issue?.tags}</p>
              </span>
              <span>
                <h5>Sprint</h5>
                <p>{issue?.sprint}</p>
              </span>
              <span>
                <h5>Priority</h5>
                <p style={{background:priorityclr[issue?.priority||0],width:"4rem",textAlign:"center"}}>{prioritystr[issue?.priority||0]}</p>
              </span>
              <span>
                <h5>Story Points</h5>
                <p>{issue?.storyPoint}</p>
              </span>
            </div>
          </div>
          <div className="comments">
            <hr />
            <div className="cmt_head">
              <h3>Comments</h3>
              <p onClick={() => setcmtstate(!cmtstate)}>
                <span>+</span>Add Comment
              </p>
            </div>
            {cmtstate ? (
              <form onSubmit={formikcmt.handleSubmit} className="addcomment">
                <textarea
                  onChange={formikcmt.handleChange}
                  // onBlur={formikcmt.handleBlur}
                  value={formikcmt.values.comment}
                  required
                  name="comment"
                  id="comment"
                  placeholder="Write Comment"
                />
                <div className="cmtbtn">
                  <button className="IDbtns" type="submit">
                    POST
                  </button>
                  <button className="IDbtnr" onClick={() => setcmtstate(false)}>
                    Cancel
                  </button>
                </div>
                {formikcmt.touched.comment && formikcmt.errors.comment ? (
                  <div className="error">{formikcmt.errors.comment}</div>
                ) : null}
              </form>
            ) : (
              <></>
            )}

            <div className="cmt">
              {commentdata.map((comment) => (
                <ClayCard className="cmtcard">
                  <p>{comment.comment}</p>
                  <span>

                    <p>Posted on: {comment.createdOn}</p>
                    <p>Posted By: {comment.createdBy.name}</p>
                  </span>
                </ClayCard>
              ))}
            </div>
          </div>
        </div>
        <div className="right">
          <form onSubmit={formik.handleSubmit} className="editform">
            <button type="submit">EDIT ISSUE</button>
            <div className="IDformfeild">
              <label className="IDlabel" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                className="IDselect"
                name="status"
                onChange={formik.handleChange}
                // onBlur={formik.handleBlur}
                value={formik.values.status || issue?.status}
                required
              >
                <option className="IDselectOP" value="" disabled>
                  Select
                </option>
                <option value="1">TO DO</option>
                <option value="2">Development</option>
                <option value="3">Testing</option>
                <option value="4">Completed</option>
                {/* Add more priority options as needed */}
              </select>
              {formik.touched.status && formik.errors.status ? (
                <div className="error">{formik.errors.status}</div>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
