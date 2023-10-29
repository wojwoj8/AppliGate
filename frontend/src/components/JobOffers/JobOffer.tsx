import { ErrorResponse, MultipleErrorResponse } from "../Profile";
import { JobOfferListingData } from "./JobOfferListing";
import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { Link, useParams } from 'react-router-dom';
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


  
const JobOffer: React.FC = () =>{
    const { id } = useParams();

    const [jobOfferCompany, setJobOfferCompany] = useState<JobOfferCompanyData>();
    const [jobOffers, setJobOffers] = useState<JobOfferListingData>();
    
    // for loading
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    
    // Authtoken for CRUD and user for username and logout
    const { logoutUser, authTokens } = useContext(AuthContext);
    
        // Axios error for error component
        const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null)
    
    // Fetch job offer data from the backend
    const fetchJobOffer = async () => {
        let path = `/company/joboffer`
        if (id){  
        path = `/company/joboffer/${id}`
      }
        try {
        const response = await axios.get(path,{
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
            },
        });
        setJobOfferCompany(response.data);
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
            
            console.error('Error fetching data:', error);
            console.log(axiosError)
            setError(axiosError);
            }
    }
    };
    useEffect(() => {
        const fetchData = async () =>{
            setIsLoading(true);
            setProgress(50);
            await fetchJobOffer();
            setProgress(100);
            setIsLoading(false);
        }
        fetchData();
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
                <h1>JOB OFFER</h1>
                {id ? (<div className='row justify-content-center '>
                    <div>
                        <img src={jobOfferCompany?.background_image} className="img-img-fluid" alt="companyBackground"></img>
                        </div>
                    
                        <img src={jobOfferCompany?.profile_image} alt="logo" style={{height: "200px", width:"200px"}}></img>
                        
                        <p>{jobOfferCompany?.first_name}</p>
                        <p>{jobOfferCompany?.country}</p>
                        <p>{jobOfferCompany?.city}</p>
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