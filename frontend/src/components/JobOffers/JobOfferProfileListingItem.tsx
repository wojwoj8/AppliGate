import { JobOfferListingData } from "./JobOfferListing";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface JobOfferProfileListingItemProps {
    jobOffer: JobOfferListingData;
    userType?: string
  }
  
  const formatRemainingTime = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();

    const timeDifference = (deadlineDate as any) - (currentDate as any);
    if (timeDifference > 0){
        return(
            <p className="card-text">
                Deadline: {new Date(deadline).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
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


  const JobOfferProfileListingItem: React.FC<JobOfferProfileListingItemProps> = ({ jobOffer, userType }) => {

    const nav = useNavigate();
    

    return (
        <div className="card shadow border-primary border-opacity-50 mb-4 container">
            
            <div className="row d-flex">
                <div className="col-sm-4 d-sm-flex d-none align-items-center">
                    <img
                        src={jobOffer.profile_image}
                        alt="Background"
                        className="card-img p-2"
                        style={{width:'150px', height:'150px'}}
                        
                    />
                </div>
                <div className="card-body col-auto">

                    <Link to={`/company/joboffer/${jobOffer.id}`}  style={{textDecoration:"none"}}>
                        <h5 className="card-title">{jobOffer.title}</h5>
                    </Link>
                    {userType === 'company' &&
                        <button className="btn btn-primary" onClick={() => nav(`/company/joboffer/applicants/${jobOffer.id}`)}>
                            Evaluate applications
                        </button>
                    }
                    <p className="card-text">{jobOffer.first_name}</p>
                    <p className="card-text">{jobOffer.job_type}</p>
                    {jobOffer.work_mode && <p className="card-text">{jobOffer.work_mode}</p>}
                    {jobOffer.job_location && <p className="card-text">{jobOffer.job_location}</p>}
                    {/* <p className="card-text">
                        Salary: {jobOffer.salary_min} - {jobOffer.salary_max} {jobOffer.salary_currency} {jobOffer.salary_type}
                    </p>
                    <p className="">
                        Published At: {new Date(jobOffer.job_published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p> */}
                    
                </div>
                <hr className="border-primary mb-0"></hr>
                <div className="row">
                    <div className="col-sm-5">
                        {formatRemainingTime(jobOffer.job_application_deadline)}
                    </div>
                    
                    <div className="col-sm-7 d-sm-flex d-block justify-content-between">
                    
                    <p>Applicant count: {jobOffer.applicant_count}</p>
                    {jobOffer.status && 
                    <div className="d-flex align-items-center">
                    <svg className="me-1" width="18" height="18" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#2266ff" fillRule="evenodd" d="M6 10a4 4 0 1 0 0-8a4 4 0 0 0 0 8zm0 2A6 6 0 1 0 6 0a6 6 0 0 0 0 12z" />
                    </svg>
                    <p>{jobOffer.status}</p>
                </div>
                    }
                    
                    
                    </div>
                    
                </div>
            </div>
           
        </div>
    );
  };
export default JobOfferProfileListingItem;