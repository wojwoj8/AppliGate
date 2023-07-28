import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';

interface ProfileData{
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    residence: string;
}

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [editing, setEditing] = useState(false);

    const editProfile = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) =>{
        // e.preventDefault()
        setEditing(!editing);
    }

    

    return(
        <div className="container-sm">
            <div className="container-fluid">
                <div className='text-center'>
                    <button className='btn btn-secondary' onClick={e => editProfile(e)}>
                        <Icon path={mdiPencil} size={1} />
                    </button>
                    <span>First Name Last Name</span>
                    <p>Date of birth, Country, city</p>
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
                </div>
                }
            </div>
                
            {editing && 
            <div className='text-center'>
                <button className='btn btn-secondary'>Cancel</button>
                <button className='btn btn-primary'>Save</button>
            </div>
            }
        </div>
    )
}
export default Profile