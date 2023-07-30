import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import AuthContext from '../utils/AuthProvider';
import ProfileContact from './profileComponents/ProfileContact';
import ProfilePersonal from './profileComponents/ProfilePersonal';

export interface ProfileData{
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    country: string;
    city: string;
    email: string;
    phone_number: string;
    current_position: string;
}

export interface ErrorResponse{

    [key: string]: string[];
}

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [err, setErr] = useState<ErrorResponse| undefined>(undefined)
    const { authTokens, logoutUser } = useContext(AuthContext);

    const [editPersonal, setEditPersonal] = useState(false);
    const [editContact, setEditContact] = useState(false);


    const renderFieldError = (field: string, error : ErrorResponse | undefined) => {
        if (error && error[field]) {
            return <span className="text-danger">{error[field][0]}</span>;
        }
        return null;
    };

    const getProfileData = async () =>{
        try{
            const response = await axios.get('/profile/', {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            setProfile(response.data)
            // console.log(profile)
            const data = response.data;
            if (data.date_of_birth) {
                data.date_of_birth = new Date(data.date_of_birth);
            }
            if(response.status === 200){
                // console.log(data)
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
            setEditPersonal(false)
            setEditContact(false)
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

        const newValue = name === 'date_of_birth' ? (() => {
            const date = new Date(value);
            const isValidDate = !isNaN(date.getTime()) && date.getFullYear() >= 1 && date.getFullYear() <= 2100;
        
            if (isValidDate) {
              return date;
            } else {
              return profile?.date_of_birth || null;
            }
          })() : value;
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
            <ProfilePersonal 
                personal={profile}
                handleInputChange={handleInputChange}
                editProfileData={editProfileData}
                getProfileData={getProfileData}
                err={err}
                setErr={setErr}
                setEditPersonal={setEditPersonal}
                editPersonal={editPersonal}
                renderFieldError={renderFieldError}
            />
            <ProfileContact
                contact={profile}
                handleInputChange={handleInputChange}
                editProfileData={editProfileData}
                getProfileData={getProfileData}
                err={err}
                setErr={setErr}
                setEditContact={setEditContact}
                editContact={editContact}
                renderFieldError={renderFieldError}
            />
        </div>
    )
}
export default Profile