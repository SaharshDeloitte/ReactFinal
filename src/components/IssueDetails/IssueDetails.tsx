import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

// import ClayButton from '@clayui/button';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ClayLoadingIndicator from '@clayui/loading-indicator';

export default function IssueDetails() {
  const { issueId } = useParams();
  const [issue, setissue] = useState<Issue>();
  const [data, setdata] = useState(false);


  const initialValues = {
  
    status: '1',
    assignee: '1',
   
  };

  const validationSchema = Yup.object({
 
    status: Yup.string().required('Status is required'),
    assignee: Yup.string().required('Assignee is required'),
  
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log("onsubmit");
      console.log('values', values);
    //  await postIssue(values);
      
    },
  });

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

  useEffect(() => {
    // setTimeout( () => {
      getissues();
    // },4000);
  }, [issueId]);
  useEffect(() => {
    console.log('issue', issue);
  }, [data]);
  
  const getissues=async () => {
    console.log("issueid",issueId)
    await axios
      .get(`https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/issue/${issueId}`, {
        headers: { userid: "1" },
      })
      .then((response) => {
        setissue(response.data);
        setdata(true);
        // Check if projects are created
       
      })
      .catch((error) => {
        console.error("Error fetching issue:", error);
      });

  }

  
  return (
    <div>
      <p>Project Board / issue Details</p>
      <h1>IssueDetails</h1>
      {data?<></>:<ClayLoadingIndicator className="loginLoader" displayType="primary" shape="squares" size="lg" />}
    <div>
        <h1>{issue?.projectID}</h1>
        <h3>{issue?.summary}</h3>
    </div>
    <div>
      <div className="left">
        <div className="desc">
          <p>Description:</p>
          <p>{issue?.description}</p>
        </div>
        <div className="detail">
          <h2>Details</h2>
          <div>
          <span><h5>Type</h5><p>{issue?.type}</p></span>
          <span><h5>Tags</h5><p>{issue?.tags}</p></span>
          <span><h5>Sprint</h5><p>{issue?.sprint}</p></span>
          <span><h5>Priority</h5><p>{issue?.priority}</p></span>
          <span><h5>Story Points</h5><p>{issue?.storyPoint}</p></span></div>
        </div>

      </div>
      <div className="right">
        <button>EDIT ISSUE</button>
        <div className="editform">
        <div className='CIformfeild'>
            <label className='CIlabel' htmlFor="priority">Priority</label>
            <select
              id="priority"
              className='CIselect'
              name="priority"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.status}
              required
            >
              <option className='CIselectOP' value="" disabled hidden>Select</option>
              <option value="1">TO DO</option>
              <option value="2">Development</option>
              <option value="3">Testing</option>
              <option value="4">Completed</option>
              {/* Add more priority options as needed */}
            </select>
            {formik.touched.status && formik.errors.status ? (
              <div className='error'>{formik.errors.status}</div>
            ) : null}
          </div>
        <div className='CIformfeild'>
            <label className='CIlabel' htmlFor="assignee">Assignee</label>
            <select
              id="assignee"
              className='CIselect'
              name="assignee"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.assignee}
              required
            >
              <option className='CIselectOP' value="" disabled hidden>Select</option>
              <option value="1">Assignee 1</option>
              <option value="2">Assignee 2</option>
              <option value="3">Assignee 3</option>
              <option value="4">Assignee 4</option>
              {/* Add more assignee options as needed */}
            </select>
            {formik.touched.assignee && formik.errors.assignee ? (
              <div className='error'>{formik.errors.assignee}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>

    </div>
  )
}
