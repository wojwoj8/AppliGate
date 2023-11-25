import React, {useEffect} from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { JobOfferGetDataFunction, JobOfferEditDataFunction, JobOfferEditMultipleDataFunction } from "../JobOffer";
import { JobOfferRequirementData } from '../JobOffer';
import { MultipleErrorResponse } from "../../Profile";
import ProfileDeleteModal from '../../profileComponents/ProfileDeleteModal';
import { JobOfferTopColorsData } from '../JobOffer';




interface JobOfferRequirementProps {
    jobOfferRequirement: JobOfferRequirementData[];
    setJobOfferRequirement: React.Dispatch<React.SetStateAction<JobOfferRequirementData[]>>;
    editJobOfferRequirement: boolean;

    editMultipleData: (
        state: JobOfferEditMultipleDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: JobOfferGetDataFunction, 
        endpoint: string, 
        errorField: string, 
        index: number,
        id: number | undefined
    ) => Promise<void>;

    editMultipleJobOfferRequirement: boolean[];
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

    setEditMultipleJobOfferRequirement: React.Dispatch<React.SetStateAction<boolean[]>>;
    setSingleJobOfferRequirement: React.Dispatch<React.SetStateAction<JobOfferRequirementData | null>>;
    setEditJobOfferRequirement: React.Dispatch<React.SetStateAction<boolean>>;
    singleJobOfferRequirement: JobOfferRequirementData | null;
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

const JobOfferRequirement: React.FC<JobOfferRequirementProps> = ({
    jobOfferRequirement,
    setJobOfferRequirement,
    editJobOfferRequirement,
    editMultipleData,
    editMultipleJobOfferRequirement,
    getData,
    sendMultipleData,
    setEditMultipleJobOfferRequirement,
    setSingleJobOfferRequirement,
    setEditJobOfferRequirement,
    singleJobOfferRequirement,
    multipleErrors,
    removeMultipleErrors,
    renderFieldErrorMultiple,
    deleteData,
    jobOfferTopColors,
    offerid
}) =>{

    const editMultipleRequirementButton = async (index: number, id?: number) => {
        if (editMultipleJobOfferRequirement[index] === true){
           await cancelEditMultipleJobOfferRequirement(index, id)
           return
        }
        setEditMultipleJobOfferRequirement((prevEditJobOfferRequirement) => {
          const neweditJobOfferRequirements = [...prevEditJobOfferRequirement];
          neweditJobOfferRequirements[index] = !prevEditJobOfferRequirement[index];
          return neweditJobOfferRequirements;
        });
        
    }

    
    const cancelEditMultipleJobOfferRequirement = async (index: number, id?: number) => {
        setEditMultipleJobOfferRequirement((prevEditJobOfferRequirement) => {
          const neweditJobOfferRequirements = [...prevEditJobOfferRequirement];
          neweditJobOfferRequirements[index] = false;
          return neweditJobOfferRequirements;
        });
        removeMultipleErrors('job_requirement', index)
        await getData(setJobOfferRequirement, `/company/joboffer/requirement/${offerid}`);

      };

    const editRequirementButton = () =>{
        setEditJobOfferRequirement(!editJobOfferRequirement);
        if(editJobOfferRequirement === true){
            removeMultipleErrors('addjob_requirement', 0)
            setSingleJobOfferRequirement(null)
            getData(setJobOfferRequirement, `/company/joboffer/requirement/${offerid}`);
        }
        
    }
    const cancelEditJobOfferRequirement = async () =>{
        setEditJobOfferRequirement(false);
        removeMultipleErrors('addjob_requirement', 0)
       
        setSingleJobOfferRequirement(null)
    }

    const saveEdit = async (index: number, id?: number) =>{
        if (jobOfferRequirement[index]) {
            jobOfferRequirement[index].offer_id = offerid;
        }
        editMultipleData(jobOfferRequirement, setEditMultipleJobOfferRequirement, setJobOfferRequirement, 
            `/company/joboffer/requirement`, 'job_requirement', index, id)
       
    }

    const resetJobOfferRequirement = () => {
        setSingleJobOfferRequirement(null);
      };

    const saveRequirement = () => {
        if (singleJobOfferRequirement) {
            singleJobOfferRequirement.offer_id = offerid;
        }
        sendMultipleData(singleJobOfferRequirement, setEditJobOfferRequirement, setJobOfferRequirement, 
            resetJobOfferRequirement, `/company/joboffer/requirement/${offerid}`, 'addjob_requirement');
        
    }

    const deleteLink = (id: number) => {
        deleteData(setEditMultipleJobOfferRequirement, setJobOfferRequirement, '/company/joboffer/requirement', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleJobOfferRequirement((prevRequirement) => ({
        ...prevRequirement!,
        [name]: value,
        }));
    
  
        
      };
    const handleRequirementInputChange = (
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
    
        setJobOfferRequirement((prevRequirement) => {
        const updatedLinks = [...prevRequirement];
        updatedLinks[index] = {
            ...updatedLinks[index],
            ...updatedProperty, 
        };
        return updatedLinks;
        });
    };
    return(
        <div className={`pb-1 ${(!jobOfferRequirement[0])  && 'prevHidden'}`}>
            
            <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Our Requirements</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1' onClick={editRequirementButton}>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    {!jobOfferRequirement[0] && !editJobOfferRequirement &&
                    <div className='container'> 
                        <p className=' my-4'>
                            Job Offer Requirement
                        </p>
                    </div>
                    
                    }
                    {editJobOfferRequirement && (
                        <div className=''>
                            <form>
                            <div className='row my-2'>
                                <div className='mb-3 col-md-12'>
                                    <label htmlFor={`job_requirement`} className='form-label'>
                                        Requirement:
                                    </label>
                                    <input
                                        type='text'
                                        name={`job_requirement`}
                                        className={`form-control${renderFieldErrorMultiple('addjob_requirement', 0, `job_requirement`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleJobOfferRequirement?.job_requirement || ''}
                                        onChange={handleSingleInputChange}
                                        placeholder='One year of commercial experience'
                                        
                                    />
                                    {renderFieldErrorMultiple('addjob_requirement', 0, `job_requirement`, multipleErrors)}
                                </div>
                                
                            </div>
                            </form>
                            <div className='text-center'>
                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditJobOfferRequirement}>
                                    Cancel
                                </button>
                                <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveRequirement}>
                                    Add
                                </button>
                            </div>
                            {jobOfferRequirement && jobOfferRequirement[0] && <hr className="border border-primary border-3 my-1"></hr>}
                        </div>
                        )}
                {jobOfferRequirement.map((jobOfferRequirement, index) => (
                    <div key={index} className='row'>
                        {/* {index >= 1 && <div className="container"><hr className="border border-primary border-3 my-1"></hr></div>} */}
                        
                        {!editMultipleJobOfferRequirement[index] && (
                        <>
                            <div className='col text-start d-flex my-2'>
                                <div className='col d-flex'>
                                    <svg className='not-hidden' width="28px" height="28px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                        <path fill={`${jobOfferTopColors?.svg_color}`} d="M16 3C8.8 3 3 8.8 3 16s5.8 13 13 13s13-5.8 13-13c0-1.4-.188-2.794-.688-4.094L26.688 13.5c.2.8.313 1.6.313 2.5c0 6.1-4.9 11-11 11S5 22.1 5 16S9.9 5 16 5c3 0 5.694 1.194 7.594 3.094L25 6.688C22.7 4.388 19.5 3 16 3zm11.28 4.28L16 18.563l-4.28-4.28l-1.44 1.437l5 5l.72.686l.72-.687l12-12l-1.44-1.44z"/>
                                    </svg>
                                    <div className='col'>
                                        <p className='ps-3'>{jobOfferRequirement?.job_requirement || ''}</p>
                                    </div>
                                </div>                                                        
                            </div>
                            <div className='col-auto'>
                                <div className='profile-svgs d-flex my-1' onClick={() => editMultipleRequirementButton(index, jobOfferRequirement.id)}>
                                    <Icon path={mdiPencil} size={1} />
                                </div>
                                <ProfileDeleteModal id={`${jobOfferRequirement.job_requirement}_${jobOfferRequirement.id}`} onDelete={() => deleteLink(jobOfferRequirement.id)} />
                            </div>
                        </>
                        
                        )}
                        
                        {editMultipleJobOfferRequirement[index] && (
                        <div className='container'>
                            <form>
                                <div className='row my-2'>
                                <div className='mb-3 col-md-12'>
                                    <label htmlFor={`job_requirement_${index}`} className='form-label'>
                                       Requirement:
                                    </label>
                                    <input
                                        type='text'
                                        name={`job_requirement_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('job_requirement', index, `job_requirement_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={jobOfferRequirement?.job_requirement || ''}
                                        onChange={(e) => handleRequirementInputChange(index, e)}
                                        placeholder='One year of commercial experience'
                                    />
                                    {renderFieldErrorMultiple('job_requirement', index, `job_requirement_${index}`, multipleErrors)}
                                    </div>
                                    

                                    
                                </div>
                                </form>
                            <div className='text-center mb-1'>
                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={() => cancelEditMultipleJobOfferRequirement(index, jobOfferRequirement.id)}>
                                    Cancel
                                </button>
                                <button className='btn btn-primary' style={{width:'5rem'}} onClick={() => saveEdit(index, jobOfferRequirement.id)}>
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
export default JobOfferRequirement;