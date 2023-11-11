import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { JobOfferGetDataFunction, JobOfferEditDataFunction } from "../JobOffer";
import { JobOfferAboutData } from '../JobOffer';
import { MultipleErrorResponse } from "../../Profile";


interface JobOfferAboutProps {
    jobOfferAbout: JobOfferAboutData  | null;
    setJobOfferAbout: React.Dispatch<React.SetStateAction<JobOfferAboutData  | null>>;
    editData: (state: JobOfferEditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    getData: (
        setData: JobOfferGetDataFunction,
        endpoint: string
        ) => void;
    setEditJobOfferAbout: React.Dispatch<React.SetStateAction<boolean>>;
    editJobOfferAbout: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    offerid: string;
}

const JobOfferAbout: React.FC<JobOfferAboutProps> = ({ 
        jobOfferAbout, setEditJobOfferAbout, editJobOfferAbout, getData, editData,
        multipleErrors, removeMultipleErrors, renderFieldErrorMultiple,
    setJobOfferAbout, offerid}) => {


        const handleInputChange = (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            const { name, value } = event.target;

            setJobOfferAbout((prevAbout) => ({
            ...prevAbout!,
            [name]: value,
            }));
    
          };
    
    
        const editAboutSection = () =>{
            setEditJobOfferAbout(!editJobOfferAbout);
            if(editJobOfferAbout === true){
                removeMultipleErrors('jobOfferAbout', 0)
                getData(setJobOfferAbout, `/company/joboffer/about/${offerid}`);
            }
            
        }
        const cancelEditProfile = () =>{
            setEditJobOfferAbout(false);
            removeMultipleErrors('jobOfferAbout', 0)
            getData(setJobOfferAbout, `/company/joboffer/about/${offerid}`);
        }
    
        const saveEdit = async () =>{
            await editData(jobOfferAbout, setEditJobOfferAbout, `/company/joboffer/about/${offerid}`, 'jobOfferAbout')
        }

    return(
        <div className={`${!jobOfferAbout?.job_about && 'prevHidden'}`}>

             <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                    <p className='fs-3 fw-semibold text-white col mb-1'>About Job</p>
                    <div className='col-auto d-flex align-items-center previewHidden'>
                        <div className='profile-svgs d-flex my-1' onClick={editAboutSection}>
                                <Icon className='text-white' path={mdiPencil} size={1.25} />
                            </div>
                        <div className='profile-svgs d-flex my-1'>
                        </div>
                    </div>
                </div>
                
                    {!jobOfferAbout?.job_about && !editJobOfferAbout &&
                    <div className='container'> 
                        <p className=' py-4'>
                            About Job/Project.
                        </p>
                    </div>
                    
                    }
                   
                    {!editJobOfferAbout && jobOfferAbout?.job_about&&
                     <div className='text-center row my-3'>
                        <div className='col-auto text-start'>
                            {jobOfferAbout?.job_about && <p style={{ whiteSpace: 'pre-wrap' }}>{jobOfferAbout?.job_about}</p>}
                        </div>
                    </div> 
                }
                   
                {editJobOfferAbout &&  
                    <div className="">
                        <form>
                            <div className='row my-2'>
                                <div className='mb-3 col'>
                                    <label htmlFor= 'job_about' className="form-label">About Job:</label>
                                    <textarea
                                        name= 'job_about' 
                                        className={`form-control${renderFieldErrorMultiple('jobOfferAbout', 0, `job_about`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={jobOfferAbout?.job_about || ''} 
                                        style={{ height: '12rem' }}
                                        onChange={handleInputChange}>
                                    </textarea>
                                    {renderFieldErrorMultiple('jobOfferAbout', 0, `job_about`, multipleErrors)}
                                </div>
                            </div>
                        </form>
                        <div className='text-center mb-1'>
                            <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditProfile}>Cancel</button>
                            <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveEdit}>Save</button>
                        </div>
                        
                    </div>
                    
                    
                }
                
        </div>
        </div>
    )
}
export default JobOfferAbout;