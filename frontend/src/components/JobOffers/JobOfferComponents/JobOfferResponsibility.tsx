import React from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { JobOfferGetDataFunction, JobOfferEditDataFunction, JobOfferEditMultipleDataFunction } from "../JobOffer";
import { JobOfferResponsibilityData } from '../JobOffer';
import { MultipleErrorResponse } from "../../Profile";
import ProfileDeleteModal from '../../profileComponents/ProfileDeleteModal';
import { JobOfferTopColorsData } from '../JobOffer';



interface JobOfferResponsibilityProps {
    jobOfferResponsibility: JobOfferResponsibilityData[];
    setJobOfferResponsibility: React.Dispatch<React.SetStateAction<JobOfferResponsibilityData[]>>;
    editJobOfferResponsibility: boolean;

    editMultipleData: (
        state: JobOfferEditMultipleDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: JobOfferGetDataFunction, 
        endpoint: string, 
        errorField: string, 
        index: number,
        id: number | undefined
    ) => Promise<void>;

    editMultipleJobOfferResponsibility: boolean[];
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

    setEditMultipleJobOfferResponsibility: React.Dispatch<React.SetStateAction<boolean[]>>;
    setSingleJobOfferResponsibility: React.Dispatch<React.SetStateAction<JobOfferResponsibilityData | null>>;
    setEditJobOfferResponsibility: React.Dispatch<React.SetStateAction<boolean>>;
    singleJobOfferResponsibility: JobOfferResponsibilityData | null;
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

const JobOfferResponsibility: React.FC<JobOfferResponsibilityProps> = ({
    jobOfferResponsibility,
    setJobOfferResponsibility,
    editJobOfferResponsibility,
    editMultipleData,
    editMultipleJobOfferResponsibility,
    getData,
    sendMultipleData,
    setEditMultipleJobOfferResponsibility,
    setSingleJobOfferResponsibility,
    setEditJobOfferResponsibility,
    singleJobOfferResponsibility,
    multipleErrors,
    removeMultipleErrors,
    renderFieldErrorMultiple,
    deleteData,
    jobOfferTopColors,
    offerid
}) =>{

    const editMultipleResponsibilityButton = async (index: number, id?: number) => {
        if (editMultipleJobOfferResponsibility[index] === true){
           await cancelEditMultipleJobOfferResponsibility(index, id)
           return
        }
        setEditMultipleJobOfferResponsibility((prevEditJobOfferResponsibility) => {
          const neweditJobOfferResponsibilitys = [...prevEditJobOfferResponsibility];
          neweditJobOfferResponsibilitys[index] = !prevEditJobOfferResponsibility[index];
          return neweditJobOfferResponsibilitys;
        });
        
    }

    
    const cancelEditMultipleJobOfferResponsibility = async (index: number, id?: number) => {
        setEditMultipleJobOfferResponsibility((prevEditJobOfferResponsibility) => {
          const neweditJobOfferResponsibilitys = [...prevEditJobOfferResponsibility];
          neweditJobOfferResponsibilitys[index] = false;
          return neweditJobOfferResponsibilitys;
        });
        removeMultipleErrors('jobOfferResponsibility', index)
        await getData(setJobOfferResponsibility, `/company/joboffer/responsibility/${offerid}`);

      };

    const editResponsibilityButton = () =>{
        setEditJobOfferResponsibility(!editJobOfferResponsibility);
        if(editJobOfferResponsibility === true){
            removeMultipleErrors('job_responsibility', 0)
            setSingleJobOfferResponsibility(null)
            getData(setJobOfferResponsibility, `/company/joboffer/responsibility/${offerid}`);
        }
        
    }
    const cancelEditJobOfferResponsibility = async () =>{
        setEditJobOfferResponsibility(false);
        removeMultipleErrors('job_responsibility', 0)
       
        setSingleJobOfferResponsibility(null)
    }

    const saveEdit = async (index: number, id?: number) =>{
        if (jobOfferResponsibility[index]) {
            jobOfferResponsibility[index].offer_id = offerid;
        }
        editMultipleData(jobOfferResponsibility, setEditMultipleJobOfferResponsibility, setJobOfferResponsibility, 
            `/company/joboffer/responsibility`, 'job_responsibility', index, id)
       
    }

    const resetJobOfferResponsibility = () => {
        setSingleJobOfferResponsibility(null);
      };

    const saveResponsibility = () => {
        if (singleJobOfferResponsibility) {
            singleJobOfferResponsibility.offer_id = offerid;
        }
        sendMultipleData(singleJobOfferResponsibility, setEditJobOfferResponsibility, setJobOfferResponsibility, 
            resetJobOfferResponsibility, `/company/joboffer/responsibility/${offerid}`, 'job_responsibility');
        
    }

    const deleteLink = (id: number) => {
        deleteData(setEditMultipleJobOfferResponsibility, setJobOfferResponsibility, '/company/joboffer/responsibility', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleJobOfferResponsibility((prevResponsibility) => ({
        ...prevResponsibility!,
        [name]: value,
        }));
    
  
        
      };
    const handleResponsibilityInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        
    ) => {
        let { name, value } = event.target;
        name = name.substring(0, name.lastIndexOf('_'));
        // console.log(value)
        // Create an object with the new property and value
        const updatedProperty = {
        [name]: value,
        };
    
        setJobOfferResponsibility((prevResponsibility) => {
        const updatedLinks = [...prevResponsibility];
        updatedLinks[index] = {
            ...updatedLinks[index],
            ...updatedProperty, 
        };
        return updatedLinks;
        });
    };
    return(
        <div className={`pb-1 ${(!jobOfferResponsibility[0])  && 'prevHidden'}`}>
            
            <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Responsibilities</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1' onClick={editResponsibilityButton}>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    {!jobOfferResponsibility[0] && !editJobOfferResponsibility &&
                    <div className='container'> 
                        <p className=' my-4'>
                            Job Offer Responsibility
                        </p>
                    </div>
                    
                    }
                    {editJobOfferResponsibility && (
                        <div className=''>
                            <form>
                            <div className='row my-2'>
                                <div className='mb-3 col-md-12'>
                                    <label htmlFor={`job_responsibility`} className='form-label'>
                                        Responsibility:
                                    </label>
                                    <input
                                        type='text'
                                        name={`job_responsibility`}
                                        className={`form-control${renderFieldErrorMultiple('job_responsibility', 0, `job_responsibility`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleJobOfferResponsibility?.job_responsibility || ''}
                                        onChange={handleSingleInputChange}
                                        placeholder='Creating nice UI'
                                        
                                    />
                                    {renderFieldErrorMultiple('job_responsibility', 0, `job_responsibility`, multipleErrors)}
                                </div>
                            </div>
                            </form>
                            <div className='text-center'>
                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditJobOfferResponsibility}>
                                    Cancel
                                </button>
                                <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveResponsibility}>
                                    Add
                                </button>
                            </div>
                            {jobOfferResponsibility && jobOfferResponsibility[0] && <hr className="border border-primary border-3 my-1"></hr>}
                        </div>
                        )}
                {jobOfferResponsibility.map((jobOfferResponsibility, index) => (
                    <div key={index} className='row'>
                        {/* {index >= 1 && <div className="container"><hr className="border border-primary border-3 my-1"></hr></div>} */}
                        
                        {!editMultipleJobOfferResponsibility[index] && (
                        <>
                            <div className='col text-start d-flex my-2'>
                                <div className='col d-flex'>
                                    <svg className='not-hidden' width="28px" height="28px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                        <path fill={`${jobOfferTopColors?.svg_color}`} d="M16 3C8.8 3 3 8.8 3 16s5.8 13 13 13s13-5.8 13-13c0-1.4-.188-2.794-.688-4.094L26.688 13.5c.2.8.313 1.6.313 2.5c0 6.1-4.9 11-11 11S5 22.1 5 16S9.9 5 16 5c3 0 5.694 1.194 7.594 3.094L25 6.688C22.7 4.388 19.5 3 16 3zm11.28 4.28L16 18.563l-4.28-4.28l-1.44 1.437l5 5l.72.686l.72-.687l12-12l-1.44-1.44z"/>
                                    </svg>
                                    <div className='col'>
                                        <p className='ps-2'>{jobOfferResponsibility?.job_responsibility || ''}</p>
                                    </div>
                                </div>                                                        
                            </div>
                            <div className='col-auto'>
                                <div className='profile-svgs d-flex my-1' onClick={() => editMultipleResponsibilityButton(index, jobOfferResponsibility.id)}>
                                    <Icon path={mdiPencil} size={1} />
                                </div>
                                <ProfileDeleteModal id={`${jobOfferResponsibility.job_responsibility}_${jobOfferResponsibility.id}`} onDelete={() => deleteLink(jobOfferResponsibility.id)} />
                            </div>
                        </>
                        
                        )}
                        
                        {editMultipleJobOfferResponsibility[index] && (
                        <div className='container'>
                            <form>
                                <div className='row my-2'>
                                <div className='mb-3 col-md-12'>
                                    <label htmlFor={`job_responsibility_${index}`} className='form-label'>
                                       Responsibility:
                                    </label>
                                    <input
                                        type='text'
                                        name={`job_responsibility_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('jobOfferResponsibility', index, `job_responsibility_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={jobOfferResponsibility?.job_responsibility || ''}
                                        onChange={(e) => handleResponsibilityInputChange(index, e)}
                                        placeholder='Creating nice UI'
                                    />
                                    {renderFieldErrorMultiple('jobOfferResponsibility', index, `job_responsibility_${index}`, multipleErrors)}
                                    </div>
                                </div>

                                </form>
                            <div className='text-center mb-1'>
                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={() => cancelEditMultipleJobOfferResponsibility(index, jobOfferResponsibility.id)}>
                                    Cancel
                                </button>
                                <button className='btn btn-primary' style={{width:'5rem'}} onClick={() => saveEdit(index, jobOfferResponsibility.id)}>
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
export default JobOfferResponsibility;