import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import AuthContext from '../utils/AuthProvider';

interface ProfileData{
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    country: string;
    city: string;
}

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [editing, setEditing] = useState(false);
    const { authTokens } = useContext(AuthContext);
    const editProfile = () =>{
        // e.preventDefault()
        setEditing(!editing);
    }
    const cancelEditProfile = () =>{
        setEditing(false);
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
            if(response.status === 200){
                console.log(data)
            }
        }catch(error: any){
            console.log(error)
        }
    }

    const editProfileData = async () =>{
        try{
            const response = await axios.put('/index', profile,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              
        }catch(error:any){
            console.log(error)
        }
    }
    const handleForm = () =>{

    }

    useEffect(() =>{
        getProfileData();
    }, [])
    return(
        <div className="container-sm">
            <div className="container-fluid">
                <div className='text-center'>
                {!editing && 
                    <button className='btn btn-secondary' onClick={editProfile}>
                        <Icon path={mdiPencil} size={1} />
                    </button>
                    }
                    <h2 className='mb-1 text-primary'>
                        {profile?.first_name || 'Name'} {profile?.last_name || 'Surname'}
                    </h2>
                    <p>
                        {profile?.date_of_birth ? profile.date_of_birth.toLocaleDateString() : 'Birth'} {profile?.country || 'Country'} {profile?.city || 'City'}
                    </p>
                </div>
                
                {editing &&  
                <div className="container">
                    <form>
                        <div className='row'>
                            <div className='mb-3 col-4'>
                                <label htmlFor='first_name' className="form-label">First name:</label>
                                <input type='text' name='first_name' className="form-control" placeholder='John'></input>
                            </div>
                            <div className='mb-3 col-4'>
                                <label htmlFor='last_name' className="form-label">Last name:</label>
                                <input type='text' name='last_name' className="form-control" placeholder='Smith'></input>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='mb-3 col-4'>
                                <label htmlFor='date_of_birth' className="form-label">Date of Birth:</label>
                                <input type='date' name='date_of_birth' className="form-control" ></input>
                            </div>
                            <div className='mb-3 col-4'>
                                <label htmlFor='country' className="form-label">Country:</label>
                                <input type='text' name='country' className="form-control" placeholder='Poland'></input>
                            </div>
                            <div className='mb-3 col-4'>
                                <label htmlFor='city' className="form-label">City:</label>
                                <input type='text' name='city' className="form-control" placeholder='Radom'></input>
                            </div>
                        </div>
                        
                    </form>
                    <div className='text-center'>
                        <button className='btn btn-secondary' onClick={cancelEditProfile}>Cancel</button>
                        <button className='btn btn-primary'>Save</button>
                    </div>
                </div>
                 
                }
            </div>

        </div>
    )
}
export default Profile