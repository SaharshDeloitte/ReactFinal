import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./CreateProject.css";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateProject = () => {
  const [apiResponse, setApiResponse] = useState(null);
  // const [alertMessage, setAlertMessage] = useState("");

  const initialValues = {
    projectName: "",
    owner: "",
    startDate: "",
    endDate: "",
  };

  const validationSchema = Yup.object({
    projectName: Yup.string().required("Project name is required"),
    owner: Yup.string().required("Owner is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date().required("End date is required"),
  });
 
  const postProject = async (values:any) => {
    try {
      const response = await axios.post(
        "https://hu-22-angular-mockapi-urtjok3rza-wl.a.run.app/project",
        {
          projectName: values.projectName,
          projectOwner: values.owner, // Assuming owner is an ID
          projectStartDate: values.startDate,
          projectEndDate: values.endDate,
        },
        {
          headers: { userID: "1" }, // Replace with your user ID
        }
      );
      setApiResponse(response.data); 
      console.log('response', response)
      // Store the API response in state
      alert(apiResponse);
      toast.success(apiResponse, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
    } catch (error) {
      console.error("Error posting project:", error);
      setApiResponse(null); // Clear the API response
      alert("error try again");
      toast.error(apiResponse, {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      await postProject(values); // Await the async API function
      formik.resetForm();
    },
  });

  const handleReset = () => {
    formik.resetForm();
  };

  return (
    <div className="CPmain">
      <h1>Create Project</h1>
      <ToastContainer containerId="notification-container" />
      <form onSubmit={formik.handleSubmit} className="CPform">
      
        
        <div className="formleft">
          <div className="CPformfeild">
            <label htmlFor="projectName" className="CPlabel">
              Project Name
            </label>
            <input
              className="CPinput"
              type="text"
              id="projectName"
              name="projectName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.projectName}
              placeholder="Project Name"
            />
            {formik.touched.projectName && formik.errors.projectName ? (
              <div className="error">{formik.errors.projectName}</div>
            ) : null}
          </div>

          <div className="CPformfeild">
            <label className="CPlabel" htmlFor="owner">
              Owner
            </label>
            <select
              id="owner"
              className="CPselect"
              name="owner"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.owner}
              placeholder="owner"
              required
            >
              <option className="CPselectOP" value="" disabled hidden>
                owner
              </option>
              <option value="1">Anusha Somashekar</option>
              <option value="2">Niharika Guglani</option>
              {/* Add more owner options as needed */}
            </select>
            {formik.touched.owner && formik.errors.owner ? (
              <div className="error">{formik.errors.owner}</div>
            ) : null}
          </div>
        </div>
        <div className="formright">
          <div className="CPformfeild">
            <label className="CPlabel" htmlFor="startDate">
              Project Start Date
            </label>
            <input
              className="CPinput"
              type="date"
              id="startDate"
              name="startDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.startDate}
            />
            {formik.touched.startDate && formik.errors.startDate ? (
              <div className="error">{formik.errors.startDate}</div>
            ) : null}
          </div>

          <div className="CPformfeild">
            <label className="CPlabel" htmlFor="endDate">
              Project End Date
            </label>
            <input
              className="CPinput"
              type="date"
              id="endDate"
              name="endDate"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.endDate}
            />
            {formik.touched.endDate && formik.errors.endDate ? (
              <div className="error">{formik.errors.endDate}</div>
            ) : null}
          </div>
        </div>
        <div className="formbtn">
          <button className="CPbtns" type="submit">
            Submit
          </button>
          <button className="CPbtnr" type="button" onClick={handleReset}>
            Reset
          </button>
        </div>
      </form>{" "}
    </div>
  );
};

export default CreateProject;
