import { ErrorResponse, MultipleErrorResponse } from "../Profile";
import { JobOfferListingData } from "./JobOfferListing";
import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { Link, useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import Loading from '../Loading';
import AuthContext from '../../utils/AuthProvider';
import ErrorPage from '../ErrorPage';
import JobOfferTop from "./JobOfferComponents/JobOfferTop";
import ProfileAlert from "../profileComponents/ProfileAlert";
import JobOfferSkill from "./JobOfferComponents/JobOfferSkill";
import JobOfferTopMore from "./JobOfferComponents/JobOfferTopMore";

// make mulitple interfaces for easier crud
// should make one for immutable company data
export interface JobOfferCompanyData {
    username: string;
    first_name: string;
    // last_name: string;
    // date_of_birth: string;
    country: string;
    city: string;
    // current_position: string;
    profile_image: string;
    background_image: string;   
}

export interface JobOfferTopData {
    title: string;
    salary_min: number;
    salary_max: number;
    salary_type: string;
    salary_currency: string;
    
}
export interface JobOfferTopMoreData{
    job_application_deadline: string;
    recruitment_type: string;
    job_location: string;
    work_schedule: string;
    position_level: string;
    contract_type: string;
    vacancy: string;
    work_mode: string;
    specialization: string;
    

}

export interface JobOfferSkillData{
    id: number;
    skill: string;
    skill_type: string;
    offer_id: string | null;
}


interface JobOfferData {
    company: string;
    title: string;
    job_description: string;
    job_location: string;
    work_schedule: string;
    salary_min: number;
    salary_max: number;
    salary_type: string;
    salary_currency: string;
    job_responsibilities: string;
    job_requirements: string;
    job_published_at: Date;
    job_application_deadline: Date;
    recruitment_type: string;
    application_process: string;
    job_benefits: string;
    job_additional_information: string;
    skills: string[];
  }


// SIMPLIFICATION OF MY JobOfferGetDataFunction TYPE BECAUSE OF ERROR
//one data
type UpdateFunction<T> = React.Dispatch<React.SetStateAction<T | null>>;
//array of data
type ArrayUpdateFunction<T> = React.Dispatch<React.SetStateAction<T[]>>;


export type JobOfferGetDataFunction =
  | UpdateFunction<JobOfferCompanyData>
  | UpdateFunction<JobOfferTopData>
  | ArrayUpdateFunction<JobOfferSkillData>
  | UpdateFunction<JobOfferTopMoreData>
  | undefined;
  //UNIVERSAL PUT STATES
  //single data
export type JobOfferEditDataFunction = 
    JobOfferTopData | null |
    JobOfferSkillData[] |
    JobOfferSkillData | null |
    JobOfferTopMoreData | null |
    
    undefined;
// multiple data
export type JobOfferEditMultipleDataFunction = 
//     ExperienceData[] |
//     EducationData[] |
//     CourseData[] |
//     LanguageData[] |
//     LinkData[] |
    JobOfferSkillData[] 
     ;
const initialMultipleErrors: MultipleErrorResponse = {
    salary: {},
  };

  
    
const JobOffer: React.FC = () =>{
    const params = useParams();
    const offerid = params['offerid'];
   
    // Data for all components
    const [jobOfferCompany, setJobOfferCompany] = useState<JobOfferCompanyData| null>(null);
    const [jobOfferTop, setJobOfferTop] = useState<JobOfferTopData| null>(null);
    const [jobOfferTopMore, setJobOfferTopMore] = useState<JobOfferTopMoreData| null>(null);
    const [jobOfferSkill, setJobOfferSkill] = useState<JobOfferSkillData[]>([]);
    
    // const [jobOffers, setJobOffers] = useState<JobOfferListingData| null>(null);
    
    // Only one data (like post only field)
    const [singleJobOfferSkill, setSingleJobOfferSkill] = useState<JobOfferSkillData | null>(null);


    // for loading
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // All errors for all fields
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>(initialMultipleErrors)
    
    // To check how others see your JobOffer
    const [previewMode, setPreviewMode] = useState(false);

    // For alert component
    const [alertError, setAlertError] = useState('');
    
    // Authtoken for CRUD and user for username and logout
    const { logoutUser, authTokens, user } = useContext(AuthContext);
    
    // Axios error for error component
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null)

    // To check if given form is in edit state
    const [editJobOfferTop, setEditJobOfferTop] = useState(false);
    const [editJobOfferSkill, setEditJobOfferSkill] = useState(false);
    const [editJobOfferTopMore, setEditJobOfferTopMore] = useState(false);



    // Universal method for rendering errors under given inputs, gets
    // field: key of error section like language
    // index of given item in state array like language[1]
    // errorKey: input field name
    // my array of errors


    const renderFieldErrorMultiple = (
        field: string, 
        index: number, 
        errorKey: string, 
        error: MultipleErrorResponse | undefined) => {
        if (error && error[field] && typeof error[field][index] === "object" && 
        error[field][index].hasOwnProperty(errorKey)) {
          const messages = error[field][index][errorKey];
          return (
            <div>
              {messages.map((message, i) => (
                <span key={i} className="text-danger">
                  {message}
                </span>
              ))}
            </div>
          );
        }
        return null;
      };


    // Universal get
    // setData: setter for my state
    // endpoint: endpoint
    // id: optional id of item in db

    const getData = async (
        setData: JobOfferGetDataFunction,
        endpoint: string,
        id?: number,
      ) => {
        let path = `${endpoint}`
        if (id){  
          path = `${endpoint}/${id}`
        }
        
          try{
              const response = await axios.get(path, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + String(authTokens.access),
                  },
                });
              if (setData) {
                  setData(response.data);
                }
              const data = response.data;
              
              if(response.status === 200){
              }
          }catch(error: any){
              const axiosError = error as AxiosError<ErrorResponse>;
              if (error.response && error.response.status === 401) {
                  // Unauthorized - Logout the user
                  logoutUser();
                }
              else if (error.response && (error.response.status !== 400)) {
                  setError(axiosError)
                  
              } 
              else {
                  
                  console.error('Error fetching profile:', error);
                  console.log(axiosError)
                  setError(axiosError);
                }
          }
        }

    const editData = async (
      state: JobOfferEditDataFunction,
      editField: React.Dispatch<React.SetStateAction<boolean>> | undefined,
      endpoint: string,
      errorField: string,
      index: number = 0,
    ) =>{
      console.log(state)
      try{
          const response = await axios.put(`${endpoint}`, state,  {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
            if (editField){
              editField(false)
            }
          
          removeMultipleErrors(`${errorField}`, index)
      }catch (error: any) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
        else if (error.response && (error.response.status !== 400)) {
          setError(axiosError)
        }
          removeMultipleErrors(`${errorField}`, index)
          
          if (axiosError.response?.data) {
            handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
          }
          console.log(error);
        }
    }

  const sendMultipleData = async (
    state: JobOfferEditDataFunction,
    editField: React.Dispatch<React.SetStateAction<boolean>>,
    setData: JobOfferGetDataFunction,
    cleanState: (() => void) | null = null,
    endpoint: string,
    errorField: string,
    index: number = 0,
  ) =>{
    
    console.log(state)
      try{
          const response = await axios.post(`${endpoint}`, state,  {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
            editField(false)

          removeMultipleErrors(`${errorField}`, index)
          getData(setData, `${endpoint}`);
          if (cleanState) cleanState()
      }catch (error: any) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
        else if (error.response && (error.response.status !== 400)) {
          setError(axiosError)
        }
        removeMultipleErrors(`${errorField}`, index)
          
          if (axiosError.response?.data) {
            handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
          }
          console.log(error);
        }
    }

  const deleteData = async (
    editField: React.Dispatch<React.SetStateAction<boolean[]>> | undefined,
    setData: JobOfferGetDataFunction,
    endpoint: string,
    id: number
  ) =>{
  try{
      const response = await axios.delete(`${endpoint}/delete/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
        });
        // set editFields to false => set state of that form to closed
        if (editField){
        editField((prevEditExperiences) => {
          const newEditExperiences = [...prevEditExperiences];
          newEditExperiences[id] = false;
          return newEditExperiences;
        });
      }
        getData(setData, `${endpoint}/${offerid}`);
        setAlertError('Data deleted successfully');
  }catch (error: any) {
    if (error.response && error.response.status === 401) {
      // Unauthorized - Logout the user
      logoutUser();
    }
      setAlertError('Something went wrong');

      console.log(error);
    }
}

    // For handling errors in correct inputs in correct places where are multiple items like work1 and work2
    const handleMultipleErrors = (key: string, index: number, errorData: ErrorResponse) => {
      setMultipleErrors((prevState) => ({
        ...prevState,
        [key]: {
          ...(prevState[key] || {}),
          [index]: {
            ...(prevState[key]?.[index] || {}),
            ...errorData
          }
        }
      }));
    };

    // For removing list of errors in given section
    const removeMultipleErrors = (key: string, index: number) => {
      setMultipleErrors((prevState) => ({
        ...prevState,
        [key]: {
          ...(prevState[key] || {}),
          [index]: {}
        }
      }));
    };
    


      // Handle hide interactive elements on cv for preview mode
    const handleHide = async () =>{
      const pageElement = document.getElementById('page');
      if (pageElement) {
        const elements = pageElement.querySelectorAll('button, svg, .profile-svgs, .prevHidden');
        
        elements.forEach((element) => {
          if (previewMode) {
            element.classList.add('d-none');
          } else {
            element.classList.remove('d-none');
          }
        });
      }
    }
    // for preview mode
    useEffect(() => {
      handleHide();
    }, [previewMode]);

    const handlePreviewMode = () => {
      let forms = document.querySelectorAll('form');

      if (forms.length >= 2){
        setAlertError('Close all forms in order to show preview');
        return false;
      }
      else{
        setPreviewMode(!previewMode);
        return true;
      }
      
    }


    // To make preview mode by removing most of interactive elements while looking at not owned joboffer
  const handleNotOwnedJobOffer = () =>{
    let pageElement = document.getElementById('page');
    let profStatus = document.getElementsByClassName('profileStatusHide');
    if (pageElement && jobOfferCompany?.username) {
      let elements = pageElement.querySelectorAll('button, svg, .profile-svgs, .prevHidden');
      let preview = document.getElementById('preview');
      // let correctedUsername = username.slice(0, -1);
      if (user.username !== jobOfferCompany?.username){
        console.log(elements)
        elements.forEach((element) =>{
          element.remove();
        });
        Array.from(profStatus).forEach((element) => {
          element.remove();
        });
        if (preview){
          preview.remove();
        }
        
        
      }
    }
    return null;
  }
    
// For fetching data
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);

      const steps = 2; // Total number of steps for loading bar
      let completedSteps = 0;

      const updateProgress = (completedSteps: number) => {
        completedSteps++;
        const newProgress = (completedSteps / steps) * 100;
        setProgress(newProgress);
      };

      const fetchDataAndUpdateProgress = async (setter: JobOfferGetDataFunction, endpoint: string) => {
        await getData(setter, endpoint);
        completedSteps++;
        updateProgress(completedSteps);
      };
      
      if (offerid){
       
      }
      await fetchDataAndUpdateProgress(setJobOfferCompany, `/company/joboffer/info/${offerid}`);
      await fetchDataAndUpdateProgress(setJobOfferTop, `/company/joboffer/top/${offerid}`);
      await fetchDataAndUpdateProgress(setJobOfferSkill, `/company/joboffer/skill/${offerid}`);
      await fetchDataAndUpdateProgress(setJobOfferTopMore, `/company/joboffer/topmore/${offerid}`)
      setIsLoading(false);
      
    };
    fetchData(); // Execute the data fetching function
    
  }, [offerid]);

  // works like useEffect but after rendering
  useLayoutEffect(() => {
    if (!isLoading) {
      handleNotOwnedJobOffer();
    }
  }, [isLoading]);
    
    if (isLoading) {
        return <Loading progress={progress} />
    }
    if (error){
        return <ErrorPage axiosError={error} />
    }
    
    // Job offer - will work as creator and view
    return(
      
      
        <>
        {alertError && <ProfileAlert 
                error={alertError}
                setError={setAlertError} />}
            <div>
              <div className='d-flex justify-content-center container my-1' id='preview'>
                <button className='btn btn-secondary w-100 rounded-4 mb-2' onClick={handlePreviewMode}>
                  {previewMode ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              <div id="page">
                {/* <h1>JOB OFFER</h1> */}
                {offerid ? (
                  <>
                    <div className='justify-content-center'>
                        <div className="jo-background-image z-0 " style={{backgroundImage: `url(${jobOfferCompany?.background_image})`}}/>
                    </div>
                    <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-n5 z-1">
                      <JobOfferTop
                        jobOfferCompany={jobOfferCompany}
                        jobOfferTop={jobOfferTop}
                        setJobOfferTop={setJobOfferTop}
                        getData={getData}
                        editData={editData}
                        multipleErrors={multipleErrors}
                        removeMultipleErrors={removeMultipleErrors}
                        renderFieldErrorMultiple={renderFieldErrorMultiple}
                        alertError={alertError}
                        setAlertError={setAlertError}
                        setEditJobOfferTop={setEditJobOfferTop}
                        editJobOfferTop={editJobOfferTop}
                        offerid={offerid}
                      />
                      <JobOfferTopMore
                        jobOfferTopMore={jobOfferTopMore}
                        setJobOfferTopMore={setJobOfferTopMore}
                        getData={getData}
                        editData={editData}
                        multipleErrors={multipleErrors}
                        removeMultipleErrors={removeMultipleErrors}
                        renderFieldErrorMultiple={renderFieldErrorMultiple}
                        alertError={alertError}
                        setAlertError={setAlertError}
                        setEditJobOfferTopMore={setEditJobOfferTopMore}
                        editJobOfferTopMore={editJobOfferTopMore}
                        offerid={offerid}
                    />

                    </div>
                    
                    <JobOfferSkill
                      jobOfferSkill={jobOfferSkill}
                      setJobOfferSkill={setJobOfferSkill}
                      setSingleJobOfferSkill={setSingleJobOfferSkill}
                      singleJobOfferSkill={singleJobOfferSkill}
                      setEditJobOfferSkill={setEditJobOfferSkill}
                      editJobOfferSkill={editJobOfferSkill}
                      getData={getData}
                      sendMultipleData={sendMultipleData}
                      multipleErrors={multipleErrors}
                      removeMultipleErrors={removeMultipleErrors}
                      renderFieldErrorMultiple={renderFieldErrorMultiple}
                      deleteData={deleteData}
                      previewMode={previewMode}
                      offerid={offerid}
                    />
                  </>
                
                ) :
                (
                    <div>
                        <h2>Creator view</h2>
                    </div>
                ) }
                </div>
            </div>
        </>
    )
}
export default JobOffer;