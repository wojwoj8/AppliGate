import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import AuthContext from '../../utils/AuthProvider';
import { ProfileData } from '../Profile';
import { ErrorResponse } from '../Profile';

interface ProfileContactProps{
    contact: ProfileData | null;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editProfileData: () => void;
    getProfileData: () => void;
    err: ErrorResponse | undefined;
    setErr: React.Dispatch<React.SetStateAction<ErrorResponse | undefined>>;
    setEditContact: React.Dispatch<React.SetStateAction<boolean>>;
    editContact: boolean;
    renderFieldError: (field: string, error: ErrorResponse | undefined) => React.ReactNode;
}


const ProfileContact: React.FC<ProfileContactProps> = ({contact, editContact, setEditContact, 
    setErr, handleInputChange, getProfileData, editProfileData, err,
    renderFieldError}) =>{


    const editContactData = () =>{
        setEditContact(!editContact);
        if(editContact === true){
            getProfileData();
        }
    }
    const cancelEditContact = () =>{
        setEditContact(false);
        setErr({})
        getProfileData();
    }

    const saveEdit = async () =>{
        await editProfileData()
        // setContactEditing(false);
    }
    return(
        <div className="container ">
            <div className='container border border-1 border-danger-subtle'>
                <div className='text-center bg-info-subtle row'>
                    <p className='fs-4 fw-semibold text-info col'>Contact Data</p>
                    <div className='col-auto'>
                        <button className='btn btn btn-outline-secondary btn-sm' onClick={editContactData}>
                            <Icon path={mdiPencil} size={1} />
                        </button>
                    </div>
                </div>
                {!editContact &&
                <div className='text-center'>
                    <div className='d-flex justify-content-evenly'>
                        <p>
                            <b>Email:</b> {contact?.email || ''}
                        </p>
                        <p>
                            <b>Phone Number: </b> {contact?.phone_number || ''}
                        </p>
                    </div>
                </div>
                }
                {editContact &&  
                        <div className="container">
                            <form>
                                <div className='row'>
                                    <div className='mb-3 col-4'>
                                    
                                        <label htmlFor='email' className="form-label">Email:</label>
                                        <input 
                                            type='text' name='email' className={`form-control ${err && err.email && ' is-invalid'}`} 
                                            placeholder='example@email.com' value={contact?.email} onChange={handleInputChange}>
                                        </input>
                                        {renderFieldError('email', err)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                        <label htmlFor='phone_number' className="form-label">Phone Number:</label>
                                        <input type='text' name='phone_number' className={`form-control ${err && err.phone_number && ' is-invalid'}`} placeholder='+123456789' value={contact?.phone_number} onChange={handleInputChange}></input>
                                        {renderFieldError('phone_number', err)}
                                    </div>
                                </div>
                            
                                
                            </form>
                            <div className='text-center'>
                                <button className='btn btn-secondary' onClick={cancelEditContact}>Cancel</button>
                                <button className='btn btn-primary' onClick={saveEdit}>Save</button>
                            </div>
                        </div>
                        
                    }
        </div>

        </div>
    )
}
export default ProfileContact;