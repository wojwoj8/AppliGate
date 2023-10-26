import React, { useState, useEffect } from 'react';
import axios from 'axios';
import JobOfferListingItem from './JobOfferListingItem';
import { Link } from 'react-router-dom';
import Loading from '../Loading';

export interface JobOfferInterface {
  id: number;
  profile_image: string;
  first_name: string;
  background_image: string;
  title: string;
  job_location: string;
  salary_min: string;
  salary_max: string;
  salary_description: string;
  job_description: string;
  salary_currency: string;
  job_published_at: string;
  job_application_deadline: string;
  job_type: string;
}

const JobOfferListing: React.FC = () => {
  const [jobOffers, setJobOffers] = useState<JobOfferInterface[]>([]);

  // for loading
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Fetch job offer data from the backend
  const fetchJobOffers = async () => {
    try {
      const response = await axios.get('/company/jobofferlistings');
      setJobOffers(response.data);
    } catch (error) {
      console.error('Error fetching job offers:', error);
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
//   if (error){
//     return <ErrorPage axiosError={error} />
//   }
  return (
    <div className='container-fluid'>
        
      <h1>JOB OFFER LISTING</h1>
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