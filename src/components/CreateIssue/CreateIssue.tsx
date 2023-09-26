import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import './CreateIssue.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateIssue = () => {

  const [apiResponse, setApiResponse] = useState(null);
  const [projectOptions, setProjectOptions] = useState<Project[]>([]);
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
  const initialValues = {
    summary: '',
    type: '',
    projectID: '',
    description: '',
    priority: '',
    // status: '1',
    assignee: '1',
    tags: '',
    sprint: '',
    storyPoint: '',
  };

  const validationSchema = Yup.object({
    summary: Yup.string().required('Summary is required'),
    type: Yup.string().required('Type is required'),
    projectID: Yup.string().required('Project is required'),
    description: Yup.string().required('Description is required'),
    priority: Yup.string().required('Priority is required'),
    // status: Yup.string().required('Status is required'),
    assignee: Yup.string().required('Assignee is required'),
    tags: Yup.string().required('Tags are required'),
    sprint: Yup.string().required('Sprint is required'),
    storyPoint: Yup.number()
      .typeError('Story points must be a number')
      .required('Story points are required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      console.log("onsubmit");
      console.log('values', values);
     await postIssue(values);
      
    },
  });
  const postIssue = async (values:any) => {
    console.log("postIssue acalled");
    try {
      const response = await axios.post(
        'https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/issue',
        {
          summary: values.summary,
          type: values.type, // Parse to integer
          projectID: values.projectID,
          description: values.description,
          priority: parseInt(values.priority), // Parse to integer
          status:1, // Parse to integer
          assignee: parseInt(values.assignee), // Parse to integer
          tags: values.tags.split(','),
          sprint: values.sprint,
          storyPoint: parseInt(values.storyPoint), // Parse to integer
        },
        {
          headers: { userID: '1' }, // Replace with your user ID
        }
      );
      console.log(JSON.stringify(response.data));
      setApiResponse(response.data); // Store the API response in state
      alert(response.data); // Display the
      toast.success(apiResponse, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      formik.resetForm(); // Reset the form
    } catch (error) {
      console.error('Error creating issue:', error);
      setApiResponse(null); // Clear the API response
      alert('Error creating issue:');
      toast.error("Error try again", {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }

  }
  const handleReset = () => {
    console.log('rest clicked');
    // formik.values
    console.log('formik.values', formik.values)
    formik.resetForm();
  };

    // Fetch project data for the dropdown options
    useEffect(() => {
      axios.get("https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/project", {
          headers: { userID: "1" },
        })
        .then((response) => {
          const projectsData = response.data;
          const projectOptionsData = projectsData.map((project:any) => ({
            label: project.projectName,
            value: project.projectID,
          }));
          setProjectOptions(projectOptionsData);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        });

        console.log("useeffects");
    }, []);



  return (
    <div className='CImain'>
      <h1>Create Issue</h1>
      <form onSubmit={formik.handleSubmit} className='CIform'>
       
          <div className='CIformfeildtxt'>
            <label htmlFor="summary" className='CIlabel'>Summary</label>
            <input
              className='CIinputtxt'
              type="text"
              id="summary"
              name="summary"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.summary}
              placeholder='Summary'
            />
            {formik.touched.summary && formik.errors.summary ? (
              <div className='error'>{formik.errors.summary}</div>
            ) : null}
          </div>
          <div className='formleft'>
          <div className='CIformfeild'>
            <label className='CIlabel' htmlFor="type">Type</label>
            <select
              id="type"
              className='CIselect'
              name="type"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.type}
              required
            >
              <option className='CIselectOP' value="" disabled hidden>Select</option>
              <option value="1">Type 1</option>
              <option value="2">Type 2</option>
              {/* Add more type options as needed */}
            </select>
            {formik.touched.type && formik.errors.type ? (
              <div className='error'>{formik.errors.type}</div>
            ) : null}
          </div>

          <div className='CIformfeild'>
            <label className='CIlabel' htmlFor="projectID">Project</label>
            <select
              id="projectID"
              className='CIselect'
              name="projectID"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.projectID}
              required
            >
              <option className='CIselectOP' value="" disabled hidden>Select</option>
              {projectOptions.map((option:any) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formik.touched.projectID && formik.errors.projectID ? (
              <div className='error'>{formik.errors.projectID}</div>
            ) : null}
          </div>
       

          </div>
          <div className='CIformfeildtxt'>
            <label className='CIlabel' htmlFor="description">Description</label>
            <textarea
              className='CItextarea'
              id="description"
              name="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              placeholder='Description'
            />
            {formik.touched.description && formik.errors.description ? (
              <div className='error'>{formik.errors.description}</div>
            ) : null}
          </div>
        

        <div className="formright">
          <div className='CIformfeild'>
            <label className='CIlabel' htmlFor="priority">Priority</label>
            <select
              id="priority"
              className='CIselect'
              name="priority"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.priority}
              required
            >
              <option className='CIselectOP' value="" disabled hidden>Select</option>
              <option value="1">LOW</option>
              <option value="2">MEDIUM</option>
              <option value="3">HIGH</option>
              {/* Add more priority options as needed */}
            </select>
            {formik.touched.priority && formik.errors.priority ? (
              <div className='error'>{formik.errors.priority}</div>
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
          <div className="formleft">
          <div className='CIformfeild'>
            <label className='CIlabel' htmlFor="tags">Tags</label>
            <select
              id="tags"
              className='CIselect'
              name="tags"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.tags}
              required
            >
              <option className='CIselectOP' value="" disabled hidden>Select</option>
              <option value="Tag 1">Tag 1</option>
              <option value="Tag 2">Tag 2</option>
              {/* Add more tag options as needed */}
            </select>
            {formik.touched.tags && formik.errors.tags ? (
              <div className='error'>{formik.errors.tags}</div>
            ) : null}
          </div>
       

        
          <div className='CIformfeild'>
            <label className='CIlabel' htmlFor="sprint">Sprint</label>
            <select
              id="sprint"
              className='CIselect'
              name="sprint"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.sprint}
              required
            >
              <option className='CIselectOP' value="" disabled hidden>Select</option>
              <option value="Sprint 1">Sprint 1</option>
              <option value="Sprint 2">Sprint 2</option>
              {/* Add more sprint options as needed */}
            </select>
            {formik.touched.sprint && formik.errors.sprint ? (
              <div className='error'>{formik.errors.sprint}</div>
            ) : null}
          </div></div>

          <div className='CIformfeildtxt'>
            <label className='CIlabel' htmlFor="storyPoint">Story Points</label>
            <input
              className='CIinputn'
              type="number"
              id="storyPoint"
              name="storyPoint"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.storyPoint}
              placeholder='Story Point'
            />
            {formik.touched.storyPoint && formik.errors.storyPoint ? (
              <div className='error'>{formik.errors.storyPoint}</div>
            ) : null}
          </div>
        

        <div className="formbtn">
          <button className='CIbtns' type="submit">Submit</button>
          <button className='CIbtnr' type="button" onClick={handleReset}>Reset</button>
        </div>
      </form>
    </div>
  );
};

export default CreateIssue;
