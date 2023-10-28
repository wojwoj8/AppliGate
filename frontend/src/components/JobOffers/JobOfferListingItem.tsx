import { JobOfferListingData } from "./JobOfferListing";
interface JobOfferListingItemProps {
    jobOffer: JobOfferListingData;
  }
  
  const JobOfferListingItem: React.FC<JobOfferListingItemProps> = ({ jobOffer }) => {
    return (
        <div className="card mb-4">
            <div className="row">
                {/* <div className="col-md-3">
                    <img src={jobOffer.background_image} alt="Background" className="card-img" />
                </div> */}
                <div className="col-md-3">
                    <img src={jobOffer.profile_image} alt="Background" className="card-img" style={{height: "200px"}} />
                </div>
                <div className="col-md-6">
                    <div className="card-body">
                        <h5 className="card-title">{jobOffer.title}</h5>
                        <p className="card-text">{jobOffer.first_name}</p>
                        <p className="card-text">{jobOffer.job_type}</p>
                        
                        <p className="card-text">{jobOffer.job_location}</p>
                        <p className="card-text">
                            Salary: {jobOffer.salary_min} - {jobOffer.salary_max} {jobOffer.salary_currency} {jobOffer.salary_description}
                        </p>
                        {/* <p className="card-text">{jobOffer.job_description}</p> */}
                        <p className="card-text">
                            Published At: {new Date(jobOffer.job_published_at).toLocaleString()}
                        </p>
                        <p className="card-text">
                            Application Deadline: {new Date(jobOffer.job_application_deadline).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
  };
export default JobOfferListingItem;