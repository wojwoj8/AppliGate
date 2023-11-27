import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import JobOfferProfileListingItem from './JobOfferProfileListingItem';
import Loading from '../Loading';
import AuthContext from '../../utils/AuthProvider';
import ErrorPage from '../ErrorPage';
import { ErrorResponse } from '../Profile';
import { JobOfferListingData } from './JobOfferListing';
import Pagination from '../sharedComponents/Pagination';
import { PaginationData } from '../sharedComponents/Pagination';
import { useParams } from 'react-router-dom';

interface MyJobOffersData{
  username?: string | undefined
}



const MyJobOffers: React.FC<MyJobOffersData> = ({username}) => {
  
  const [jobOffers, setJobOffers] = useState<JobOfferListingData[]>([]);
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
  const { authTokens, user, logoutUser } = useContext(AuthContext);

   // Axios error for error component
   const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null)
  // Fetch job offer data from the backend
  const fetchJobOffers = async () => {
    try {

      let path = `${API_BASE_URL}/company/myJobOffers/${page}?page=${page}`
      
      const response = await axios.get(path ,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
      }
      );

      // console.log(response)
      
      const {results, ...rest} = response.data
      // console.log(rest)
     
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
          
        <h1>My JOB OFFERS </h1>
        {jobOffers && jobOffers.length ? (<>
          {jobOffers.map((jobOffer) => (
              
            <JobOfferProfileListingItem key={jobOffer.id}  userType={user.user_type} jobOffer={jobOffer} />

          ))}
        </>)
        : (
          <div>
              <h2>You don't have any listed Job Offers</h2>
          </div>
        )}
        
          
      </div>
    
      <Pagination data={data} page={page} url={'/company/myJobOffers/'}/>
      
    </>
  );
};

export default MyJobOffers;