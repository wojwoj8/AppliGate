import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import JobOfferListingItem from './JobOfferListingItem';
import { Link, useParams } from 'react-router-dom';
import Loading from '../Loading';
import AuthContext from '../../utils/AuthProvider';
import ErrorPage from '../ErrorPage';
import { ErrorResponse } from '../Profile';
import { JobOfferSkillData } from './JobOffer';
import Pagination from '../sharedComponents/Pagination';
import { PaginationData } from '../sharedComponents/Pagination';

export interface JobOfferListingData {
  id: number;
  profile_image: string;
  first_name: string;
  background_image: string;
  title: string;
  job_location: string;
  salary_min: string;
  salary_max: string;
  salary_type: string;
  job_description: string;
  salary_currency: string;
  job_published_at: string;
  job_application_deadline: string;
  job_type: string;
  applicant_count: number;
  status: string;
  work_mode: string;
}

export interface JobOfferListingExtendedData {
  id: number;
  profile_image: string;
  first_name: string;
  background_image: string;
  title: string;
  job_location: string;
  salary_min: string;
  salary_max: string;
  salary_type: string;
  job_description: string;
  salary_currency: string;
  job_published_at: string;
  job_application_deadline: string;
  work_mode: string;
  work_schedule: string;
  applicant_count: number;
  status: string;
  recruitment_type: string;
  position_level: string;
  contract_type: string;
  vacancy: string;
  specialization: string;
  job_type: string;
  skills: JobOfferSkillData[];
  city: string;
  country: string;
  
}

const JobOfferListing: React.FC = () => {
  const [jobOffers, setJobOffers] = useState<JobOfferListingExtendedData[]>([]);
  const API_BASE_URL = 'http://localhost:8000';
  const [data, setData]= useState<PaginationData>({
    count: null,
    next: "",
    previous: ""
  });

  const { page } = useParams();
  // for loading
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  // Authtoken for CRUD and user for username and logout
  const { logoutUser, authTokens } = useContext(AuthContext);

   // Axios error for error component
   const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null)

  // Fetch job offer data from the backend
  const fetchJobOffers = async () => {
    try {

      let path = `${API_BASE_URL}/jobofferlistings/${page}?page=${page}`
      
      const response = await axios.get(path ,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
      }
      );
      // console.log(response.data)
      const {results, ...rest} = response.data
     
      setData(rest)
      setJobOffers(results);
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
        await fetchJobOffers();
        setProgress(100);
        setIsLoading(false);
    }
    fetchData();
  }, [page]);

  if (isLoading) {
    return <Loading progress={progress} />
  }
  if (error){
    return <ErrorPage axiosError={error} />
  }
  return (
    <>
    
    <div className='container-fluid'>
        
      <h1>All Job offers</h1>
      {jobOffers && jobOffers.length ? (<>
        {jobOffers.map((jobOffer) => (
            
                <JobOfferListingItem key={jobOffer.id}  jobOffer={jobOffer} />

        ))}
      </>)
      : (
        <div>
            <h2>There is no active job offer :(</h2>
        </div>
      )}
      
      
    </div>
    
      <Pagination data={data} page={page} url={'/jobofferlistings/'}/>
    </>
  );
};

export default JobOfferListing;