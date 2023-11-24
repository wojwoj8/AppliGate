import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import JobOfferListingItem from './JobOfferListingItem';
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import AuthContext from '../../utils/AuthProvider';
import ErrorPage from '../ErrorPage';
import { ErrorResponse } from '../Profile';

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
}

const JobOfferListing: React.FC = () => {
  const [jobOffers, setJobOffers] = useState<JobOfferListingData[]>([]);

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
      const response = await axios.get('/company/jobofferlistings',{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
      });

      setJobOffers(response.data);
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
  }, []);

  if (isLoading) {
    return <Loading progress={progress} />
  }
  if (error){
    return <ErrorPage axiosError={error} />
  }
  return (
    <div className='container-fluid'>
        
      <h1>ALL JOB OFFERS LISTING</h1>
      <ul>
        {jobOffers.map((jobOffer) => (
            <Link to={`/company/joboffer/${jobOffer.id}`} key={jobOffer.id} style={{textDecoration:"none"}}>
                <JobOfferListingItem  jobOffer={jobOffer} />
            </Link>
        ))}
      </ul>

    </div>
  );
};

export default JobOfferListing;