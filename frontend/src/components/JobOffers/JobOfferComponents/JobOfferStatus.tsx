import { JobOfferGetDataFunction, JobOfferEditDataFunction , JobOfferEditMultipleDataFunction } from "../JobOffer";
import { JobOfferStatusData } from "../JobOffer";

interface ProfileCompanyStatusInterface{
    jobOfferStatus: JobOfferStatusData | null;
    setJobOfferStatus: React.Dispatch<React.SetStateAction<JobOfferStatusData | null>>;
    getData: (
        setData: JobOfferGetDataFunction,
        endpoint: string
        ) => void;
    editData: (state: JobOfferEditDataFunction ,
        editField: React.Dispatch<React.SetStateAction<boolean>> | undefined, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    alertError: string;
    setAlertError: React.Dispatch<React.SetStateAction<string>>
    offerid: string;
}

const JobOfferStatus: React.FC<ProfileCompanyStatusInterface> = ({jobOfferStatus, setJobOfferStatus, getData, 
    editData, alertError, setAlertError, offerid}) => {
    
        const changeJobOfferStatus = async () => {
            const updatedJobOfferStatus = {
              ...jobOfferStatus!,
              job_offer_status: !jobOfferStatus?.job_offer_status,
            };
        
            await setJobOfferStatus(updatedJobOfferStatus);
        
            if (updatedJobOfferStatus.job_offer_status === false) {
              setAlertError('JobOffer Changed to not listed, nobody can see that job offer success');
            } else {
              setAlertError('JobOffer Changed to listed, now everone can see and applay for that job offer success');
            }
        
            editData(updatedJobOfferStatus, undefined, `/company/joboffer/jobofferstatus/${offerid}`, 'jobOfferStatus');
          };

    return(
        <div className='container prevHidden'>
            {jobOfferStatus && jobOfferStatus?.job_offer_status === true ? (
                <button className='btn btn-danger w-100 rounded-4 mt-3' onClick={changeJobOfferStatus}>Set JobOffer to Not listed</button>) : 
            (
                <button className='btn btn-danger w-100 rounded-4 mt-3' onClick={changeJobOfferStatus}>Set Profile to Listed</button>
            ) }
            
        </div>
    )
}
export default JobOfferStatus;