import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import AuthContext from '../utils/AuthProvider';
import { resolveTripleslashReference } from 'typescript';

interface ProfileData{
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    country: string;
    city: string;
    email: string;
    phone_number: string;
}


interface ErrorResponse{

    [key: string]: string[];
}

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [editing, setEditing] = useState(false);
    const [err, setErr] = useState<ErrorResponse| undefined>(undefined)
    const [contactEdit, setContactEditing] = useState(false);
    const { authTokens, logoutUser } = useContext(AuthContext);
    const editProfile = () =>{
        // e.preventDefault()
        setEditing(!editing);
    }
    const editContact = () =>{
        // e.preventDefault()
        setContactEditing(!contactEdit);
    }
    const cancelEditContact = () =>{
        setContactEditing(false);
        setErr({})
        getProfileData();
    }
    const cancelEditProfile = () =>{
        setEditing(false);
        setErr({})
        getProfileData();
    }

    const getProfileData = async () =>{
        try{
            const response = await axios.get('/profile/', {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            setProfile(response.data)
            const data = response.data;
            if (data.date_of_birth) {
                data.date_of_birth = new Date(data.date_of_birth);
            }
            if(response.status === 200){
                console.log(data)
            }
        }catch(error: any){
            if (error.response && error.response.status === 401) {
                // Unauthorized - Logout the user
                logoutUser();
              } else {
                // Handle other errors here
                console.error('Error fetching profile:', error);
              }
        }
    }

    const editProfileData = async () =>{
        try{
            const response = await axios.put('/profile/', profile,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            setEditing(false);
            setContactEditing(false);
            setErr({})
        }catch (error: any) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response?.data) {
              setErr(axiosError.response.data);
            }
            console.log(error);
          }
    }
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newValue = name === 'date_of_birth' ? new Date(value) : value;
        // console.log(name)
        setProfile((prevProfile) => ({
          ...prevProfile!,
          [name]: newValue,
        }));
      };

    useEffect(() =>{
        getProfileData();
    }, [])
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
                                {profile?.first_name || 'Name'} {profile?.last_name || 'Surname'}
                            </h2>
                            <p>
                                {profile?.date_of_birth ? profile.date_of_birth.toLocaleDateString() : 'Birth'} {profile?.country || 'Country'}, {profile?.city || 'City'}
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
                                    <input type='text' name='first_name' className="form-control" placeholder='John' value={profile?.first_name} onChange={handleInputChange}></input>
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='last_name' className="form-label">Last name:</label>
                                    <input type='text' name='last_name' className="form-control" placeholder='Smith' value={profile?.last_name} onChange={handleInputChange}></input>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='date_of_birth' className="form-label">Date of Birth:</label>
                                    <input type='date' name='date_of_birth' className="form-control" 
                                        value={profile?.date_of_birth ? profile.date_of_birth.toISOString().slice(0, 10) : ''}
                                        onChange={handleInputChange}>  
                                    </input>
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='country' className="form-label">Country:</label>
                                    <input type='text' name='country' className="form-control" placeholder='Poland' value={profile?.country} onChange={handleInputChange}></input>
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='city' className="form-label">City:</label>
                                    <input type='text' name='city' className="form-control" placeholder='Radom' value={profile?.city} onChange={handleInputChange}></input>
                                </div>
                            </div>
                            
                        </form>
                        <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditProfile}>Cancel</button>
                            <button className='btn btn-primary' onClick={editProfileData}>Save</button>
                        </div>
                    </div>
                    
                }
            </div>
        </div>
        <div className='container border border-1 border-danger-subtle'>
            <div className='text-center bg-info-subtle row'>
                <p className='fs-4 fw-semibold text-info col'>Contact Data</p>
                <div className='col-auto'>
                    <button className='btn btn btn-outline-secondary btn-sm' onClick={editContact}>
                        <Icon path={mdiPencil} size={1} />
                    </button>
                </div>
            </div>
            {!contactEdit &&
            <div className='text-center'>
                <div className='d-flex justify-content-evenly'>
                    <p>
                        <b>Email:</b> {profile?.email || ''}
                    </p>
                    <p>
                        <b>Phone Number: </b> {profile?.phone_number || ''}
                    </p>
                </div>
            </div>
            }
            {contactEdit &&  
                    <div className="container">
                        <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                
                                    <label htmlFor='email' className="form-label">Email:</label>
                                    <input type='text' name='email' className={`form-control ${err && err.email && ' is-invalid'}`} placeholder='example@email.com' value={profile?.email} onChange={handleInputChange}></input>
                                    {err && err.email && (
                                    <span className="text-danger">{err.email[0]}</span>
                                    )}
                                </div>
                                <div className='mb-3 col-4'>
                                    <label htmlFor='phone_number' className="form-label">Phone Number:</label>
                                    <input type='text' name='phone_number' className="form-control" placeholder='+123456789' value={profile?.phone_number} onChange={handleInputChange}></input>
                                </div>
                            </div>
                           
                            
                        </form>
                        <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditContact}>Cancel</button>
                            <button className='btn btn-primary' onClick={editProfileData}>Save</button>
                        </div>
                    </div>
                    
                }
        </div>

        </div>
    )
}
export default Profile