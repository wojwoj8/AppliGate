import React from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { JobOfferGetDataFunction, JobOfferEditDataFunction, JobOfferEditMultipleDataFunction } from "../JobOffer";
import { JobOfferApplicationData } from '../JobOffer';
import { MultipleErrorResponse } from "../../Profile";
import ProfileDeleteModal from '../../profileComponents/ProfileDeleteModal';
import { JobOfferTopColorsData } from '../JobOffer';




interface JobOfferApplicationProps {
    jobOfferApplication: JobOfferApplicationData[];
    setJobOfferApplication: React.Dispatch<React.SetStateAction<JobOfferApplicationData[]>>;
    editJobOfferApplication: boolean;

    editMultipleData: (
        state: JobOfferEditMultipleDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: JobOfferGetDataFunction, 
        endpoint: string, 
        errorField: string, 
        index: number,
        id: number | undefined
    ) => Promise<void>;

    editMultipleJobOfferApplication: boolean[];
    getData: (
        setData: JobOfferGetDataFunction,
        endpoint: string,
        id?: number | undefined
    ) => void;

    sendMultipleData: (
        state: JobOfferEditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: JobOfferGetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
    ) => Promise<void>;

    setEditMultipleJobOfferApplication: React.Dispatch<React.SetStateAction<boolean[]>>;
    setSingleJobOfferApplication: React.Dispatch<React.SetStateAction<JobOfferApplicationData | null>>;
    setEditJobOfferApplication: React.Dispatch<React.SetStateAction<boolean>>;
    singleJobOfferApplication: JobOfferApplicationData | null;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    deleteData: (
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: JobOfferGetDataFunction, 
        endpoint: string, 
        id: number
    ) => Promise<void>;
    offerid: string;
    jobOfferTopColors: JobOfferTopColorsData | null;
}

