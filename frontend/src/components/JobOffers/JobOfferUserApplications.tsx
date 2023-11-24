import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import JobOfferListingItem from './JobOfferListingItem';
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import AuthContext from '../../utils/AuthProvider';
import ErrorPage from '../ErrorPage';
import { ErrorResponse } from '../Profile';
import { JobOfferListingData } from './JobOfferListing';



const JobOfferUserApplications: React.FC = () => {
  const [jobOffers, setJobOffers] = useState<JobOfferListingData[]>([]);

  // for loading
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Authtoken for CRUD and user for username and logout
  const { authTokens, logoutUser } = useContext(AuthContext);

   // Axios error for error component
   const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null)
  // Fetch job offer data from the backend
  const fetchJobOffers = async () => {
    try {
      let path = `/applications`

      const response = await axios.get(path ,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
      }
      );
      // console.log(response.data)
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
        
      <h1>Job Offers that you applied for</h1>
      {jobOffers[0] ? (<ul>
        {jobOffers.map((jobOffer) => (
            <Link to={`/company/joboffer/${jobOffer.id}`} key={jobOffer.id} style={{textDecoration:"none"}}>
                <JobOfferListingItem  jobOffer={jobOffer} />
            </Link>
        ))}
      </ul>)
      : (
        <div>
            <h2>You didn't apply to any job offer yet</h2>
        </div>
      )}
      

    </div>
  );
};

export default JobOfferUserApplications;