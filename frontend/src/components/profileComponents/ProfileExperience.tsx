import React, { useState, useEffect, useContext } from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ProfileData } from '../Profile';
import { ErrorResponse } from '../Profile';
import { ExperienceData } from '../Profile';

interface ProfileExperienceProps {
    experience: ExperienceData[];
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editExperienceData: () => void;
    getExperienceData: () => void;
    err: ErrorResponse | undefined;
    setErr: React.Dispatch<React.SetStateAction<ErrorResponse | undefined>>;
    setEditExperience: React.Dispatch<React.SetStateAction<boolean>>;
    editExperience: boolean;
    renderFieldError: (field: string, error: ErrorResponse | undefined) => React.ReactNode;
    sendExperienceData: () => void;

}

const ProfileExperience: React.FC<ProfileExperienceProps> = ({
    experience, handleInputChange, editExperience, getExperienceData,
    err, setErr, setEditExperience, editExperienceData,
    renderFieldError, sendExperienceData,
}) =>{

    const editExperienceButton = () =>{
        setEditExperience(!editExperience);
        if(editExperience === true){
            getExperienceData();
        }
        
    }
    const cancelEditExperience = () =>{
        setEditExperience(false);
        setErr({})
        getExperienceData();
    }

    const saveEdit = async () =>{
        await editExperienceData()
        // setEditPersonal(false);
    }
    const saveExperience = async () =>{
        await sendExperienceData();
    }
    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Experience</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editExperienceButton}>
                                Add experience
                            </button>
                        </div>
                    </div>
                {!editExperience && 
                    <div className='text-center row'>
                        <div className='col-auto col-md-8 col-sm-6 text-start'>
                            <h2 className='mb-1 text-primary fs-1'>
                                {experience?.position || ''} {experience?.localization || ''}
                            </h2>
                            <p>
                                {experience?.company || ''}
                            </p>
                            <p>
                                {experience?.responsibilities || ''}
                                {/* {personal?.date_of_birth ? personal.date_of_birth.toLocaleDateString() : 'Birth'} {personal?.country || 'Country'}, {personal?.city || 'City'} */}
                            </p>
                        </div>
                        
                    </div>
                }
                    
                {editExperience &&  
                    <div className="container">
                        <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='position' className="form-label">Position:</label>
                                    <input type='text' name='position' className={`form-control ${err && err.position && ' is-invalid'}`} value={experience?.position ?? ''} onChange={handleInputChange}></input>
                                    {renderFieldError('position', err)}
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='localization' className="form-label">Localization:</label>
                                    <input type='text' name='localization' className={`form-control ${err && err.localization && ' is-invalid'}`} value={experience?.localization ?? ''} onChange={handleInputChange}></input>
                                    {renderFieldError('localization', err)}
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='company' className="form-label">Company:</label>
                                    <input type='text' name='company' className={`form-control ${err && err.company && ' is-invalid'}`} value={experience?.company ?? ''} onChange={handleInputChange}></input>
                                    {renderFieldError('company', err)}
                                </div>
                            </div>
   
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='responsibilities' className="form-label">Responsibilities:</label>
                                    <input type='text' name='responsibilities' className={`form-control ${err && err.responsibilities && ' is-invalid'}`} value={experience?.responsibilities ?? ''} onChange={handleInputChange}></input>
                                    {renderFieldError('responsibilities', err)}
                                </div>
                                {/* <div className='mb-3 col-4'>
                                    <label htmlFor='date_of_birth' className="form-label">Date of Birth:</label>
                                    <input type='date' name='date_of_birth' className={`form-control ${err && err.date_of_birth && ' is-invalid'}`} 
                                        value={personal?.date_of_birth ? personal.date_of_birth.toISOString().slice(0, 10) : ''}
                                        onChange={handleInputChange}>  
                                    </input>
                                    {renderFieldError('date_of_birth', err)}
                                </div> */}
                                
                            </div>
                            
                        </form>
                        <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditExperience}>Cancel</button>
                            <button className='btn btn-primary' onClick={saveExperience}>Save</button>
                        </div>
                    </div>
                    
                }
            </div>
        </div>
        </div>
    )
}

export default ProfileExperience