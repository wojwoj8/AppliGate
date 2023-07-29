import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import AuthContext from '../../utils/AuthProvider';


export interface ProfileData{
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

const ProfileContact: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [err, setErr] = useState<ErrorResponse| undefined>(undefined)
    const [contactEdit, setContactEditing] = useState(false);
    const { authTokens, logoutUser } = useContext(AuthContext);

    const editContact = () =>{
        // e.preventDefault()
        setContactEditing(!contactEdit);
    }
    const cancelEditContact = () =>{
        setContactEditing(false);
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
export default ProfileContact;