
import axios, { AxiosError } from "axios";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../utils/AuthProvider";
import DeleteModal from "../DeleteModal";
import { ErrorResponse } from "../Profile";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ProfileData } from "../Profile";
import { ApplicantData } from "./JobOfferAssessApplicationListing";
import { Link } from "react-router-dom";

interface JobOfferAssessApplicationListingItemProps{
    data: ApplicantData;
}

const JobOfferAssessApplicationListingItem: React.FC<JobOfferAssessApplicationListingItemProps> = ({data}) =>{


    const navigate = useNavigate();
    const {authTokens, user, logoutUser } = useContext(AuthContext);
    const { id, job_offer, applicant, application_date, status, user_username} = data;
    const {offerid} = useParams()


    
    return(
        <>
       
        
            <div className="card shadow border-primary border-opacity-50 mb-4 container">
            <Link to={`/company/joboffer/applicant/${user_username}` } style={{textDecoration:"none", color:"inherit"}}>
                <div>

                
                <div className="row d-flex">
                    <div className="col-auto d-md-flex  d-none">
                            <img
                                src={applicant.profile_image}
                                alt="Profile"
                                className="card-img pt-1 job-listing-icon"
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
                        
                            
                    </div>
                
                </div>
                <hr className="border-primary mb-0"></hr>
                <div className="row">
                
                    <div className="col-12 d-flex d-block justify-content-between">

                        {status && 
                        <div className="d-flex align-items-center">
                            <svg className="me-1" width="18" height="18" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                                <path 
                                fill={status === 'pending' ? 'blue' : status === 'approved' ? '#10B981' : 'red'} 
                                fillRule="evenodd" d="M6 10a4 4 0 1 0 0-8a4 4 0 0 0 0 8zm0 2A6 6 0 1 0 6 0a6 6 0 0 0 0 12z" />
                            </svg>
                            <p>{status}</p>
                        </div>
                        }
                        <div className="col-auto d-flex  d-md-none">
                            <img
                                src={applicant.profile_image}
                                alt="Background"
                                className="card-img p-1 job-listing-icon"
                                
                            />
                        </div>
                        
                    </div>
                        
                </div>
            </div>
            </Link>
            </div>
        
    </>
    )

}
export default JobOfferAssessApplicationListingItem;