const JobOfferApplication: React.FC<JobOfferApplicationProps> = ({
    jobOfferApplication,
    setJobOfferApplication,
    editJobOfferApplication,
    editMultipleData,
    editMultipleJobOfferApplication,
    getData,
    sendMultipleData,
    setEditMultipleJobOfferApplication,
    setSingleJobOfferApplication,
    setEditJobOfferApplication,
    singleJobOfferApplication,
    multipleErrors,
    removeMultipleErrors,
    renderFieldErrorMultiple,
    deleteData,
    jobOfferTopColors,
    offerid
}) =>{

    const editMultipleApplicationButton = async (index: number, id?: number) => {
        if (editMultipleJobOfferApplication[index] === true){
           await cancelEditMultipleJobOfferApplication(index, id)
           return
        }
        setEditMultipleJobOfferApplication((prevEditJobOfferApplication) => {
          const neweditJobOfferApplications = [...prevEditJobOfferApplication];
          neweditJobOfferApplications[index] = !prevEditJobOfferApplication[index];
          return neweditJobOfferApplications;
        });
        
    }

    
    const cancelEditMultipleJobOfferApplication = async (index: number, id?: number) => {
        setEditMultipleJobOfferApplication((prevEditJobOfferApplication) => {
          const neweditJobOfferApplications = [...prevEditJobOfferApplication];
          neweditJobOfferApplications[index] = false;
          return neweditJobOfferApplications;
        });
        removeMultipleErrors('err_job_application_stage', index)
        await getData(setJobOfferApplication, `/company/joboffer/application/${offerid}`);

      };

    const editApplicationButton = () =>{
        setEditJobOfferApplication(!editJobOfferApplication);
        if(editJobOfferApplication === true){
            removeMultipleErrors('err_addjob_application_stage', 0)
            setSingleJobOfferApplication(null)
            getData(setJobOfferApplication, `/company/joboffer/application/${offerid}`);
        }
        
    }
    const cancelEditJobOfferApplication = async () =>{
        setEditJobOfferApplication(false);
        removeMultipleErrors('err_addjob_application_stage', 0)
       
        setSingleJobOfferApplication(null)
    }

    const saveEdit = async (index: number, id?: number) =>{
        if (jobOfferApplication[index]) {
            jobOfferApplication[index].offer_id = offerid;
        }
        editMultipleData(jobOfferApplication, setEditMultipleJobOfferApplication, setJobOfferApplication, 
            `/company/joboffer/application`, 'err_job_application_stage', index, id)
       
    }

    const resetJobOfferApplication = () => {
        setSingleJobOfferApplication(null);
      };

    const saveApplication = () => {
        if (singleJobOfferApplication) {
            singleJobOfferApplication.offer_id = offerid;
        }
        sendMultipleData(singleJobOfferApplication, setEditJobOfferApplication, setJobOfferApplication, 
            resetJobOfferApplication, `/company/joboffer/application/${offerid}`, 'err_addjob_application_stage');
        
    }

    const deleteLink = (id: number) => {
        deleteData(setEditMultipleJobOfferApplication, setJobOfferApplication, '/company/joboffer/application', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleJobOfferApplication((prevApplication) => ({
        ...prevApplication!,
        [name]: value,
        }));
    
  
        
      };
    const handleApplicationInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        
    ) => {
        let { name, value } = event.target;
        name = name.substring(0, name.lastIndexOf('_'));
        // console.log(value)
        // Create an object with the new property and value
        const updatedProperty = {
        [name]: value,
        };
    
        setJobOfferApplication((prevApplication) => {
        const updatedLinks = [...prevApplication];
        updatedLinks[index] = {
            ...updatedLinks[index],
            ...updatedProperty, 
        };
        return updatedLinks;
        });
    };
    return(
        <div className={`pb-1 ${(!jobOfferApplication[0])  && 'prevHidden'}`}>
            {/*  style={{background: jobOfferTopColors?.svg_color}} */}
            
            <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Applicaton Process</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1' onClick={editApplicationButton}>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    {!jobOfferApplication[0] && !editJobOfferApplication &&
                    <div className='container'> 
                        <p className=' my-4'>
                            Job Offer Application
                        </p>
                    </div>
                    
                    }
                    {editJobOfferApplication && (
                        <div className=''>
                            <form>
                            <div className='row my-2'>
                                <div className='mb-3 col-md-12'>
                                    <label htmlFor={`job_application_stage`} className='form-label'>
                                        Stage:
                                    </label>
                                    <input
                                        type='text'
                                        name={`job_application_stage`}
                                        className={`form-control${renderFieldErrorMultiple('err_addjob_application_stage', 0, `job_application_stage`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleJobOfferApplication?.job_application_stage || ''}
                                        onChange={handleSingleInputChange}
                                        placeholder='Stage of application process'
                                        
                                    />
                                    {renderFieldErrorMultiple('err_addjob_application_stage', 0, `job_application_stage`, multipleErrors)}
                                </div>
                                
                            </div>
                            </form>
                            <div className='text-center'>
                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditJobOfferApplication}>
                                    Cancel
                                </button>
                                <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveApplication}>
                                    Add
                                </button>
                            </div>
                            {jobOfferApplication && jobOfferApplication[0] && <hr className="border border-primary border-3 my-1"></hr>}
                        </div>
                        )}
                {jobOfferApplication.map((jobOfferApplication, index) => (
                    <div key={index} className={`row ${index % 2 === 0 ? 'flex-md-row' : 'flex-md-row-reverse'} ${index >= 1 ? 'my-md-2' : ''}`}>
                        {/* {index >= 1 && <div className="container"><hr className="border border-primary border-3 my-1"></hr></div>} */}
                        
                        {!editMultipleJobOfferApplication[index] && (
                        <>
                            <div className='col text-start d-flex my-2'>
                                <div className='col d-flex'>
                                    {/* <svg className='not-hidden' width="28px" height="28px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                        <path fill={`${jobOfferTopColors?.svg_color}`} d="M16 3C8.8 3 3 8.8 3 16s5.8 13 13 13s13-5.8 13-13c0-1.4-.188-2.794-.688-4.094L26.688 13.5c.2.8.313 1.6.313 2.5c0 6.1-4.9 11-11 11S5 22.1 5 16S9.9 5 16 5c3 0 5.694 1.194 7.594 3.094L25 6.688C22.7 4.388 19.5 3 16 3zm11.28 4.28L16 18.563l-4.28-4.28l-1.44 1.437l5 5l.72.686l.72-.687l12-12l-1.44-1.44z"/>
                                    </svg> */}
                                    <div className={`col d-flex align-items-center ${index % 2 === 0 ? 'justify-content-md-start' : 'justify-content-md-end'}`}>
                                        <span className='me-2 fw-bold flex-shrink-0' style={{ color: jobOfferTopColors?.svg_color, fontSize: "1.25rem" }}>{index + 1}.</span>
                                        <p className='ps-1 mb-0'>{jobOfferApplication?.job_application_stage || ''}</p>
                                    </div>
                                </div>                                                        
                            </div>
                            <div className='col-auto '>
                                <div className='profile-svgs d-flex my-1' onClick={() => editMultipleApplicationButton(index, jobOfferApplication.id)}>
                                    <Icon path={mdiPencil} size={1} />
                                </div>
                                <ProfileDeleteModal id={`${jobOfferApplication.job_application_stage}_${jobOfferApplication.id}`} onDelete={() => deleteLink(jobOfferApplication.id)} />
                            </div>
                        </>
                        
                        )}
                        
                        {editMultipleJobOfferApplication[index] && (
                        <div className='container'>
                            <form>
                                <div className='row my-2'>
                                <div className='mb-3 col-md-12'>
                                    <label htmlFor={`job_application_stage_${index}`} className='form-label'>
                                       Application:
                                    </label>
                                    <input
                                        type='text'
                                        name={`job_application_stage_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('err_job_application_stage', index, `job_application_stage_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={jobOfferApplication?.job_application_stage || ''}
                                        onChange={(e) => handleApplicationInputChange(index, e)}
                                        placeholder='Stage of application process'
                                    />
                                    {renderFieldErrorMultiple('err_job_application_stage', index, `job_application_stage_${index}`, multipleErrors)}
                                    </div>
                                    

                                    
                                </div>
                                </form>
                            <div className='text-center mb-1'>
                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={() => cancelEditMultipleJobOfferApplication(index, jobOfferApplication.id)}>
                                    Cancel
                                </button>
                                <button className='btn btn-primary' style={{width:'5rem'}} onClick={() => saveEdit(index, jobOfferApplication.id)}>
                                    Save
                                </button>
                            </div>
                            
                        </div>
                        
                        )}
                        
                    </div>
                    ))}
                    
            
            </div>
        </div>
    )
}
export default JobOfferApplication;