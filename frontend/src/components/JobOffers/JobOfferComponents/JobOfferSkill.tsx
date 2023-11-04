import React from "react";
import { JobOfferSkillData } from "../JobOffer";
import { JobOfferGetDataFunction, JobOfferEditDataFunction , JobOfferEditMultipleDataFunction } from "../JobOffer";
import { MultipleErrorResponse } from "../../Profile";
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { Link } from "react-router-dom";


interface JobOfferSkillProps {
    jobOfferSkill: JobOfferSkillData[];
    singleJobOfferSkill: JobOfferSkillData | null;
    setSingleJobOfferSkill: React.Dispatch<React.SetStateAction<JobOfferSkillData | null>>;
    setJobOfferSkill: React.Dispatch<React.SetStateAction<JobOfferSkillData[]>>;
    getData: (
        setData: JobOfferGetDataFunction,
        endpoint: string
        ) => void;
    setEditJobOfferSkill: React.Dispatch<React.SetStateAction<boolean>>;
    editJobOfferSkill: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    sendMultipleData:(
        state: JobOfferEditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: JobOfferGetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>
    deleteData: (
        editField: React.Dispatch<React.SetStateAction<boolean[]>> | undefined, 
        setData: JobOfferGetDataFunction, 
        endpoint: string, 
        id: number
        ) => Promise<void>;
    offerid: string;
    previewMode: boolean;
    }

    const JobOfferSkill: React.FC<JobOfferSkillProps> = ({
        jobOfferSkill,
        singleJobOfferSkill,
        setSingleJobOfferSkill,
        setJobOfferSkill,
        getData,
        setEditJobOfferSkill,
        editJobOfferSkill,
        multipleErrors,
        removeMultipleErrors,
        renderFieldErrorMultiple,
        sendMultipleData,
        deleteData,
        offerid,
        previewMode
      }) => {



    const resetSkill = () => {
        setSingleJobOfferSkill(null);
      };

    const saveSkill = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const skillType = e.currentTarget.name
        // console.log(skillType)
        e.preventDefault();
        if (singleJobOfferSkill) {
            singleJobOfferSkill.offer_id = offerid;
            singleJobOfferSkill.skill_type = skillType;
            sendMultipleData(singleJobOfferSkill, setEditJobOfferSkill, setJobOfferSkill, 
            resetSkill, `/company/joboffer/skill/${offerid}`, 'addskill');
        }
    }

    const deleteSkill = (id: number) => {
        deleteData(undefined, setJobOfferSkill, '/company/joboffer/skill', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleJobOfferSkill((prevSkill) => ({
        ...prevSkill!,
        [name]: value,
        }));
    
  
        
      };
      return(
        <div className={`${(!jobOfferSkill[0])  && 'prevHidden'}`}>
            
            <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                    <p className='fs-3 fw-semibold text-white col mb-1'>Technologies we use</p>
                    <div className='col-auto d-flex align-items-center previewHidden'>
                        <div className='profile-svgs d-flex my-1'>
                        </div>
                    </div>
                </div>
                   
                    <div className='row flex'>
                        <form>
                            <div className=''>
                                <div className='mb-3'>
                                    
                                    <div className='row align-items-end prevHidden mt-2'>
                                    <p>Enter skills <b>one at a time</b> and categorize them as "Required" or "Optional" using the buttons.</p>
                                        <div className='col'>
                                            <label htmlFor={`skill`} className='form-label'>
                                                Skill:
                                            </label>
                                            <input
                                                type='text'
                                                name={`skill`}
                                                className={`form-control${renderFieldErrorMultiple('addskill', 0, `jobOfferSkill`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                value={singleJobOfferSkill?.skill || ''}
                                                onChange={handleSingleInputChange}
                                                placeholder='TypeScript'
                                            />
                                        </div>
                                        {/* col-sm mt-3 align-items d-sm-flex */}
                                        <div className='col-sm col-12 mt-3 d-flex justify-content-center  justify-content-sm-start'>
                                            <button className='btn btn-primary me-4 col' name='required' onClick={(e) => saveSkill(e)}>
                                                Required
                                            </button>
                                            <button className='btn btn-danger col' name='optional' onClick={(e) => saveSkill(e)}>
                                                Optional
                                            </button>
                                        </div>
                                    </div>
                                    {renderFieldErrorMultiple('skill', 0, `jobOfferSkill`, multipleErrors)}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className=''>
                        {/* checks if at least one element */}
                    {jobOfferSkill.some(skill => skill.skill_type === 'required') && (
                        <>
                            <p className="mt-2">Required</p>
                            <div className='row flex mb-3 row-gap-2 column-gap-3 container'>
                                {jobOfferSkill
                                    .filter(jobOfferSkill => jobOfferSkill.skill_type === 'required')
                                    .map((jobOfferSkill, index) => (
                                        <div key={index} className='col-auto p-0'>
                                            <div className='profile-skill border border-1 text-white bg-black rounded-2 p-1 px-2 d-flex align-items-center'>
                                                <p className='mb-0 '>{jobOfferSkill?.skill || ''}
                                                    <svg
                                                        height="0.75rem"
                                                        width="0.75rem"
                                                        version="1.1"
                                                        id="Capa_1"
                                                        viewBox="0 0 460.775 460.775"
                                                        className='mb-1'
                                                        onClick={() => deleteSkill(jobOfferSkill.id)}
                                                    >
                                                        <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                                                        c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                                                        c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                                                        c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                                                        l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                                                        c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                                                    </svg>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </>
                    )}
                    {jobOfferSkill.some(skill => skill.skill_type === 'optional') && (
                        <>
                            <p className="mt-2">Nice to have</p>
                            <div className='row flex mb-3 row-gap-2 column-gap-3 container'>
                                {jobOfferSkill
                                    .filter(jobOfferSkill => jobOfferSkill.skill_type === 'optional')
                                    .map((jobOfferSkill, index) => (
                                        <div key={index} className='col-auto p-0'>
                                            <div className='profile-skill border border-1 text-white bg-black rounded-2 p-1 px-2 d-flex align-items-center'>
                                                <p className='mb-0 '>{jobOfferSkill?.skill || ''}
                                                    <svg
                                                        height="0.75rem"
                                                        width="0.75rem"
                                                        version="1.1"
                                                        id="Capa_1"
                                                        viewBox="0 0 460.775 460.775"
                                                        className='mb-1'
                                                        onClick={() => deleteSkill(jobOfferSkill.id)}
                                                    >
                                                        <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                                                        c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                                                        c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                                                        c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                                                        l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                                                        c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                                                    </svg>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </>
                    )}
                </div>
                </div>
        </div>
    )
}
export default JobOfferSkill;