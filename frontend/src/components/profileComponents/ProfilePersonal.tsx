import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ProfileData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';

interface ProfilePersonalProps {
    personal: ProfileData | null;
    setPersonal: React.Dispatch<React.SetStateAction<ProfileData | null>>;
    // handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editData: (state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    getData: (
        setData: GetDataFunction,
        endpoint: string
        ) => void;
    setEditPersonal: React.Dispatch<React.SetStateAction<boolean>>;
    editPersonal: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
  }



const ProfilePersonal: React.FC<ProfilePersonalProps> = ({ 
    personal, setEditPersonal, editPersonal, getData, editData,
    multipleErrors, removeMultipleErrors, renderFieldErrorMultiple,
setPersonal}) => {

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        // setData: GetDataFunction,
      ) => {
        const { name, value } = event.target;
      
        // const newValue = name === 'date_of_birth' ? (() => {
        //   const date = new Date(value);
        //   const isValidDate = !isNaN(date.getTime()) && date.getFullYear() >= 1 && date.getFullYear() <= 2100;
      
        //   if (isValidDate) {
        //     return date;
        //   } else {
        //     return personal?.date_of_birth || null;
        //   }
        // })() : value;
      

        setPersonal((prevProfile) => ({
        ...prevProfile!,
        [name]: value,
        }));

      };


    const editProfile = () =>{
        setEditPersonal(!editPersonal);
        if(editPersonal === true){
            removeMultipleErrors('profile', 0)
            getData(setPersonal, '/profile/');
        }
        
    }
    const cancelEditProfile = () =>{
        setEditPersonal(false);
        removeMultipleErrors('profile', 0)
        getData(setPersonal, '/profile/');
    }

    const saveEdit = async () =>{
        await editData(personal, setEditPersonal, '/profile/', 'profile')
        // setEditPersonal(false);
    }


    return(
        <div>
                  
                    <div className='bg-black row mb-1 rounded-top-2 '>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Personal Data</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1' onClick={editProfile}>
                                <Icon className='text-white' path={mdiPencil} size={1.25} />
                            </div>
                        </div>
                    </div>
                {!editPersonal && 
                    <div className='row'>
                        <div className='col'>
                            <h2 className='mb-1 fs-1 text-primary'>
                                {personal?.first_name || 'Name'} {personal?.last_name || 'Surname'}
                            </h2>
                            <p>
                                <b className='fs-5'>{personal?.current_position}</b>
                            </p>
                            <div className='d-flex flex-column flex-md-row justify-content-md-between text-break'>
                                {personal?.date_of_birth && <p className='mb-2 mb-md-0'><b>Date of birth: </b>{personal?.date_of_birth}</p>}
                                {personal?.country || personal?.city ? (
                                    <div className='d-flex flex-md-row flex-column'>
                                        <p className='mb-2 mb-md-0'>
                                            <b className='residence-label'>Place of residence: </b>
                                            <span className='d-inline-flex'>
                                                {personal?.country ? (
                                                    <span className='d-inline'>{personal?.country}{personal?.city ? <>,&nbsp;</> : ' '}</span>
                                                ) : null}
                                                {personal?.city ? (
                                                    <span className='d-inline'>{personal?.city}</span>
                                                ) : null}
                                            </span>
                                        </p>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                        
                    </div>
                }
                    
                {editPersonal &&  
                    <div className="my-2">
                        <form>
                            <div className='row my-2'>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='first_name' className='form-label'>First name:</label>
                                <input
                                    type='text' name='first_name'
                                    className={`form-control${renderFieldErrorMultiple('profile', 0, `first_name`, multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='John' value={personal?.first_name ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profile', 0, `first_name`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='last_name' className='form-label'>Last name:</label>
                                <input
                                    type='text' name='last_name'
                                    className={`form-control${renderFieldErrorMultiple('profile', 0, `last_name`, multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Smith' value={personal?.last_name ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profile', 0, `last_name`, multipleErrors)}
                                </div>
                            </div>

                            <div className='row my-2'>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='current_position' className='form-label'>Current Position:</label>
                                <input
                                    type='text' name='current_position'
                                    className={`form-control${renderFieldErrorMultiple('profile', 0, `current_position`, multipleErrors) ? ' is-invalid' : ''}`}
                                    value={personal?.current_position ?? ''} onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profile', 0, `current_position`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='date_of_birth' className='form-label'>Birthdate:</label>
                                <input
                                    type='date' name='date_of_birth'
                                    className={`form-control${renderFieldErrorMultiple('profile', 0, `date_of_birth`, multipleErrors) ? ' is-invalid' : ''}`}
                                    value={personal?.date_of_birth ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profile', 0, `date_of_birth`, multipleErrors)}
                                </div>
                            </div>

                            <div className='row my-2'>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='country' className='form-label'>Country:</label>
                                <input
                                    type='text' name='country'
                                    className={`form-control${renderFieldErrorMultiple('profile', 0, `country`, multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Poland' value={personal?.country ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profile', 0, `country`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='city' className='form-label'>City:</label>
                                <input
                                    type='text' name='city'
                                    className={`form-control${renderFieldErrorMultiple('profile', 0, `city`, multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Radom' value={personal?.city ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profile', 0, `city`, multipleErrors)}
                                </div>
                            </div>
                            </form>
                        <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditProfile}>Cancel</button>
                            <button className='btn btn-primary' onClick={saveEdit}>Save</button>
                        </div>
                        
                    </div>
                    
                    
                }

        </div>
)
}

export default ProfilePersonal;