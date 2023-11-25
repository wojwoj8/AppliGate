import { JobOfferListingExtendedData } from "./JobOfferListing";
import { Link } from "react-router-dom";
interface JobOfferListingItemProps {
    jobOffer: JobOfferListingExtendedData;
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
        <div className="card shadow border-primary border-opacity-50 mb-4 container">
            <div>
                <div className="row d-flex flex-nowrap">
                    <div className="col-auto d-sm-flex  d-none">
                        <img
                            src={jobOffer.profile_image}
                            alt="Background"
                            className="card-img p-2 job-listing-icon"
                            
                        />
                    </div>
                    <div className="card-body pt-1 pb-0 col-auto">

                        
                        <h4 className="card-title link-primary">{jobOffer.title}</h4>
                        
                        <p className="card-text">
                            <b>
                                {jobOffer.salary_min} - {jobOffer.salary_max} {jobOffer.salary_currency} ({jobOffer.salary_type})
                            </b>
                        </p>
                        <p className="card-text fw-medium">{jobOffer.first_name}</p>
                        
                        {jobOffer.skills && jobOffer.skills[0] &&
                            <div className='row flex mt-2 mb-2 row-gap-2 column-gap-2 container'>
                                {jobOffer.skills.map((jobOfferSkill, index) => (
                                    <div key={index} className='col-auto p-0'>
                                        <div style={{padding: "0.25rem 0.5rem 0.25rem 0.5rem", fontSize: "0.85rem"}} className='profile-skill text-white bg-secondary rounded-4 d-flex align-items-center'>
                                            <p className='mb-0'>{jobOfferSkill?.skill || ''}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                        <div className="row fst-italic d-flex">
                        
                            <ul className="col-auto d-inline-block">
                            {jobOffer.position_level && <span className="m"> {jobOffer.position_level}</span >}
                                {jobOffer.work_schedule && <li className=""> {jobOffer.work_schedule}</li>}
                                {jobOffer.contract_type && <li className=""> {jobOffer.contract_type}</li>}
                                {jobOffer.work_schedule && <li className=""> {jobOffer.work_schedule}</li>}
                            </ul>
                            
                            
                        </div>


                        {jobOffer.job_type && <p className="card-text">{jobOffer.job_type}</p>}
                        {jobOffer.work_mode && <p className="card-text">{jobOffer.work_mode}</p>}
                        {jobOffer.job_location && <p className="card-text">{jobOffer.job_location}</p>}
                        
                        
                    </div>
                </div>
                <hr className="border-primary my-1 col-12"></hr>
                <div className="row d-flex justify-content-end">
                    <div className="col-auto">
                        <p className="fw-light text-secondary">
                            Published At: {new Date(jobOffer.job_published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    
                    {/* <div className="col-sm-5">
                        {formatRemainingTime(jobOffer.job_application_deadline)}
                    </div>
                    <div className="col-sm-7 d-sm-flex d-block justify-content-between">
                    <p>Applicant count: {jobOffer.applicant_count}</p>
                    {jobOffer.status && <span>{jobOffer.status}</span>}
                    </div> */}
                </div>
            </div>
           
        </div>
    );
  };
export default JobOfferListingItem;