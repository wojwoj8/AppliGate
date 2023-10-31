import React from "react";
import { JobOfferTopData, JobOfferCompanyData } from "../JobOffer";
import { JobOfferGetDataFunction, JobOfferEditDataFunction } from "../JobOffer";
import { MultipleErrorResponse } from "../../Profile";
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { Link } from "react-router-dom";


interface JobOfferTopProps {
    jobOfferCompany: JobOfferCompanyData | null;
    jobOfferTop: JobOfferTopData | null;
    setJobOfferTop: React.Dispatch<React.SetStateAction<JobOfferTopData | null>>;
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
    setEditJobOfferTop: React.Dispatch<React.SetStateAction<boolean>>;
    editJobOfferTop: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    alertError: string;
    setAlertError: React.Dispatch<React.SetStateAction<string>>;
    offerid: string;
    }








const JobOfferTop : React.FC<JobOfferTopProps> = ({jobOfferCompany, jobOfferTop, getData, editData, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, alertError, setAlertError, setEditJobOfferTop, editJobOfferTop,
    setJobOfferTop, offerid
}) =>{


    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        ) => {
        const { name, value } = event.target;
        
        
        setJobOfferTop((prevJobOfferTop) => ({
        ...prevJobOfferTop!,
        [name]: value,
        }));

        };

    const editJobOffer = () =>{
        setEditJobOfferTop(!editJobOfferTop);
        if(editJobOfferTop === true){
            removeMultipleErrors('top', 0)
            getData(setJobOfferTop, `/company/joboffer/top/${offerid}`);
        }
        
    }
    const cancelEditJobOffer = () =>{
        setEditJobOfferTop(false);
        removeMultipleErrors('top', 0)
        getData(setJobOfferTop, `/company/joboffer/top/${offerid}`);
    }

    const saveEdit = async () =>{
        await editData(jobOfferTop, setEditJobOfferTop, `/company/joboffer/top/${offerid}`, 'top')
    }
    return(
        <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-n5 z-1" id="page">
            <div className='bg-black row mb-0 rounded-top-2'>
                <p className='fs-3 fw-semibold text-white col mb-1'>TOP PART</p>
                <div className='col-auto d-flex align-items-center previewHidden'>
                    <div className='profile-svgs d-flex my-1'>
                        <div className='profile-svgs d-flex my-1' onClick={editJobOffer}>
                            <Icon className='text-white' path={mdiPencil} size={1.25} />
                        </div>
                    </div>
                </div>
            </div>
            <div className='row justify-content-center '>
                <div className={`col-sm-auto row d-flex align-items-center align-items-baseline flex-column`}>
                    <div className='d-flex d-sm-block flex-column align-items-center justify-content-center'>
                                            {/* <img className='profile-image my-2' src={`${personal?.profile_image}?${Date.now()}`} alt="Profile" /> */}
                        <img src={jobOfferCompany?.profile_image} alt="logo" className="profile-image my-2" style={{height: "150px", width:"150px"}}></img>
                    </div>
                </div>
                {/* <p>{jobOfferCompany?.first_name}</p>
                <p>{jobOfferCompany?.country}</p>
                <p>{jobOfferCompany?.city}</p>

                <div>
                    <p>{jobOfferTop?.salary_currency}</p>
                    <p>{jobOfferTop?.salary_description}</p>
                    <p>{jobOfferTop?.salary_max}</p>
                    <p>{jobOfferTop?.salary_min}</p>
                    <p>{jobOfferTop?.title}</p>
                </div>
            */}


            {!editJobOfferTop && 
            <>
                <div className='col d-flex justify-content-center'>
                    
                    <div className='text-sm-start text-center col flex-sm-column d-flex flex-column align-items-center align-items-sm-stretch justify-content-center'>
                        <h2 className='mb-1 fs-1 text-primary '>
                            {jobOfferTop?.title || 'Title'}
                        </h2>
                        <p>
                            <Link to={`/company/profile/${jobOfferCompany?.username}/`}>
                                <b className='fs-5'>{jobOfferCompany?.first_name}</b>
                            </Link>
                        </p>
                        <div className='d-flex flex-column flex-md-row justify-content-md-between text-break my-md-2 my-1 mt-3'>
                            <p>test</p>
                        </div>
                    </div>
                
                </div>
                <div className={`col-sm-auto row d-flex align-items-center align-items-baseline flex-column`}>
                    <div className="card bg-danger mt-2">
                        <div className="card-body">
                            <span>{jobOfferTop?.salary_min} - {jobOfferTop?.salary_max} {jobOfferTop?.salary_currency}</span>
                            <p>{jobOfferTop?.salary_description}</p>
                        </div>
                    </div>
                </div>
            </>
            }
            {editJobOfferTop && 
            <>
                <div className="col-12">
                    <form>
                        <div className='row my-2'>
                            <div className='mb-3 col-md-6'>
                            <label htmlFor='title' className='form-label'>Title:</label>
                            <input
                                type='text' name='title'
                                className={`form-control${renderFieldErrorMultiple('top', 0, `title`, multipleErrors) ? ' is-invalid' : ''}`}
                                placeholder='FrontEnd developer (React)' value={jobOfferTop?.title  ?? ''}
                                onChange={handleInputChange}
                            />
                            {renderFieldErrorMultiple('top', 0, `title`, multipleErrors)}
                            </div>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor='last_name' className='form-label'>Last name:</label>
                                    <input
                                        type='number' name='salary_min'
                                        className={`form-control${renderFieldErrorMultiple('top', 0, `salary_min`, multipleErrors) ? ' is-invalid' : ''}`}
                                        placeholder='Smith' value={jobOfferTop?.salary_min ?? ''}
                                        onChange={handleInputChange}
                                    />
                                    {renderFieldErrorMultiple('top', 0, `salary_min`, multipleErrors)}
                                </div>
                            </div>

                        
                        
                        </form>
                    <div className='text-center mb-1'>
                        <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditJobOffer}>Cancel</button>
                        <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveEdit}>Save</button> 
                    </div>
                    
                </div>
                    
                    
            </>
            }
        </div>         
    </div>
    )
}
export default JobOfferTop;