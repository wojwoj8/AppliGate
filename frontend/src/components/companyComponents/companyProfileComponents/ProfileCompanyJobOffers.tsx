import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import JobOfferListingItem from '../../JobOffers/JobOfferListingItem';
import { Link } from 'react-router-dom';
import Loading from '../../Loading';
import AuthContext from '../../../utils/AuthProvider';
import ErrorPage from '../../ErrorPage';
import { ErrorResponse } from '../../Profile';
import { JobOfferListingExtendedData } from '../../JobOffers/JobOfferListing';

interface ProfileCompanyJobOffersData{
  username?: string | undefined
}



const ProfileCompanyJobOffers: React.FC<ProfileCompanyJobOffersData> = ({username}) => {
  const [jobOffers, setJobOffers] = useState<JobOfferListingExtendedData[]>([]);

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
      let path
      username ? (path = `/company/myJobOffers/${username}`) : ( path = `/company/myJobOffers`)

      const response = await axios.get(path ,{
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + String(authTokens.access),
          },
      }
      );
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
        
      <h1 className='text-center'>Listed Job Offers </h1>
      {jobOffers && jobOffers.length ? (<ul>
        {jobOffers.map((jobOffer) => (
            // <Link to={`/company/joboffer/${jobOffer.id}`} key={jobOffer.id} style={{textDecoration:"none"}}>
                <JobOfferListingItem key={jobOffer.id}  jobOffer={jobOffer} />
            // </Link>
        ))}
      </ul>)
      : (
        <div>
            <h2>You don't have any listed Job Offers</h2>
        </div>
      )}
      

    </div>
  );
};

export default ProfileCompanyJobOffers;