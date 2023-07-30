import React, { useState, useEffect, useContext } from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ProfileData } from '../Profile';
import { ErrorResponse } from '../Profile';
import { ExpirienceData } from '../Profile';

interface ProfileExpirienceProps {
    expirience: ExpirienceData | null;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editExpirienceData: () => void;
    getExpirienceData: () => void;
    err: ErrorResponse | undefined;
    setErr: React.Dispatch<React.SetStateAction<ErrorResponse | undefined>>;
    setEditExpirience: React.Dispatch<React.SetStateAction<boolean>>;
    editExpirience: boolean;
    renderFieldError: (field: string, error: ErrorResponse | undefined) => React.ReactNode;
    sendExpirienceData: () => void;

}

const ProfileExpirience: React.FC<ProfileExpirienceProps> = ({
    expirience, handleInputChange, editExpirience, getExpirienceData,
    err, setErr, setEditExpirience, editExpirienceData,
    renderFieldError, sendExpirienceData,
}) =>{

    const editExpirienceButton = () =>{
        setEditExpirience(!editExpirience);
        if(editExpirience === true){
            getExpirienceData();
        }
        
    }
    const cancelEditExpirience = () =>{
        setEditExpirience(false);
        setErr({})
        getExpirienceData();
    }

    const saveEdit = async () =>{
        await editExpirienceData()
        // setEditPersonal(false);
    }
    const saveExpirience = async () =>{
        await sendExpirienceData();
    }
    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Expirience</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editExpirienceButton}>
                                Add expirience
                            </button>
                        </div>
                    </div>
                {!editExpirience && 
                    <div className='text-center row'>
                        <div className='col-auto col-md-8 col-sm-6 text-start'>
                            <h2 className='mb-1 text-primary fs-1'>
                                {expirience?.position || ''} {expirience?.localization || ''}
                            </h2>
                            <p>
                                {expirience?.company || ''}
                            </p>
                            <p>
                                {expirience?.responsibilities || ''}
                                {/* {personal?.date_of_birth ? personal.date_of_birth.toLocaleDateString() : 'Birth'} {personal?.country || 'Country'}, {personal?.city || 'City'} */}
                            </p>
                        </div>
                        
                    </div>
                }
                    
                {editExpirience &&  
                    <div className="container">
                        <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='position' className="form-label">Position:</label>
                                    <input type='text' name='position' className={`form-control ${err && err.position && ' is-invalid'}`} value={expirience?.position ?? ''} onChange={handleInputChange}></input>
                                    {renderFieldError('position', err)}
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='localization' className="form-label">Localization:</label>
                                    <input type='text' name='localization' className={`form-control ${err && err.localization && ' is-invalid'}`} value={expirience?.localization ?? ''} onChange={handleInputChange}></input>
                                    {renderFieldError('localization', err)}
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='company' className="form-label">Company:</label>
                                    <input type='text' name='company' className={`form-control ${err && err.company && ' is-invalid'}`} value={expirience?.company ?? ''} onChange={handleInputChange}></input>
                                    {renderFieldError('company', err)}
                                </div>
                            </div>
   
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='responsibilities' className="form-label">Responsibilities:</label>
                                    <input type='text' name='responsibilities' className={`form-control ${err && err.responsibilities && ' is-invalid'}`} value={expirience?.responsibilities ?? ''} onChange={handleInputChange}></input>
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
                            <button className='btn btn-secondary' onClick={cancelEditExpirience}>Cancel</button>
                            <button className='btn btn-primary' onClick={saveExpirience}>Save</button>
                        </div>
                    </div>
                    
                }
            </div>
        </div>
        </div>
    )
}
export default ProfileExpirience