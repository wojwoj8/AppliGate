import { JobOfferListingData } from "./JobOfferListing";
import { Link } from "react-router-dom";
interface JobOfferListingItemProps {
    jobOffer: JobOfferListingData;
  }
  
  const formatRemainingTime = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();

    const timeDifference = (deadlineDate as any) - (currentDate as any);
    if (timeDifference > 0){
        return(
            <p className="card-text">
                Application Deadline: {new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
        )
    } else{
        return(
           
            <p className="card-text">
                Expired: {new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
            
        )
    }
}


  const JobOfferListingItem: React.FC<JobOfferListingItemProps> = ({ jobOffer }) => {
    return (
<div className="card mb-4">
    <div className="row d-flex flex-shrink-1">
        <div className="col-sm-4">
        <img
            src={jobOffer.profile_image}
            alt="Background"
            className="card-img job-listing-icon p-4"
            
        />
        </div>
        <div className="card-body col-auto">
           
                <h5 className="card-title">{jobOffer.title}</h5>
                <p className="card-text">{jobOffer.first_name}</p>
                <p className="card-text">{jobOffer.job_type}</p>
                {jobOffer.work_mode && <p className="card-text">{jobOffer.work_mode}</p>}
                {jobOffer.job_location && <p className="card-text">{jobOffer.job_location}</p>}
                <p className="card-text">
                    Salary: {jobOffer.salary_min} - {jobOffer.salary_max} {jobOffer.salary_currency} {jobOffer.salary_type}
                </p>
                <p className="">
                    Published At: {new Date(jobOffer.job_published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
            
        </div>
        <div className="col-md-12 d-flex justify-content-between">
            {formatRemainingTime(jobOffer.job_application_deadline)}
            <p>Applicant count: {jobOffer.applicant_count}</p>
            {jobOffer.status && <span>Status: {jobOffer.status}</span>}
        </div>
    </div>
</div>
    );
  };
export default JobOfferListingItem;