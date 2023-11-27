
import axios, { AxiosError } from "axios";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../utils/AuthProvider";
import DeleteModal from "../DeleteModal";
import { ErrorResponse } from "../Profile";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ProfileData } from "../Profile";
import { ApplicantData } from "./JobOfferAssessApplicationListing";

interface JobOfferAssessApplicationListingItemProps{
    data: ApplicantData;
}

const JobOfferAssessApplicationListingItem: React.FC<JobOfferAssessApplicationListingItemProps> = ({data}) =>{


    const navigate = useNavigate();
    const {authTokens, user, logoutUser } = useContext(AuthContext);
    const { id, job_offer, applicant, application_date, status} = data;
    const {offerid} = useParams()


    
    return(
   
         <div className="card shadow border-primary border-opacity-50 mb-4 container">
            
         <div className="row d-flex">
             <div className="col-auto d-sm-flex   align-items-center">
                 <img
                     src={applicant.profile_image}
                     alt="Profile"
                     className="card-img p-2 evaluate-listing-image"
                     style={{width:'150px', height:'150px'}}
                     
                 />
             </div>
             <div className="card-body col-auto">

                
             
                <h4 className="card-title link link-primary mb-1">
                {applicant.first_name && applicant.last_name
                    ? `${applicant.first_name} ${applicant.last_name}`
                    : 'No name provided'}
                </h4>
                <p className="card-text fw-medium">
                {applicant.current_position &&
                    applicant.current_position}
                </p>
                {applicant.date_of_birth && <p className='mb-2 mb-md-0'><b>Date of birth: </b><span className='d-inline-flex'>{applicant.date_of_birth}</span></p>}
                {applicant?.country || applicant?.city ? (
                                    <div className='d-flex flex-md-row flex-column'>
                                        <p className='mb-2 mb-md-0'>
                                            <b className='residence-label'>Place of residence: </b>
                                            <span className='d-inline-flex'>
                                                {applicant?.country ? (
                                                    <span className='d-inline'>{applicant?.country}{applicant?.city ? <>,&nbsp;</> : ' '}</span>
                                                ) : null}
                                                {applicant?.city ? (
                                                    <span className='d-inline'>{applicant?.city}</span>
                                                ) : null}
                                            </span>
                                        </p>
                                    </div>
                                ) : null}
                {/* <p className="card-text">{jobOffer.job_type}</p>
                {jobOffer.work_mode && <p className="card-text">{jobOffer.work_mode}</p>}
                {jobOffer.job_location && <p className="card-text">{jobOffer.job_location}</p>} */}
                {/* <p className="card-text">
                    Salary: {jobOffer.salary_min} - {jobOffer.salary_max} {jobOffer.salary_currency} {jobOffer.salary_type}
                </p>
                <p className="">
                    Published At: {new Date(jobOffer.job_published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                 </p> */}
                 
             </div>
             <hr className="border-primary mb-0"></hr>
             <div className="row">
                 {/* <div className="col-sm-5">
                     {formatRemainingTime(jobOffer.job_application_deadline)}
                 </div> */}
                 
                 <div className="col-sm-7 d-sm-flex d-block justify-content-between">
                 
                 {/* <p>Applicant count: {jobOffer.applicant_count}</p> */}
                 {status && 
                 <div className="d-flex align-items-center">
                 <svg className="me-1" width="18" height="18" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                     <path fill="#2266ff" fillRule="evenodd" d="M6 10a4 4 0 1 0 0-8a4 4 0 0 0 0 8zm0 2A6 6 0 1 0 6 0a6 6 0 0 0 0 12z" />
                 </svg>
                 <p>{status}</p>
             </div>
                 }
                 
                 
                 </div>
                 
             </div>
         </div>
        
     </div>
    )

}
export default JobOfferAssessApplicationListingItem;