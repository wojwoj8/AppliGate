import React, { useState, useEffect, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import AuthContext from '../utils/AuthProvider';
import ProfileContact from './profileComponents/ProfileContact';
import ProfilePersonal from './profileComponents/ProfilePersonal';
import ProfileExperience from './profileComponents/ProfileExperience';

export interface ProfileData{
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    country: string;
    city: string;
    current_position: string;
}
export interface ContactData{
  contact_email: string;
  phone_number: string;
}
export interface ExperienceData{
    position: string;
    localization: string;
    from_date: string;
    to_date: string;
    company: string;
    responsibilities: string;
    id: number;
}
// for axios errors
export interface ErrorResponse{

    [key: string]: string[];
}
export interface MultipleErrorResponse {
  [key: string]: {
    [key: number]: {
      [key: string]: string[];
    };
  };
}

//UNIVERSAL GET SETSTATES
export type GetDataFunction = 
  React.Dispatch<React.SetStateAction<ProfileData | null>> |
  React.Dispatch<React.SetStateAction<ContactData | null>> |
  React.Dispatch<React.SetStateAction<ExperienceData[]>> |
  undefined;

//UNIVERSAL PUT STATES
export type EditDataFunction = 
  ProfileData | null |
  ContactData | null |
  ExperienceData | null |
  ExperienceData[] |
  undefined;

//




const initialMultipleErrors: MultipleErrorResponse = {
  profile: {},
  experience: {}
};

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [contact, setContact] = useState<ContactData| null>(null);
    const [experience, setExperience] = useState<ExperienceData[]>([]);
    const [singleExperience, setSingleExperience] = useState<ExperienceData | null>(null);
    const { authTokens, logoutUser } = useContext(AuthContext);

    const [editPersonal, setEditPersonal] = useState(false);
    const [editContact, setEditContact] = useState(false);
    const [editExperience, setEditExperience] = useState(false);
    const [editMultipleExperiences, setEditMultipleExperiences] = useState<boolean[]>([]);
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>(initialMultipleErrors)

    const renderFieldErrorMultiple = (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => {
      if (error && error[field] && typeof error[field][index] === "object" && error[field][index].hasOwnProperty(errorKey)) {
        const messages = error[field][index][errorKey];
        return (
          <div>
            {messages.map((message, i) => (
              <span key={i} className="text-danger">
                {message}
              </span>
            ))}
          </div>
        );
      }
      return null;
    };

   

    const getData = async (
      setData: GetDataFunction,
      endpoint: string,

    ) => {
        try{
            const response = await axios.get(`${endpoint}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            if (setData) {
                setData(response.data);
              }
            const data = response.data;
            if (data.date_of_birth) {
                data.date_of_birth = new Date(data.date_of_birth);
            }
            if(response.status === 200){
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
//////////////////////////////////////////////////////////////
    const editData = async (
      state: EditDataFunction,
      editField: React.Dispatch<React.SetStateAction<boolean>>,
      endpoint: string,
      errorField: string,
      index: number = 0,

    ) =>{
      try{
          const response = await axios.put(`${endpoint}`, state,  {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
          editField(false)
          removeMultipleErrors(`${errorField}`, index)
      }catch (error: any) {
          removeMultipleErrors(`${errorField}`, index)
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response?.data) {
            handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
          }
          console.log(error);
        }
  }

///////////////////////////////////////
     // PERSONAL/CONTACT

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        // setData: GetDataFunction,
      ) => {
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
      

        setProfile((prevProfile) => ({
        ...prevProfile!,
        [name]: newValue,
        }));
    
  
        
      };

    // EXPIRIENCE

    const sendExperienceData = async () =>{
        try{
            const response = await axios.post('/profile/experience', singleExperience,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            setEditExperience(false)

            removeMultipleErrors('addexperience', 0)
            getData(setExperience, '/profile/experience');
            setSingleExperience(null)
        }catch (error: any) {
            removeMultipleErrors('addexperience', 0)
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response?.data) {
              handleMultipleErrors('addexperience', 0, axiosError.response?.data)
            }
            console.log(error);
          }
    }



    const editExperienceData = async (index: number) =>{
        console.log(index)
        try{
            const response = await axios.put('/profile/experience', experience[index],  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              setEditMultipleExperiences((prevEditExperiences) => {
                const newEditExperiences = [...prevEditExperiences];
                newEditExperiences[index] = false;
                return newEditExperiences;
              });
              getData(setExperience, '/profile/experience');

              removeMultipleErrors('experience', index)
        }catch (error: any) {
            removeMultipleErrors('experience', index)
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response?.data) {
                const keys = Object.keys(axiosError.response?.data)
                keys.forEach((key) => {
                    const newKey = key + `_${index}`;
                    axiosError.response!.data[newKey] = axiosError.response!.data[key];
                    delete axiosError.response!.data[key];
                });
                console.log(axiosError.response?.data)
                handleMultipleErrors('experience', index, axiosError.response?.data)
              // setErr(axiosError.response.data);
            }
            console.log(error);
          }
    }


    const deleteExperienceData = async (id: number) =>{
      console.log(id)
      try{
          const response = await axios.delete(`/profile/experience/${id}`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
            setEditMultipleExperiences((prevEditExperiences) => {
              const newEditExperiences = [...prevEditExperiences];
              newEditExperiences[id] = false;
              return newEditExperiences;
            });
            getData(setExperience, '/profile/experience');

            // removeMultipleErrors('experience', index)
      }catch (error: any) {
          // removeMultipleErrors('experience', index)
          const axiosError = error as AxiosError<ErrorResponse>;
          // if (axiosError.response?.data) {
          //     const keys = Object.keys(axiosError.response?.data)
          //     keys.forEach((key) => {
          //         const newKey = key + `_${index}`;
          //         axiosError.response!.data[newKey] = axiosError.response!.data[key];
          //         delete axiosError.response!.data[key];
          //     });
          //     console.log(axiosError.response?.data)
          //     // handleMultipleErrors('experience', index, axiosError.response?.data)
          //   // setErr(axiosError.response.data);
          // }
          // console.log(error);
        }
  }


    const handleMultipleErrors = (key: string, index: number, errorData: ErrorResponse) => {
      setMultipleErrors((prevState) => ({
        ...prevState,
        [key]: {
          ...(prevState[key] || {}),
          [index]: {
            ...(prevState[key]?.[index] || {}),
            ...errorData
          }
        }
      }));
    };

    const removeMultipleErrors = (key: string, index: number) => {
      setMultipleErrors((prevState) => ({
        ...prevState,
        [key]: {
          ...(prevState[key] || {}),
          [index]: {}
        }
      }));
    };

    useEffect(() =>{
        getData(setProfile, '/profile/');
        getData(setContact, '/profile/contact');
        getData(setExperience, '/profile/experience');
    }, [])
    return(
        <div className="container ">
            <ProfilePersonal 
                personal={profile}
                setPersonal={setProfile}
                handleInputChange={handleInputChange}
                editData={editData}
                getData={getData}
                setEditPersonal={setEditPersonal}
                editPersonal={editPersonal}
                multipleErrors={multipleErrors}                                             
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
            />
            <ProfileContact
                contact={contact}
                setContact={setContact}
                handleInputChange={handleInputChange}
                editData={editData}
                getData={getData}
                setEditContact={setEditContact}
                editContact={editContact}     
                multipleErrors={multipleErrors}                                             
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}

            />
            <ProfileExperience
                experience={experience}
                setExperience={setExperience}
                editExperience={editExperience}
                setEditExperience={setEditExperience}
                editExperienceData={editExperienceData}
                getData={getData}
                sendExperienceData={sendExperienceData}
                // editData={editData}
                singleExperience={singleExperience}
                setSingleExperience={setSingleExperience}
                editMultipleExperiences={editMultipleExperiences}
                setEditMultipleExperiences={setEditMultipleExperiences}
                multipleErrors={multipleErrors}
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
                deleteExperienceData={deleteExperienceData}

            />
        </div>
    )
}
export default Profile