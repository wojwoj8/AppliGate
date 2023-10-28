import { ErrorResponse, MultipleErrorResponse } from "../Profile";

interface JobOfferData {
    company: string;
    title: string;
    job_description: string;
    job_location: string;
    job_type: string;
    salary_min: number;
    salary_max: number;
    salary_description: string;
    salary_currency: string;
    job_responsibilities: string;
    job_requirements: string;
    job_published_at: Date;
    job_application_deadline: Date;
    recruitment_type: string;
    application_process: string;
    job_benefits: string;
    job_additional_information: string;
    skills: string[];
  }
  
  interface JobOfferSkillData {
    id: number;
    skill: string;
  }
  
const JobOffer: React.FC = () =>{

    // Job offer - will work as creator and view
    return(
        <div>
            <h1>JOB OFFER</h1>
        </div>
    )
}
export default JobOffer;