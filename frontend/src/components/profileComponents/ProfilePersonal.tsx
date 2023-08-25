import React, {useState, useContext} from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ProfileData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import AuthContext from '../../utils/AuthProvider';
import ProfileDeleteModal from './ProfileDeleteModal';



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
    alertError: string;
    setAlertError: React.Dispatch<React.SetStateAction<string>>
    username: string | undefined;
}



const ProfilePersonal: React.FC<ProfilePersonalProps> = ({ 
    personal, setEditPersonal, editPersonal, getData, editData,
    multipleErrors, removeMultipleErrors, renderFieldErrorMultiple,
setPersonal, setAlertError, alertError, username}) => {

    
    const { authTokens } = useContext(AuthContext); // Use the authTokens from AuthContext
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const allowedFormats = ['image/jpeg','image/jfif', 'image/jpg', 'image/jpg'];
    
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files && e.target.files[0];
        setSelectedImageFile(selectedFile);
        e.target.value = '';
        console.log('handle image change')
        // Automatically submit the image when a file is selected
        if (selectedFile) {
            console.log('file has been selected')
            const maxSize = 500 * 1024; // 500KB in bytes
            if (selectedFile.size >= maxSize) {
              setAlertError("File size exceeds 500KB limit");
              console.log("File size exceeds 500KB limit.")
            //   setSelectedImageFile(null);
            } else if (!allowedFormats.includes(selectedFile.type)) {
              setAlertError("Wrong file format");
              console.log("Wrong file format.")
            //   setSelectedImageFile(null);
            } else {
              await submitImage(selectedFile);
              
            }
        }
    };
    
    const submitImage = async (file: File) => {
        const formData = new FormData();
        formData.append('profile_image', file);
    
        try {
        const response = await axios.put(`/profile/uploadImage/${username}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data', // Use multipart/form-data
            Authorization: 'Bearer ' + String(authTokens.access),
            },
        });
    
        console.log('Image uploaded successfully');
        setAlertError('Image uploaded successfully')
        } catch (error) {
        setAlertError('Something went wrong')
        console.error('Error uploading image:', error);
        }
        getData(setPersonal, '/profile/');
        setSelectedImageFile(null);
    };

    const removeImage = async () => {
  
        const data = {profile_image: 'default'}
        console.log('test')
        try {
        const response = await axios.put(`/profile/uploadImage/${username}`, data, {
            headers: {
            'Content-Type': 'multipart/form-data', // Use multipart/form-data
            Authorization: 'Bearer ' + String(authTokens.access),
            },
        });
    
        console.log('Image removed successfully');
        setAlertError('Image removed successfully')
        } catch (error) {
        setAlertError('Something went wrong')
        console.error('Error removing image:', error);
        }
        getData(setPersonal, '/profile/');
    };
    
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        // setData: GetDataFunction,
      ) => {
        const { name, value } = event.target;
      
        
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
        // if (personal?.profile_image === '/media/defaults/default_profile_image.jpg') {
        //     delete personal.profile_image
        // }
        
        await editData(personal, setEditPersonal, '/profile/', 'profile')
        // setEditPersonal(false);
    }


    return(
        <div>
                    <div className='bg-black row mb-1 rounded-top-2 '>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Personal Data</p>
                        <div className='col-auto d-flex align-items-center previewHidden'>
                            <div className='profile-svgs d-flex my-1' onClick={editProfile}>
                                <Icon className='text-white' path={mdiPencil} size={1.25} />
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-center '>
                        
                            <div className={`col-sm-auto row d-flex align-items-center align-items-baseline flex-column ${personal?.profile_image === '/media/defaults/default_profile_image.jpg'
                        ? ('prevHidden') : ('')}`}>
                                <form className='d-flex d-sm-block flex-column-reverse align-items-center justify-content-center'>
                                    {/* Date.now() to make that image refresh when changed */}
                                    <img className='profile-image my-2' src={`${personal?.profile_image}`} alt="Profile" />
                                    <div className='prevHidden row'>
                                        <div className="mb-1 text-center d-flex justify-content-center">
                                            <input 
                                            className=''
                                            id='formFileProfile'
                                            type='file'
                                            accept=".jpeg, .jpg, .jpg, .jfif"
                                            onChange={handleImageChange}
                                            />
                                            {renderFieldErrorMultiple('profile', 0, `profile_image`, multipleErrors)}
                                            <label 
                                            htmlFor="formFileProfile" 
                                            className="form-label mb-0  profile-svgs"
                                            id='profile-imgAdd'
                                            
                                            >
                                                <Icon path={mdiPencil} size={1} />
                                               
                                            </label>
                                            {personal?.profile_image && personal.profile_image !== '/media/defaults/default_profile_image.jpg' &&
                                                <ProfileDeleteModal id={`${personal?.profile_image}_${0}`} onDelete={() => removeImage()} />
                                            }
                                            
                                        </div>
                                    </div>
                                </form>
                            </div>
                        
                    
                {!editPersonal && 
                    <div className='col d-flex justify-content-center'>
                        
                        <div className='text-sm-start text-center col flex-sm-column d-flex flex-column align-items-center align-items-sm-stretch justify-content-center'>
                            <h2 className='mb-1 fs-1 text-primary '>
                                {personal?.first_name || 'Name'} {personal?.last_name || 'Surname'}
                            </h2>
                            <p>
                                <b className='fs-5'>{personal?.current_position}</b>
                            </p>
                            <div className='d-flex flex-column flex-md-row justify-content-md-between text-break my-md-2 my-1 mt-3'>
                                {personal?.date_of_birth && <p className='mb-2 mb-md-0'><b>Date of birth: </b><span className='d-inline-flex'>{personal?.date_of_birth}</span></p>}
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
                    <div className="my-2 col-10">
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
                            <button className='btn btn-secondary me-md-2' style={{width:'5rem'}} onClick={cancelEditProfile}>Cancel</button>
                            <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveEdit}>Save</button> 
                        </div>
                        
                    </div>
                    
                    
                }
                </div>

        </div>
)
}

export default ProfilePersonal;