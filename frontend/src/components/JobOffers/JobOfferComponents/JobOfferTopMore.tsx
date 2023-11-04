import React from "react";
import { JobOfferTopMoreData, JobOfferCompanyData } from "../JobOffer";
import { JobOfferGetDataFunction, JobOfferEditDataFunction } from "../JobOffer";
import { MultipleErrorResponse } from "../../Profile";
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { Link } from "react-router-dom";


interface JobOfferTopMoreMoreProps {
    jobOfferTopMore: JobOfferTopMoreData | null;
    setJobOfferTopMore: React.Dispatch<React.SetStateAction<JobOfferTopMoreData | null>>;
    getData: (
        setData: JobOfferGetDataFunction,
        endpoint: string
        ) => void;
    editData: (state: JobOfferEditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    // editJobOfferCompany: boolean;
    // setEditJobOfferCompany: React.Dispatch<React.SetStateAction<boolean>>;
    setEditJobOfferTopMore: React.Dispatch<React.SetStateAction<boolean>>;
    editJobOfferTopMore: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    alertError: string;
    setAlertError: React.Dispatch<React.SetStateAction<string>>;
    offerid: string;
    }

    const JobOfferTopMoreMore: React.FC<JobOfferTopMoreMoreProps> = ({
    jobOfferTopMore, getData, editData, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, alertError, setAlertError, setEditJobOfferTopMore, editJobOfferTopMore,
    setJobOfferTopMore, offerid
      }) => {



    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        ) => {
        const { name, value } = event.target;
        
        
        setJobOfferTopMore((prevJobOfferTopMore) => ({
        ...prevJobOfferTopMore!,
        [name]: value,
        }));

        };

    const editJobOffer = () =>{
        setEditJobOfferTopMore(!editJobOfferTopMore);
        if(editJobOfferTopMore === true){
            removeMultipleErrors('top', 0)
            getData(setJobOfferTopMore, `/company/joboffer/top/${offerid}`);
        }
        
    }
    const cancelEditJobOffer = () =>{
        setEditJobOfferTopMore(false);
        removeMultipleErrors('top', 0)
        getData(setJobOfferTopMore, `/company/joboffer/top/${offerid}`);
    }

    const saveEdit = async () =>{
        await editData(jobOfferTopMore, setEditJobOfferTopMore, `/company/joboffer/top/${offerid}`, 'top')
    }
    const formatRemainingTime = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
    
        const timeDifference = (deadlineDate as any) - (currentDate as any);
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
        if (daysDifference >= 1) {
            return `${deadlineDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} (${daysDifference} days remaining)`;
        } 
        else {
            const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
            if (hoursDifference >= 1) {
                return `${hoursDifference} hours remaining`;
        } 
        else {
            const minutesDifference = Math.floor(timeDifference / (1000 * 60));
            if (minutesDifference >= 1) {
                return `${minutesDifference} minutes remaining`;
            } 
            else {
                return "Offer Expired";
            }
        }
    }
}

      return(
        <div>
            <hr></hr>
            <p className="card-text">
                Application Deadline: {jobOfferTopMore?.job_application_deadline
                ? formatRemainingTime(jobOfferTopMore.job_application_deadline)
                : 'No deadline specified'}
            </p>
            <p>{jobOfferTopMore?.job_location}</p>
            <p>{jobOfferTopMore?.work_schedule}</p>
            <p>{jobOfferTopMore?.recruitment_type}</p>
            <p>{jobOfferTopMore?.position_level}</p>
            <p>{jobOfferTopMore?.contract_type}</p>
            <p>{jobOfferTopMore?.work_mode}</p>
            <p>{jobOfferTopMore?.vacancy}</p>
            <hr></hr>
            <p>{jobOfferTopMore?.specialization}</p>

            
        </div>
    )
}
export default JobOfferTopMoreMore;