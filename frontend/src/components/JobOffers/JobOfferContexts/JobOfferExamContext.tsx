import React, { createContext, useContext, ReactNode } from 'react';
import { JobOfferExamData } from '../JobOffer';


interface JobOfferExamContextProps {
    jobOfferExamData: JobOfferExamData | null;
    setJobOfferExamData: React.Dispatch<React.SetStateAction<JobOfferExamData | null>>;
  }
  
  const JobOfferExamContext = createContext<JobOfferExamContextProps | undefined>(undefined);
  
  export const JobOfferExamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [jobOfferExamData, setJobOfferExamData] = React.useState<JobOfferExamData | null>(null);
  
    return (
      <JobOfferExamContext.Provider value={{ jobOfferExamData, setJobOfferExamData }}>
        {children}
      </JobOfferExamContext.Provider>
    );
  };
  
  export const useJobOfferExamContext = () => {
    const context = useContext(JobOfferExamContext);
    if (!context) {
      throw new Error('useJobOfferExamContext must be used within an JobOfferProvider');
    }
    return context;
  };