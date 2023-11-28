import React, { createContext, useContext, ReactNode } from 'react';
import { JobOfferListingData } from '../JobOfferListing';

interface JobOfferContextProps {
    jobOffer: JobOfferListingData | null;
    setJobOffer: React.Dispatch<React.SetStateAction<JobOfferListingData | null>>;
  }
  
  const JobOfferContext = createContext<JobOfferContextProps | undefined>(undefined);
  
  export const JobOfferProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [jobOffer, setJobOffer] = React.useState<JobOfferListingData | null>(null);
  
    return (
      <JobOfferContext.Provider value={{ jobOffer, setJobOffer }}>
        {children}
      </JobOfferContext.Provider>
    );
  };
  
  export const useJobOfferContext = () => {
    const context = useContext(JobOfferContext);
    if (!context) {
      throw new Error('useJobOfferContext must be used within an JobOfferProvider');
    }
    return context;
  };