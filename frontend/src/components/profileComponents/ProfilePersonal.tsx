import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import AuthContext from '../../utils/AuthProvider';
import { ProfileData } from './ProfileContact';

interface ProfilePersonalProps {
    personal: ProfileData | null;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editProfileData: () => void;
    getProfileData: () => void;
  }

interface ErrorResponse{

    [key: string]: string[];
}


const ProfilePersonal: React.FC<ProfilePersonalProps> = ({ personal, handleInputChange, getProfileData, editProfileData}) => {
    const [editing, setEditing] = useState(false);
    const [err, setErr] = useState<ErrorResponse| undefined>(undefined)
    // const { authTokens, logoutUser } = useContext(AuthContext);

    const editProfile = () =>{
        setEditing(!editing);
    }
    const cancelEditProfile = () =>{
        setEditing(false);
        setErr({})
        getProfileData();
    }

    const saveEdit = async () =>{
        await editProfileData()
        setEditing(false);
    }

    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Personal Data</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editProfile}>
                                <Icon path={mdiPencil} size={1} />
                            </button>
                        </div>
                    </div>
                {!editing && 
                    <div className='text-center row'>
                        <div className='col-auto col-sm-2'>                       
                            <img className='w-75' src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg/v1/fill/w_300,h_300,q_75,strp/default_user_icon_4_by_karmaanddestiny_de7834s-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MzAwIiwicGF0aCI6IlwvZlwvMjcxZGVlYTgtZTI4Yy00MWEzLWFhZjUtMjkxM2Y1ZjQ4YmU2XC9kZTc4MzRzLTY1MTViZDQwLThiMmMtNGRjNi1hODQzLTVhYzFhOTVhOGI1NS5qcGciLCJ3aWR0aCI6Ijw9MzAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.W7L0Rf_YqFzX9yxDfKtIMFnnRFdjwCHxi7xeIISAHNM" alt="user"></img>
                        </div>
                        <div className='col-auto col-md-8 col-sm-6 text-start'>
                            <h2 className='mb-1 text-primary fs-1'>
                                {personal?.first_name || 'Name'} {personal?.last_name || 'Surname'}
                            </h2>
                            <p>
                                {personal?.date_of_birth ? personal.date_of_birth.toLocaleDateString() : 'Birth'} {personal?.country || 'Country'}, {personal?.city || 'City'}
                            </p>
                        </div>
                        
                    </div>
                }
                    
                {editing &&  
                    <div className="container">
                        <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='first_name' className="form-label">First name:</label>
                                    <input type='text' name='first_name' className="form-control" placeholder='John' value={personal?.first_name} onChange={handleInputChange}></input>
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='last_name' className="form-label">Last name:</label>
                                    <input type='text' name='last_name' className="form-control" placeholder='Smith' value={personal?.last_name} onChange={handleInputChange}></input>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='date_of_birth' className="form-label">Date of Birth:</label>
                                    <input type='date' name='date_of_birth' className="form-control" 
                                        value={personal?.date_of_birth ? personal.date_of_birth.toISOString().slice(0, 10) : ''}
                                        onChange={handleInputChange}>  
                                    </input>
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='country' className="form-label">Country:</label>
                                    <input type='text' name='country' className="form-control" placeholder='Poland' value={personal?.country} onChange={handleInputChange}></input>
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='city' className="form-label">City:</label>
                                    <input type='text' name='city' className="form-control" placeholder='Radom' value={personal?.city} onChange={handleInputChange}></input>
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
        </div>
    </div>
)
}

export default ProfilePersonal;