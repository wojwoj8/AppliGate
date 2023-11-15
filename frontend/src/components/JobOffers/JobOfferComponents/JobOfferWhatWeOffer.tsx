import React, {useEffect} from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { JobOfferGetDataFunction, JobOfferEditDataFunction, JobOfferEditMultipleDataFunction } from "../JobOffer";
import { JobOfferWhatWeOfferData } from '../JobOffer';
import { MultipleErrorResponse } from "../../Profile";
import ProfileDeleteModal from '../../profileComponents/ProfileDeleteModal';
import { JobOfferTopColorsData } from '../JobOffer';




interface JobOfferWhatWeOfferProps {
    jobOfferWhatWeOffer: JobOfferWhatWeOfferData[];
    setJobOfferWhatWeOffer: React.Dispatch<React.SetStateAction<JobOfferWhatWeOfferData[]>>;
    editJobOfferWhatWeOffer: boolean;

    editMultipleData: (
        state: JobOfferEditMultipleDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: JobOfferGetDataFunction, 
        endpoint: string, 
        errorField: string, 
        index: number,
        id: number | undefined
    ) => Promise<void>;

    editMultipleJobOfferWhatWeOffer: boolean[];
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

    setEditMultipleJobOfferWhatWeOffer: React.Dispatch<React.SetStateAction<boolean[]>>;
    setSingleJobOfferWhatWeOffer: React.Dispatch<React.SetStateAction<JobOfferWhatWeOfferData | null>>;
    setEditJobOfferWhatWeOffer: React.Dispatch<React.SetStateAction<boolean>>;
    singleJobOfferWhatWeOffer: JobOfferWhatWeOfferData | null;
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

const JobOfferWhatWeOffer: React.FC<JobOfferWhatWeOfferProps> = ({
    jobOfferWhatWeOffer,
    setJobOfferWhatWeOffer,
    editJobOfferWhatWeOffer,
    editMultipleData,
    editMultipleJobOfferWhatWeOffer,
    getData,
    sendMultipleData,
    setEditMultipleJobOfferWhatWeOffer,
    setSingleJobOfferWhatWeOffer,
    setEditJobOfferWhatWeOffer,
    singleJobOfferWhatWeOffer,
    multipleErrors,
    removeMultipleErrors,
    renderFieldErrorMultiple,
    deleteData,
    jobOfferTopColors,
    offerid
}) =>{

    const editMultipleWhatWeOfferButton = async (index: number, id?: number) => {
        if (editMultipleJobOfferWhatWeOffer[index] === true){
           await cancelEditMultipleJobOfferWhatWeOffer(index, id)
           return
        }
        setEditMultipleJobOfferWhatWeOffer((prevEditJobOfferWhatWeOffer) => {
          const neweditJobOfferWhatWeOffers = [...prevEditJobOfferWhatWeOffer];
          neweditJobOfferWhatWeOffers[index] = !prevEditJobOfferWhatWeOffer[index];
          return neweditJobOfferWhatWeOffers;
        });
        
    }

    
    const cancelEditMultipleJobOfferWhatWeOffer = async (index: number, id?: number) => {
        setEditMultipleJobOfferWhatWeOffer((prevEditJobOfferWhatWeOffer) => {
          const neweditJobOfferWhatWeOffers = [...prevEditJobOfferWhatWeOffer];
          neweditJobOfferWhatWeOffers[index] = false;
          return neweditJobOfferWhatWeOffers;
        });
        removeMultipleErrors('whatweoffer', index)
        await getData(setJobOfferWhatWeOffer, `/company/joboffer/weoffer/${offerid}`);

      };

    const editWhatWeOfferButton = () =>{
        setEditJobOfferWhatWeOffer(!editJobOfferWhatWeOffer);
        if(editJobOfferWhatWeOffer === true){
            removeMultipleErrors('addwhatweoffer', 0)
            setSingleJobOfferWhatWeOffer(null)
            getData(setJobOfferWhatWeOffer, `/company/joboffer/weoffer/${offerid}`);
        }
        
    }
    const cancelEditJobOfferWhatWeOffer = async () =>{
        setEditJobOfferWhatWeOffer(false);
        removeMultipleErrors('addwhatweoffer', 0)
       
        setSingleJobOfferWhatWeOffer(null)
    }

    const saveEdit = async (index: number, id?: number) =>{
        if (jobOfferWhatWeOffer[index]) {
            jobOfferWhatWeOffer[index].offer_id = offerid;
        }
        editMultipleData(jobOfferWhatWeOffer, setEditMultipleJobOfferWhatWeOffer, setJobOfferWhatWeOffer, 
            `/company/joboffer/weoffer`, 'whatweoffer', index, id)
       
    }

    const resetJobOfferWhatWeOffer = () => {
        setSingleJobOfferWhatWeOffer(null);
      };

    const saveWhatWeOffer = () => {
        if (singleJobOfferWhatWeOffer) {
            singleJobOfferWhatWeOffer.offer_id = offerid;
        }
        sendMultipleData(singleJobOfferWhatWeOffer, setEditJobOfferWhatWeOffer, setJobOfferWhatWeOffer, 
            resetJobOfferWhatWeOffer, `/company/joboffer/weoffer/${offerid}`, 'addwhatweoffer');
        
    }

    const deleteLink = (id: number) => {
        deleteData(setEditMultipleJobOfferWhatWeOffer, setJobOfferWhatWeOffer, '/company/joboffer/weoffer', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleJobOfferWhatWeOffer((prevWhatWeOffer) => ({
        ...prevWhatWeOffer!,
        [name]: value,
        }));
    
  
        
      };
    const handleWhatWeOfferInputChange = (
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
    
        setJobOfferWhatWeOffer((prevWhatWeOffer) => {
        const updatedLinks = [...prevWhatWeOffer];
        updatedLinks[index] = {
            ...updatedLinks[index],
            ...updatedProperty, 
        };
        return updatedLinks;
        });
    };
    return(
        <div className={`pb-1 ${(!jobOfferWhatWeOffer[0])  && 'prevHidden'}`}>
            
            <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                        <p className='fs-3 fw-semibold text-white col mb-1'>What We Offer</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1' onClick={editWhatWeOfferButton}>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    {!jobOfferWhatWeOffer[0] && !editJobOfferWhatWeOffer &&
                    <div className='container'> 
                        <p className=' my-4'>
                            Job Offer WhatWeOffer
                        </p>
                    </div>
                    
                    }
                    {editJobOfferWhatWeOffer && (
                        <div className=''>
                            <form>
                            <div className='row my-2'>
                                <div className='mb-3 col-md-9'>
                                    <label htmlFor={`job_whatweoffer`} className='form-label'>
                                        WhatWeOffer:
                                    </label>
                                    <input
                                        type='text'
                                        name={`job_whatweoffer`}
                                        className={`form-control${renderFieldErrorMultiple('addwhatweoffer', 0, `job_whatweoffer`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleJobOfferWhatWeOffer?.job_whatweoffer || ''}
                                        onChange={handleSingleInputChange}
                                        placeholder='Creating nice UI'
                                        
                                    />
                                    {renderFieldErrorMultiple('addwhatweoffer', 0, `job_whatweoffer`, multipleErrors)}
                                </div>
                                
                            </div>
                            </form>
                            <div className='text-center'>
                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditJobOfferWhatWeOffer}>
                                    Cancel
                                </button>
                                <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveWhatWeOffer}>
                                    Add
                                </button>
                            </div>
                            {jobOfferWhatWeOffer && jobOfferWhatWeOffer[0] && <hr className="border border-primary border-3 my-1"></hr>}
                        </div>
                        )}
                {jobOfferWhatWeOffer.map((jobOfferWhatWeOffer, index) => (
                    <div key={index} className='row'>
                        {/* {index >= 1 && <div className="container"><hr className="border border-primary border-3 my-1"></hr></div>} */}
                        
                        {!editMultipleJobOfferWhatWeOffer[index] && (
                        <>
                            <div className='col text-start d-flex my-2'>
                                <div className='col d-flex'>
                                    <svg className='not-hidden' width="28px" height="28px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                        <path fill={`${jobOfferTopColors?.svg_color}`} d="M16 3C8.8 3 3 8.8 3 16s5.8 13 13 13s13-5.8 13-13c0-1.4-.188-2.794-.688-4.094L26.688 13.5c.2.8.313 1.6.313 2.5c0 6.1-4.9 11-11 11S5 22.1 5 16S9.9 5 16 5c3 0 5.694 1.194 7.594 3.094L25 6.688C22.7 4.388 19.5 3 16 3zm11.28 4.28L16 18.563l-4.28-4.28l-1.44 1.437l5 5l.72.686l.72-.687l12-12l-1.44-1.44z"/>
                                    </svg>
                                    <div className='col'>
                                        <p className='ps-3'>{jobOfferWhatWeOffer?.job_whatweoffer || ''}</p>
                                    </div>
                                </div>                                                        
                            </div>
                            <div className='col-auto'>
                                <div className='profile-svgs d-flex my-1' onClick={() => editMultipleWhatWeOfferButton(index, jobOfferWhatWeOffer.id)}>
                                    <Icon path={mdiPencil} size={1} />
                                </div>
                                <ProfileDeleteModal id={`${jobOfferWhatWeOffer.job_whatweoffer}_${jobOfferWhatWeOffer.id}`} onDelete={() => deleteLink(jobOfferWhatWeOffer.id)} />
                            </div>
                        </>
                        
                        )}
                        
                        {editMultipleJobOfferWhatWeOffer[index] && (
                        <div className='container'>
                            <form>
                                <div className='row my-2'>
                                <div className='mb-3 col-md-9'>
                                    <label htmlFor={`job_whatweoffer_${index}`} className='form-label'>
                                       WhatWeOffer:
                                    </label>
                                    <input
                                        type='text'
                                        name={`job_whatweoffer_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('whatweoffer', index, `job_whatweoffer_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={jobOfferWhatWeOffer?.job_whatweoffer || ''}
                                        onChange={(e) => handleWhatWeOfferInputChange(index, e)}
                                        placeholder='Creating nice UI'
                                    />
                                    {renderFieldErrorMultiple('whatweoffer', index, `job_whatweoffer_${index}`, multipleErrors)}
                                    </div>
                                    

                                    
                                </div>
                                </form>
                            <div className='text-center mb-1'>
                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={() => cancelEditMultipleJobOfferWhatWeOffer(index, jobOfferWhatWeOffer.id)}>
                                    Cancel
                                </button>
                                <button className='btn btn-primary' style={{width:'5rem'}} onClick={() => saveEdit(index, jobOfferWhatWeOffer.id)}>
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
export default JobOfferWhatWeOffer;