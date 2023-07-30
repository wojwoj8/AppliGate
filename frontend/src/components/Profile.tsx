import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import AuthContext from '../utils/AuthProvider';
import ProfileContact from './profileComponents/ProfileContact';
import ProfilePersonal from './profileComponents/ProfilePersonal';
import ProfileExpirience from './profileComponents/ProfileExpirience';

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

export interface ExpirienceData{
    position: string;
    localization: string;
    from_date: Date;
    to_date: Date;
    company: string;
    responsibilities: string;
}
export interface ErrorResponse{

    [key: string]: string[];
}

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [expirience, setExpirience] = useState<ExpirienceData | null>(null);
    const [err, setErr] = useState<ErrorResponse| undefined>(undefined)
    const { authTokens, logoutUser } = useContext(AuthContext);

    const [editPersonal, setEditPersonal] = useState(false);
    const [editContact, setEditContact] = useState(false);
    const [editExpirience, setEditExpirience] = useState(false);


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
    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        data: 'profile' | 'expirience') => {
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
        if (data === 'profile'){
            setProfile((prevProfile) => ({
                // ! means not null or undefined
                ...prevProfile!,
                [name]: newValue,
              }));
        } else if (data === 'expirience'){
            setExpirience((prevExpirience) => ({
                ...prevExpirience!,
                [name]: newValue,
              }));
        }
        
      };

    
    // EXPIRIENCE

    const getExpirienceData = async () =>{
        try{
            const response = await axios.get('/profile/expirience', {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            setExpirience(response.data)
            // console.log(profile)
            const data = response.data;
            // if (data.date_of_birth) {
            //     data.date_of_birth = new Date(data.date_of_birth);
            // }
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

    const sendExpirienceData = async () =>{
        try{
            const response = await axios.post('/profile/expirience', expirience,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            setEditExpirience(false)

            setErr({})
        }catch (error: any) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response?.data) {
              setErr(axiosError.response.data);
            }
            console.log(error);
          }
    }



    const editExpirienceData = async () =>{
        try{
            const response = await axios.put('/profile/expirience', expirience,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            setEditExpirience(false)

            setErr({})
        }catch (error: any) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response?.data) {
              setErr(axiosError.response.data);
            }
            console.log(error);
          }
    }



    useEffect(() =>{
        getProfileData();
        getExpirienceData();
    }, [])
    return(
        <div className="container ">
            <ProfilePersonal 
                personal={profile}
                handleInputChange={(event) => handleInputChange(event, 'profile')}
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
                handleInputChange={(event) => handleInputChange(event, 'profile')}
                editProfileData={editProfileData}
                getProfileData={getProfileData}
                err={err}
                setErr={setErr}
                setEditContact={setEditContact}
                editContact={editContact}
                renderFieldError={renderFieldError}
            />
            <ProfileExpirience
                expirience={expirience}
                handleInputChange={(event) => handleInputChange(event, 'expirience')}
                editExpirience={editExpirience}
                setEditExpirience={setEditExpirience}
                editExpirienceData={editExpirienceData}
                getExpirienceData={getExpirienceData}
                err={err}
                setErr={setErr}
                renderFieldError={renderFieldError}
                sendExpirienceData={sendExpirienceData}
            />
        </div>
    )
}
export default Profile