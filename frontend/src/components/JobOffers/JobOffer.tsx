import { ErrorResponse, MultipleErrorResponse } from "../Profile";
import { JobOfferListingData } from "./JobOfferListing";
import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { Link, useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import Loading from '../Loading';
import AuthContext from '../../utils/AuthProvider';
import ErrorPage from '../ErrorPage';

// make mulitple interfaces for easier crud
// should make one for immutable company data
interface JobOfferCompanyData {
    first_name: string;
    // last_name: string;
    // date_of_birth: string;
    country: string;
    city: string;
    // current_position: string;
    profile_image: string;
    background_image: string;   
}

interface JobOfferTopData {
    title: string;
    salary_min: number;
    salary_max: number;
    salary_description: string;
    salary_currency: string;
}

interface JobOfferData {
    company: string;
    title: string;
    job_description: string;
    job_location: string;
    job_type: string;
    salary_min: number;
    salary_max: number;
    salary_description: string;
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
  
interface JobOfferSkillData {
    id: number;
    skill: string;
  }

// SIMPLIFICATION OF MY GetDataFunction TYPE BECAUSE OF ERROR
//one data
type UpdateFunction<T> = React.Dispatch<React.SetStateAction<T | null>>;
//array of data
type ArrayUpdateFunction<T> = React.Dispatch<React.SetStateAction<T[]>>;


export type GetDataFunction =
  | UpdateFunction<JobOfferCompanyData>
  | UpdateFunction<JobOfferTopData>
//   | ArrayUpdateFunction<ExperienceData>
  | undefined;
  //UNIVERSAL PUT STATES
  //single data
export type JobOfferEditDataFunction = 
    JobOfferCompanyData | null |
    JobOfferTopData | null |
    
    undefined;
// multiple data
// export type JobOfferEditMultipleDataFunction = 
//     ExperienceData[] |
//     EducationData[] |
//     CourseData[] |
//     LanguageData[] |
//     LinkData[] |
//     SkillData[] 
//     ;
const initialMultipleErrors: MultipleErrorResponse = {
    salary: {},
  };

  
    
const JobOffer: React.FC = () =>{
    const params = useParams();
    const id = params['id'];
    console.log(id)

    const [jobOfferCompany, setJobOfferCompany] = useState<JobOfferCompanyData| null>(null);
    const [jobOfferTop, setJobOfferTop] = useState<JobOfferTopData| null>(null);

    
    const [jobOffers, setJobOffers] = useState<JobOfferListingData| null>(null);
    
    // for loading
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    
    // Authtoken for CRUD and user for username and logout
    const { logoutUser, authTokens } = useContext(AuthContext);
    
    // Axios error for error component
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null)



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
        setData: GetDataFunction,
        endpoint: string,
        id?: number,
      ) => {
        let path = `${endpoint}`
        if (id && id !== undefined){  
          path = `${endpoint}/${id}`
          console.log(`${id}`)
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
                console.log(data)
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

      const fetchDataAndUpdateProgress = async (setter: GetDataFunction, endpoint: string) => {
        await getData(setter, endpoint);
        completedSteps++;
        updateProgress(completedSteps);
      };
      console.log(`test, id:${id}`)
      if (id){
        await fetchDataAndUpdateProgress(setJobOfferCompany, `/company/joboffer/${id}`);
        await fetchDataAndUpdateProgress(setJobOfferTop, `/company/joboffer/top/${id}`);
      }
      
      setIsLoading(false);
      
    };
    fetchData(); // Execute the data fetching function
    
  }, [id]);
    
    if (isLoading) {
        return <Loading progress={progress} />
    }
    if (error){
        return <ErrorPage axiosError={error} />
    }
   
    // Job offer - will work as creator and view
    return(
        <>
            <div>
                {/* <h1>JOB OFFER</h1> */}
                {id ? (
                
                    <div className='justify-content-center'>
                        <div className="jo-background-image z-0 " style={{backgroundImage: `url(${jobOfferCompany?.background_image})`}}>
                    </div>
                        
                    <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-n5 z-1" id="page">
                        <div className='bg-black row mb-0 rounded-top-2'>
                            <p className='fs-3 fw-semibold text-white col mb-1'></p>
                            <div className='col-auto d-flex align-items-center previewHidden'>
                                <div className='profile-svgs d-flex my-1'>
                                {/* <div className='profile-svgs d-flex my-1' onClick={editProfile}> */}
                                    <Icon className='text-white' path={mdiPencil} size={1.25} />
                                </div>
                            </div>
                        </div>
                            <img src={jobOfferCompany?.profile_image} alt="logo" style={{height: "150px", width:"150px"}}></img>
                            
                            <p>{jobOfferCompany?.first_name}</p>
                            <p>{jobOfferCompany?.country}</p>
                            <p>{jobOfferCompany?.city}</p>
                        </div>
                    </div>
                
                ) :
                (
                    <div>
                        <h2>Creator view</h2>
                    </div>
                ) }
                
            </div>
        </>
    )
}
export default JobOffer;