import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ProfileData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';

interface ProfileContactProps{
    contact: ProfileData | null;
    setContact: React.Dispatch<React.SetStateAction<ProfileData | null>>;
    getData: (
        setData: GetDataFunction,
        endpoint: string
        ) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editProfileData: () => void;
    setEditContact: React.Dispatch<React.SetStateAction<boolean>>;
    editContact: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
}


const ProfileContact: React.FC<ProfileContactProps> = ({contact, editContact, setEditContact, 
  handleInputChange, getData, editProfileData, multipleErrors, removeMultipleErrors, 
  renderFieldErrorMultiple, setContact}) =>{


    const editContactData = () =>{
        setEditContact(!editContact);
        if(editContact === true){
            removeMultipleErrors('/profile/', 0)
            getData(setContact, '/profile/');
        }
    }
    const cancelEditContact = () =>{
        setEditContact(false);
        removeMultipleErrors('/profile/', 0)
        getData(setContact, '/profile/');
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
                            <b>Email:</b> {contact?.contact_email || ''}
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
                                    
                                        <label htmlFor='contact_email' className="form-label">Email:</label>
                                        <input 
                                            type='text' name='contact_email' className={`form-control${renderFieldErrorMultiple('profile', 0, `contact_email`, multipleErrors) ? ' is-invalid' : ''}`} 
                                            placeholder='example@email.com' value={contact?.contact_email} onChange={handleInputChange}>
                                        </input>
                                        {renderFieldErrorMultiple('profile', 0, `contact_email`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-4'>
                                        <label htmlFor='phone_number' className="form-label">Phone Number:</label>
                                        <input type='text' name='phone_number' className={`form-control${renderFieldErrorMultiple('profile', 0, `phone_number`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        placeholder='+123456789' value={contact?.phone_number} onChange={handleInputChange}></input>
                                        {renderFieldErrorMultiple('profile', 0, `phone_number`, multipleErrors)}
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