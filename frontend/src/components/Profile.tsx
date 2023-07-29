import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import AuthContext from '../utils/AuthProvider';
import ProfileContact from './profileComponents/ProfileContact';
import ProfilePersonal from './profileComponents/ProfilePersonal';

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
    const [err, setErr] = useState<ErrorResponse| undefined>(undefined)
    const { authTokens, logoutUser } = useContext(AuthContext);

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
            <ProfilePersonal 
                personal={profile}
                handleInputChange={handleInputChange}
                editProfileData={editProfileData}
                getProfileData={getProfileData}
            />
            <ProfileContact/>
        </div>
    )
}
export default Profile