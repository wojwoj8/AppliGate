import React, {useState, useContext, useEffect} from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiPencil, mdiPerspectiveLess } from '@mdi/js';
import { ProfileCompanyMainData } from '../ProfileCompany';
import { MultipleErrorResponse } from '../../Profile';
import { GetCompanyDataFunction } from '../ProfileCompany';
import { EditCompanyDataFunction } from '../ProfileCompany';
import AuthContext from '../../../utils/AuthProvider';

import ProfileDeleteModal from '../../profileComponents/ProfileDeleteModal';



interface ProfilePersonalProps {
    personal: ProfileCompanyMainData | null;
    setPersonal: React.Dispatch<React.SetStateAction<ProfileCompanyMainData | null>>;
    editData: (state: EditCompanyDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    getData: (
        setData: GetCompanyDataFunction,
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



const ProfileCompanyMain: React.FC<ProfilePersonalProps> = ({ 
    personal, setEditPersonal, editPersonal, getData, editData,
    multipleErrors, removeMultipleErrors, renderFieldErrorMultiple,
setPersonal, setAlertError, alertError, username}) => {

    
    const { authTokens } = useContext(AuthContext); // Use the authTokens from AuthContext
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [selectedBackgroundImageFile, setSelectedBackgroundImageFile] = useState<File | null>(null);
    const [backgroundKey, setBackgroundKey] = useState(0);
    const allowedFormats = ['image/jpeg','image/jfif', 'image/jpg', 'image/png', 'image/bmp', 'image/gif'];
    const [imageUrl, setImageUrl] = useState('');

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, data: string) => {
        const selectedFile = e.target.files && e.target.files[0];
        setSelectedImageFile(selectedFile);
        e.target.value = '';
        // console.log('handle image change')
        // Automatically submit the image when a file is selected
        if (selectedFile) {
            // console.log('file has been selected')
            const maxSize = 5000 * 1024; // 500KB in bytes
            if (selectedFile.size >= maxSize) {
              setAlertError("File size exceeds 5000KB limit");
            //   console.log("File size exceeds 500KB limit.")
            //   setSelectedImageFile(null);
            } else if (!allowedFormats.includes(selectedFile.type)) {
              setAlertError("Wrong file format");
            //   console.log("Wrong file format.")
            //   setSelectedImageFile(null);
            } else {
                console.log(data)
              await submitImage(selectedFile, data);
              
            }
        }
    };

    const handleBackgroundImageChange = async (e: React.ChangeEvent<HTMLInputElement>, data: string ) => {
        const selectedBackgroundFile = e.target.files && e.target.files[0];
        setSelectedBackgroundImageFile(selectedBackgroundFile);
        e.target.value = '';
        // console.log('handle image change')
        // Automatically submit the image when a file is selected
        if (selectedBackgroundFile) {
            // console.log('file has been selected')
            const maxSize = 10000 * 1024; // 10000KB in bytes
            if (selectedBackgroundFile.size >= maxSize) {
              setAlertError("File size exceeds 10000KB limit");
            //   console.log("File size exceeds 500KB limit.")
            //   setSelectedImageFile(null);
            } else if (!allowedFormats.includes(selectedBackgroundFile.type)) {
              setAlertError("Wrong file format error");
            //   console.log("Wrong file format.")
            //   setSelectedImageFile(null);
            } else {
                
              await submitImage(selectedBackgroundFile, data);
              
            }
        }
    };
    
    const submitImage = async (file: File, data: string) => {
        const formData = new FormData();
        formData.append(data, file);


    
        try {
        const response = await axios.put(`/profile/uploadImage/${username}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: 'Bearer ' + String(authTokens.access),
            },
        });
        // console.log('Image uploaded successfully');
        setAlertError('Image uploaded successfully success')
        } catch (error) {
        setAlertError('Something went wrong error')
        console.error('Error uploading image:', error);
        }
        getData(setPersonal, '/company/profile');
        setBackgroundKey(prevKey => prevKey + 1);
        if (personal){
            setImageUrl(`${personal?.background_image}?${backgroundKey}`)
        }
        
        setSelectedImageFile(null);
    };

    const removeImage = async (data: { profile_image?: string, background_image?: string }) => {
  
        // const data = {profile_image: 'default'}
        // console.log('test')
        try {
        const response = await axios.put(`/profile/uploadImage/${username}`, data, {
            headers: {
            'Content-Type': 'multipart/form-data', 
            Authorization: 'Bearer ' + String(authTokens.access),
            },
        });
        
        // console.log('Image removed successfully');
        setAlertError('Image removed successfully success')
        setImageUrl(`${response.data.background_image}`)
        } catch (error) {
        setAlertError('Something went wrong error')
        console.error('Error removing image:', error);
        }
        
        getData(setPersonal, '/company/profile');
        
        
        
    };
    
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
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
            removeMultipleErrors('profileMain', 0)
            getData(setPersonal, '/company/profile');
        }
        
    }
    const cancelEditProfile = () =>{
        setEditPersonal(false);
        removeMultipleErrors('profileMain', 0)
        getData(setPersonal, '/company/profile');
    }

    const saveEdit = async () =>{
        await editData(personal, setEditPersonal, '/company/profile', 'profileMain')
    }

    useEffect(() =>{
        if (personal){
            setImageUrl(personal?.background_image)
        }
        

    },[personal?.background_image])

    return(
        <div className='container shadow-lg rounded-2 text-break'>
                    <div className='bg-black row mb-1 rounded-top-2 '>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Company Data</p>
                        <div className='col-auto d-flex align-items-center previewHidden'>
                            <div className='profile-svgs d-flex my-1' onClick={editProfile}>
                                <Icon className='text-white' path={mdiPencil} size={1.25} />
                            </div>
                        </div>
                    </div>
                    <div className='row justify-content-center '>
                        <div className="jo-background-image" style={{backgroundImage: `url(${imageUrl})`}}/>
                        {/* <img src={`${personal?.background_image}?${Date.now()}`} className="img-fluid" style={{height: "200px"}}  alt="background_img"/> */}
                        <div className='prevHidden row'>
                                        <div className="mb-1 text-center d-flex justify-content-center">
                                            <input 
                                            className=''
                                            id='formFileProfileBackground'
                                            type='file'
                                            accept=".jpeg, .jpg, .png, .jfif, .bmp, .gif"
                                            onChange={(e) => handleBackgroundImageChange(e, "background_image")}
                                            />
                                            {renderFieldErrorMultiple('profileMain', 0, `background_image`, multipleErrors)}
                                            <label 
                                            htmlFor="formFileProfileBackground" 
                                            className="form-label mb-0  profile-svgs"
                                            id='background-imgAdd'
                                            
                                            >
                                                <Icon path={mdiPencil} size={1} />
                                               
                                            </label>
                                            {personal?.background_image && personal.background_image !== '/media/defaults/default_background.png' &&
                                                <ProfileDeleteModal id={`${personal?.background_image}_${0}`} onDelete={() => removeImage({background_image: 'default'})}  />
                                            }
                                            
                                        </div>
                                    </div>


                            <div className={`col-sm-auto row d-flex align-items-center align-items-baseline flex-column ${personal?.profile_image === '/media/defaults/default_profile_image.jpg'
                        ? ('prevHidden') : ('')}`}>
                                <form className='d-flex d-sm-block flex-column align-items-center justify-content-center'>
                                    <img className='profile-image my-2' src={`${personal?.profile_image}?${Date.now()}`} alt="Profile" />
                                    <div className='prevHidden row'>
                                        <div className="mb-1 text-center d-flex justify-content-center">
                                            <input 
                                            className=''
                                            id='formFileProfile'
                                            type='file'
                                            accept=".jpeg, .jpg, .png, .jfif, .bmp, .gif"
                                            onChange={(e) => handleImageChange(e, "profile_image")}
                                            />
                                            {renderFieldErrorMultiple('profileMain', 0, `profile_image`, multipleErrors)}
                                            <label 
                                            htmlFor="formFileProfile" 
                                            className="form-label mb-0  profile-svgs"
                                            id='profile-imgAdd'
                                            
                                            >
                                                <Icon path={mdiPencil} size={1} />
                                               
                                            </label>
                                            {personal?.profile_image && personal.profile_image !== '/media/defaults/default_profile_image.jpg' &&
                                                <ProfileDeleteModal id={`${personal?.profile_image}_${0}`} onDelete={() => removeImage({profile_image: 'default'})}  />
                                            }
                                            
                                        </div>
                                    </div>
                                </form>
                            </div>
                        
                    
                {!editPersonal && 
                    <div className='col d-flex justify-content-center'>
                        
                        <div className='text-sm-start text-center col flex-sm-column d-flex flex-column align-items-center align-items-sm-stretch justify-content-center'>
                            <h2 className='mb-1 fs-1 text-primary '>
                                {personal?.first_name || 'Name'}
                            </h2>
                            <p>
                                <b className='fs-5'>{personal?.current_position}</b>
                            </p>
                            <div className='d-flex flex-column flex-md-row justify-content-md-between text-break my-md-2 my-1 mt-3'>
                                
                                {personal?.country || personal?.city ? (
                                    <div className='d-flex flex-md-row flex-column'>
                                        <p className='mb-2 mb-md-0'>
                                            <b className='residence-label'>Location: </b>
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
                    <div className="col-12">
                        <form>
                            <div className='row my-2'>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='first_name' className='form-label'>Company Name:</label>
                                <input
                                    type='text' name='first_name'
                                    className={`form-control${renderFieldErrorMultiple('profileMain', 0, `first_name`, multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Company Name' value={personal?.first_name ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profileMain', 0, `first_name`, multipleErrors)}
                                </div>
                            
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='current_position' className='form-label'>Industry:</label>
                                <input
                                    type='text' name='current_position'
                                    placeholder='IT'
                                    className={`form-control${renderFieldErrorMultiple('profileMain', 0, `current_position`, multipleErrors) ? ' is-invalid' : ''}`}
                                    value={personal?.current_position ?? ''} onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profileMain', 0, `current_position`, multipleErrors)}
                                </div>
                                
                            </div>

                            <div className='row my-2'>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='country' className='form-label'>Country:</label>
                                <input
                                    type='text' name='country'
                                    className={`form-control${renderFieldErrorMultiple('profileMain', 0, `country`, multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Poland' value={personal?.country ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profileMain', 0, `country`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor='city' className='form-label'>City:</label>
                                <input
                                    type='text' name='city'
                                    className={`form-control${renderFieldErrorMultiple('profileMain', 0, `city`, multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Radom' value={personal?.city ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('profileMain', 0, `city`, multipleErrors)}
                                </div>
                            </div>
                            
                            </form>
                        <div className='text-center mb-1'>
                            <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditProfile}>Cancel</button>
                            <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveEdit}>Save</button> 
                        </div>
                        
                    </div>
                    
                    
                }
                </div>

        </div>
)
}

export default ProfileCompanyMain;