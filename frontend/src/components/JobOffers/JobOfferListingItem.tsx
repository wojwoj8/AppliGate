import { JobOfferListingExtendedData } from "./JobOfferListing";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
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

    const nav = useNavigate();

    return (
        <div className="card shadow border-primary border-opacity-50 mb-4 container cursor-pointer" onClick={() => nav(`/company/joboffer/${jobOffer.id}`)}>
            {/* <Link to={`/company/joboffer/${jobOffer.id}`} className="text-decoration-none"> */}
            <div className="text-decoration-none">
                <div className="row d-flex flex-nowrap">
                    <div className="col-auto d-md-flex  d-none">
                        <img
                            src={jobOffer.profile_image}
                            alt="Background"
                            className="card-img p-2 job-listing-icon"
                            
                        />
                    </div>
                    <div className="card-body pt-1 pb-0 col-auto">

                        
                        <h4 className="card-title link link-primary mb-1">{jobOffer.title}</h4>
                        {jobOffer.work_mode && <p className="fw-semibold">{jobOffer.work_mode}</p>}
                        {jobOffer.job_location && <p className=""><b>Company location:</b> {jobOffer.job_location}</p>}
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
                        <div className="row row-cols-auto fst-italic">
                            {jobOffer.position_level && (
                                <div className="col">
                                    <p className="text-nowrap">{jobOffer.position_level}</p>
                                </div>
                            )}
                            {jobOffer.work_schedule && (
                                <div className="col">
                                    <p className="text-nowrap">{jobOffer.work_schedule}</p>
                                </div>
                            )}
                            {jobOffer.contract_type && (
                                <div className="col">
                                    <p className="text-nowrap">{jobOffer.contract_type}</p>
                                </div>
                            )}
                            {jobOffer.vacancy && (
                                <div className="col">
                                    <p className="text-nowrap">{jobOffer.vacancy}</p>
                                </div>
                            )}
                            {jobOffer.recruitment_type && (
                                <div className="col">
                                    <p className="text-nowrap">Rectuitment: {jobOffer.recruitment_type}</p>
                                </div>
                            )}
                            {jobOffer.specialization && (
                                <div className="col">
                                    <p className="text-nowrap">{jobOffer.specialization}</p>
                                </div>
                            )}
                        </div>


                        
                        
                        
                        
                    </div>
                </div>
                <hr className="border-primary my-1 col-12"></hr>
                <div className="row d-flex justify-content-end align-items-center justify-content-between">
                    <div className="col-auto d-flex  d-md-none">
                            <img
                                src={jobOffer.profile_image}
                                alt="Background"
                                className="card-img p-2 job-listing-icon"
                                
                            />
                        </div>
                    <div className="col-auto ">
                        
                        <p className="fw-light text-secondary">
                            Published At: {new Date(jobOffer.job_published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                    </div>
                    
                    {/* <div className="col-md-5">
                        {formatRemainingTime(jobOffer.job_application_deadline)}
                    </div>
                    <div className="col-md-7 d-md-flex d-block justify-content-between">
                    <p>Applicant count: {jobOffer.applicant_count}</p>
                    {jobOffer.status && <span>{jobOffer.status}</span>}
                    </div> */}
                </div>
            </div>
            {/* </Link> */}
        </div>
    );
  };
export default JobOfferListingItem;