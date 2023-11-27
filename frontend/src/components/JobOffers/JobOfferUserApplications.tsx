import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import JobOfferProfileListingItem from './JobOfferProfileListingItem';
import { Link } from 'react-router-dom';
import Loading from '../Loading';
import AuthContext from '../../utils/AuthProvider';
import ErrorPage from '../ErrorPage';
import { ErrorResponse } from '../Profile';
import { JobOfferListingData } from './JobOfferListing';
import { useParams } from 'react-router-dom';
import Pagination from '../sharedComponents/Pagination';
import { PaginationData } from '../sharedComponents/Pagination';



const JobOfferUserApplications: React.FC = () => {
  const API_BASE_URL = 'http://localhost:8000';
  const [jobOffers, setJobOffers] = useState<JobOfferListingData[]>([]);
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
  const { authTokens, user, logoutUser } = useContext(AuthContext);

   // Axios error for error component
   const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null)
  // Fetch job offer data from the backend
  const fetchJobOffers = async () => {
    try {

      let path = `${API_BASE_URL}/applications/${page}?page=${page}`
      
      const response = await axios.get(path ,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
      }
      );
      
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

  const fetchData = async () =>{
      
    setIsLoading(true);
    setProgress(50);
    await fetchJobOffers();
    setProgress(100);
    setIsLoading(false);
}

  useEffect(() => {
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
        
      <h1>Job Offers that you applied for</h1>
      {jobOffers && jobOffers.length ? (<>
        {jobOffers.map((jobOffer) => (
            
                <JobOfferProfileListingItem key={jobOffer.id} userType={user.user_type}  jobOffer={jobOffer} />

        ))}
      </>)
      : (
        <div>
            <h2>You didn't apply to any job offer yet</h2>
        </div>
      )}
      
      
    </div>
    
      <Pagination data={data} page={page} url={'/applications/'}/>
    </>
  );
};

export default JobOfferUserApplications;