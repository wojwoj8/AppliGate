import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ContactData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';

interface ProfileContactProps{
    contact: ContactData | null;
    setContact: React.Dispatch<React.SetStateAction<ContactData | null>>;
    getData: (
        setData: GetDataFunction,
        endpoint: string
        ) => void;
    editData: (state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    setEditContact: React.Dispatch<React.SetStateAction<boolean>>;
    editContact: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
}


const ProfileContact: React.FC<ProfileContactProps> = ({contact, editContact, setEditContact, 
    getData, editData, multipleErrors, removeMultipleErrors, 
  renderFieldErrorMultiple, setContact}) =>{


    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        // setData: GetDataFunction,
      ) => {
        const { name, value } = event.target;

        setContact((prevProfile) => ({
        ...prevProfile!,
        [name]: value,
        }));

      };
    const editContactData = () =>{
        setEditContact(!editContact);
        if(editContact === true){
            removeMultipleErrors('contact', 0)
            getData(setContact, '/profile/contact');
        }
    }
    const cancelEditContact = () =>{
        setEditContact(false);
        removeMultipleErrors('contact', 0)
        getData(setContact, '/profile/contact');
    }

    const saveEdit = async () =>{
        await editData(contact, setEditContact, '/profile/contact', 'contact')
        // setContactEditing(false);
    }
    return(
        <div>
            
            <div className='bg-dark row'>
                <p className='fs-3 fw-semibold text-white col mb-1'>Contact Data</p>
                    <div className='col-auto'>
                        <div className='profile-svgs d-flex my-1' onClick={editContactData}>
                            <Icon className='text-white' path={mdiPencil} size={1.25} />
                        </div>
                    </div>
                </div>
                {!editContact &&
                <div className='text-sm-center'>
                    <div className='d-flex flex-column flex-sm-row justify-content-between text-break'>
                        <p>
                            <b>Email:</b> {contact?.contact_email || ''}
                        </p>
                        <p className=''>
                            <b>Phone Number: </b> {contact?.phone_number || ''}
                        </p>
                    </div>
                </div>
                }
                {editContact &&  
                        <div className="">
                            <form>
                                <div className='row my-2 '>
                                    <div className='mb-3 col-md-6'>
                                    
                                        <label htmlFor='contact_email' className="form-label">Email:</label>
                                        <input 
                                            type='text' name='contact_email' className={`form-control${renderFieldErrorMultiple('contact', 0, `contact_email`, multipleErrors) ? ' is-invalid' : ''}`} 
                                            placeholder='example@email.com' value={contact?.contact_email} onChange={handleInputChange}>
                                        </input>
                                        {renderFieldErrorMultiple('contact', 0, `contact_email`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-md-6'>
                                        <label htmlFor='phone_number' className="form-label">Phone Number:</label>
                                        <input type='text' name='phone_number' className={`form-control${renderFieldErrorMultiple('contact', 0, `phone_number`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        placeholder='+123456789' value={contact?.phone_number} onChange={handleInputChange}></input>
                                        {renderFieldErrorMultiple('contact', 0, `phone_number`, multipleErrors)}
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
    )
}
export default ProfileContact;