import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import AuthContext from '../utils/AuthProvider';
import ProfileContact from './profileComponents/ProfileContact';
import ProfilePersonal from './profileComponents/ProfilePersonal';
import ProfileExperience from './profileComponents/ProfileExperience';
import ProfileEducation from './profileComponents/ProfileEducation';
import ProfileCourse from './profileComponents/ProfileCourse';
import ProfileAbout from './profileComponents/ProfileAbout';
import ProfileLanguage from './profileComponents/ProfileLanguage';
import ProfileLink from './profileComponents/ProfileLink';
import ProfileSkill from './profileComponents/ProfileSkill';
import ProfileAlert from './profileComponents/ProfileAlert';
import ProfileSummary from './profileComponents/ProfileSummary';
import ProfileStatus from './profileComponents/ProfileStatus';
import ErrorPage from './ErrorPage';
import Loading from './Loading';

export interface ProfileData{
  first_name: string;
  last_name: string;
  date_of_birth: string;
  country: string;
  city: string;
  current_position: string;
  profile_image: string;
}

export interface SummaryData{
  professional_summary: string;
}

export interface AboutData{
  about_me: string;
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

export interface EducationData{
  id: number;
  school: string;
  educational_level: string;
  major: string;
  specialization: string;
  from_date: string;
  to_date: string;

}

export interface CourseData{
  id: number;
  course_name: string;
  organizer: string;
  certificate_link: string;
  finish_date: string;
}

export interface LanguageData{
  id: number;
  language: string;
  language_level: string;
}

export interface SkillData{
  id: number;
  skill: string;
}

export interface LinkData{
  id: number;
  link_name: string;
  link: string;
}

export interface ProfileStatusData{
  public_profile: boolean;
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

// SIMPLIFICATION OF MY GetDataFunction TYPE BECAUSE OF ERROR
type UpdateFunction<T> = React.Dispatch<React.SetStateAction<T | null>>;
type ArrayUpdateFunction<T> = React.Dispatch<React.SetStateAction<T[]>>;

export type GetDataFunction =
  | UpdateFunction<ProfileData>
  | UpdateFunction<ContactData>
  | ArrayUpdateFunction<ExperienceData>
  | ArrayUpdateFunction<EducationData>
  | ArrayUpdateFunction<CourseData>
  | ArrayUpdateFunction<LanguageData>
  | ArrayUpdateFunction<LinkData>
  | ArrayUpdateFunction<SkillData>
  | UpdateFunction<AboutData>
  | UpdateFunction<SummaryData>
  | UpdateFunction<ProfileStatusData>
  | undefined;

//UNIVERSAL PUT STATES
export type EditDataFunction = 
  ProfileData | null |
  ContactData | null |
  ExperienceData | null |
  ExperienceData[] |
  EducationData | null |
  EducationData[] |
  CourseData | null |
  CourseData[] |
  LanguageData[] |
  LanguageData | null |
  LinkData[] |
  LinkData | null |
  SkillData[] |
  SkillData | null |
  AboutData | null |
  SummaryData | null |
  ProfileStatusData | null |
  undefined;

export type EditMultipleDataFunction = 
  ExperienceData[] |
  EducationData[] |
  CourseData[] |
  LanguageData[] |
  LinkData[] |
  SkillData[] 
  ;

const initialMultipleErrors: MultipleErrorResponse = {
  profile: {},
  experience: {}
};

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [contact, setContact] = useState<ContactData| null>(null);
    const [experience, setExperience] = useState<ExperienceData[]>([]);
    const [education, setEducation] = useState<EducationData[]>([]);
    const [course, setCourse] = useState<CourseData[]>([]);
    const [language, setLanguage] = useState<LanguageData[]>([]);
    const [link, setLink] = useState<LinkData[]>([]);
    const [skill, setSkill] = useState<SkillData[]>([]);
    const [about, setAbout] = useState<AboutData | null>(null);
    const [summary, setSummary] = useState<SummaryData | null>(null);
    const [profileStatus, setProfileStatus] = useState<ProfileStatusData | null>(null)

    const [singleCourse, setSingleCourse] = useState<CourseData | null>(null);
    const [singleExperience, setSingleExperience] = useState<ExperienceData | null>(null);
    const [singleEducation, setSingleEducation] = useState<EducationData | null>(null);
    const [singleLanguage, setSingleLanguage] = useState<LanguageData | null>(null);
    const [singleLink, setSingleLink] = useState<LinkData | null>(null);
    const [singleSkill, setSingleSkill] = useState<SkillData | null>(null);
    

    const { authTokens, user, logoutUser } = useContext(AuthContext);

    const [editPersonal, setEditPersonal] = useState(false);
    const [editContact, setEditContact] = useState(false);
    const [editExperience, setEditExperience] = useState(false);
    const [editMultipleExperiences, setEditMultipleExperiences] = useState<boolean[]>([]);
    const [editEducation, setEditEducation] = useState(false);
    const [editMultipleEducations, setEditMultipleEducations] = useState<boolean[]>([]);
    const [editCourse, setEditCourse] = useState(false);
    const [editMultipleCourses, setEditMultipleCourses] = useState<boolean[]>([]);
    const [editLanguage, setEditLanguage] = useState(false);
    const [editMultipleLanguages, setEditMultipleLanguages] = useState<boolean[]>([]);
    const [editLink, setEditLink] = useState(false);
    const [editMultipleLinks, setEditMultipleLinks] = useState<boolean[]>([]);
    const [editAbout, setEditAbout] = useState(false);
    const [editSkill, setEditSkill] = useState(false);
    const [editSummary, setEditSummary] = useState(false);
    
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>(initialMultipleErrors)

    const [previewMode, setPreviewMode] = useState(false);
    const [alertError, setAlertError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
    const [progress, setProgress] = useState(0);



    const params = useParams();
    const username = params['*'];

    

    const renderFieldErrorMultiple = (
      field: string, 
      index: number, 
      errorKey: string, 
      error: MultipleErrorResponse | undefined) => {
      if (error && error[field] && typeof error[field][index] === "object" && 
      error[field][index].hasOwnProperty(errorKey)) {
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

   
    //single getData
    const getData = async (
      setData: GetDataFunction,
      endpoint: string,
      id?: number,
    ) => {
      let path = `${endpoint}/${username}`
      if (id){  
        path = `${endpoint}/${username}/${id}`
      }
        try{
            const response = await axios.get(path, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
            if (setData) {
                setData(response.data);
              }
            const data = response.data;

            if(response.status === 200){
            }
        }catch(error: any){
            const axiosError = error as AxiosError<ErrorResponse>;
            if (error.response && error.response.status === 401) {
                // Unauthorized - Logout the user
                logoutUser();
              }
            else if (error.response && (error.response.status !== 400)) {
                setError(axiosError)
                
            } 
            else {
                // Handle other errors here
                
                console.error('Error fetching profile:', error);
                console.log(axiosError)
                setError(axiosError);
              }
        }
    }
//////////////////////////////////////////////////////////////

    const editData = async (
      state: EditDataFunction,
      editField: React.Dispatch<React.SetStateAction<boolean>> | undefined,
      endpoint: string,
      errorField: string,
      index: number = 0,

    ) =>{
      try{
          const response = await axios.put(`${endpoint}/${username}`, state,  {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
            if (editField){
              editField(false)
            }
          removeMultipleErrors(`${errorField}`, index)
          console.log(state)
      }catch (error: any) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
        else if (error.response && (error.response.status !== 400)) {
          setError(axiosError)
        }
          removeMultipleErrors(`${errorField}`, index)
          
          if (axiosError.response?.data) {
            handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
          }
          console.log(error);
        }
  }

///////////////////////////////////////
    // EXPIRIENCE

    const sendMultipleData = async (
      state: EditDataFunction,
      editField: React.Dispatch<React.SetStateAction<boolean>>,
      setData: GetDataFunction,
      cleanState: (() => void) | null = null,
      endpoint: string,
      errorField: string,
      index: number = 0,
    ) =>{
        try{
            const response = await axios.post(`${endpoint}/${username}`, state,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              editField(false)

            removeMultipleErrors(`${errorField}`, index)
            getData(setData, `${endpoint}`);
            if (cleanState) cleanState()
        }catch (error: any) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
          else if (error.response && (error.response.status !== 400)) {
            setError(axiosError)
          }
          removeMultipleErrors(`${errorField}`, index)
            
            if (axiosError.response?.data) {
              handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
            }
            console.log(error);
          }
    }


    const editMultipleData = async (
        state: EditMultipleDataFunction,
        editField: React.Dispatch<React.SetStateAction<boolean[]>>,
        setData: GetDataFunction,
        endpoint: string,
        errorField: string,
        index: number,
        id?: number
      ) =>{
        let path = `${endpoint}`
        if (id){  
          path = `${endpoint}/${username}/${id}`
        }
      try{
          const response = await axios.put(path, state[index],  {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
            
            editField((prevEdit) => {
              const newEdit = [...prevEdit];
              newEdit[index] = false;
              return newEdit;
              
            });
            getData(setData, `${endpoint}`);

            removeMultipleErrors(`${errorField}`, index)
      }catch (error: any) {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
        else if (error.response && (error.response.status !== 400)) {
          setError(axiosError)
        }
        removeMultipleErrors(`${errorField}`, index)
          
          if (axiosError.response?.data) {
              const keys = Object.keys(axiosError.response?.data)
              keys.forEach((key) => {
                  const newKey = key + `_${index}`;
                  axiosError.response!.data[newKey] = axiosError.response!.data[key];
                  delete axiosError.response!.data[key];
              });
              console.log(axiosError.response?.data)
              handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
            // setErr(axiosError.response.data);
          }
          console.log(error);
        }
  }

  
    const deleteData = async (
        editField: React.Dispatch<React.SetStateAction<boolean[]>> | undefined,
        setData: GetDataFunction,
        endpoint: string,
        // errorField: string,
        id: number
      ) =>{
      // console.log(id)
      try{
          const response = await axios.delete(`${endpoint}/${username}/${id}`, {
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + String(authTokens.access),
              },
            });
            if (editField){
            editField((prevEditExperiences) => {
              const newEditExperiences = [...prevEditExperiences];
              newEditExperiences[id] = false;
              return newEditExperiences;
            });
          }
            getData(setData, `${endpoint}`);
            setAlertError('Data deleted successfully');
            // removeMultipleErrors('experience', index)
      }catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
          // removeMultipleErrors('experience', index)
          const axiosError = error as AxiosError<ErrorResponse>;
          setAlertError('Something went wrong');

          console.log(error);
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




    const handleHide = async () =>{
      const pageElement = document.getElementById('page');
      if (pageElement) {
        const elements = pageElement.querySelectorAll('button, svg, .profile-svgs, .prevHidden');
        
        elements.forEach((element) => {
          if (previewMode) {
            element.classList.add('d-none');
          } else {
            element.classList.remove('d-none');
          }
        });
      }
    }
    // for preview mode
    useEffect(() => {
      handleHide();
    }, [previewMode]);

    const handlePreviewMode = () => {
      let forms = document.querySelectorAll('form');
      if (forms.length > 2){
        setAlertError('Close all forms in order to show preview');
        return false;
      }
      else{
        setPreviewMode(!previewMode);
        return true;
      }
      
    }

    const handleAnotherCV = () =>{
      let pageElement = document.getElementById('page');
      console.log(pageElement)
      let profStatus = document.getElementsByClassName('profileStatusHide');
      if (pageElement && username) {
        let elements = pageElement.querySelectorAll('button, svg, .profile-svgs, .prevHidden');
        let preview = document.getElementById('preview');
        let correctedUsername = username.slice(0, -1);
        console.log(user.username)
        console.log(correctedUsername)
        if (user.username !== correctedUsername){
          console.log(user.username)
          console.log(correctedUsername)
          elements.forEach((element) =>{
            element.remove();
          });
          Array.from(profStatus).forEach((element) => {
            element.remove();
          });
          if (preview){
            preview.remove();
          }
          
         
        }
    }
    return null;
  }


  const handleCopy = () => {
    let currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL);
    setAlertError('Profile link coppied successfully');
  };
  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      setIsLoading(true);

      const steps = 11; // Total number of steps
      let completedSteps = 0;

      const updateProgress = (completedSteps: number) => {
        completedSteps++;
        const newProgress = (completedSteps / steps) * 100;
        setProgress(newProgress);
      };

      const fetchDataAndUpdateProgress = async (setter: GetDataFunction, endpoint: string) => {
        await getData(setter, endpoint);
        completedSteps++;
        updateProgress(completedSteps);
      };
  
      await fetchDataAndUpdateProgress(setProfile, `/profile/`);
      await fetchDataAndUpdateProgress(setContact, `/profile/contact`);
      await fetchDataAndUpdateProgress(setSummary, `/profile/summary`);
      await fetchDataAndUpdateProgress(setExperience, `/profile/experience`);
      await fetchDataAndUpdateProgress(setEducation, `/profile/education`);
      await fetchDataAndUpdateProgress(setCourse, `/profile/course`);
      await fetchDataAndUpdateProgress(setLanguage, `/profile/language`);
      await fetchDataAndUpdateProgress(setSkill, `/profile/skill`);
      await fetchDataAndUpdateProgress(setAbout, `/profile/about`);
      await fetchDataAndUpdateProgress(setLink, `/profile/link`);
      await fetchDataAndUpdateProgress(setProfileStatus, `/profile/profileStatus`);
     
      
      // await handleAnotherCV();
      setIsLoading(false);
      
    };
    fetchData(); // Execute the data fetching function
    
  }, [username]);

  // works like useEffect but after rendering
  useLayoutEffect(() => {
    if (!isLoading) {
      handleAnotherCV();
    }
  }, [isLoading]);

    if (isLoading) {
      // return <p>Loading...</p>;
      return <Loading progress={progress} />
    }
    if (error){
      // console.log('error')
      return <ErrorPage axiosError={error} />
    }
    // if (alertError)
    // return <ProfileAlert error={alertError} setError={setAlertError} />

    return(

      <>
      
      {alertError && <ProfileAlert 
                error={alertError}
                setError={setAlertError} />}

      <div className='mx-4 my-2'>
        
        
        <div className='d-flex justify-content-center container my-1' id='preview'>
          <button className='btn btn-secondary w-100 rounded-4 mb-2' onClick={handlePreviewMode}>
            {previewMode ? 'Hide Preview' : 'Show Preview'}
          </button>
        </div>
        <div className="container shadow-lg rounded-2" id="page">
        
            <ProfilePersonal 
                personal={profile}
                setPersonal={setProfile}
                editData={editData}
                getData={getData}
                setEditPersonal={setEditPersonal}
                editPersonal={editPersonal}
                multipleErrors={multipleErrors}                                             
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
                alertError={alertError}
                setAlertError={setAlertError}
                username={username}
            />
            <ProfileContact
                contact={contact}
                setContact={setContact}
                editData={editData}
                getData={getData}
                setEditContact={setEditContact}
                editContact={editContact}     
                multipleErrors={multipleErrors}                                             
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}

            />
            <ProfileSummary
              summary={summary}
              setSummary={setSummary}
              editData={editData}
              getData={getData}
              setEditSummary={setEditSummary}
              editSummary={editSummary}
              multipleErrors={multipleErrors}                                             
              removeMultipleErrors={removeMultipleErrors}
              renderFieldErrorMultiple={renderFieldErrorMultiple}
            />

            <ProfileExperience
                experience={experience}
                setExperience={setExperience}
                editExperience={editExperience}
                setEditExperience={setEditExperience}
                editMultipleData={editMultipleData}
                getData={getData}
                sendMultipleData={sendMultipleData}
                singleExperience={singleExperience}
                setSingleExperience={setSingleExperience}
                editMultipleExperiences={editMultipleExperiences}
                setEditMultipleExperiences={setEditMultipleExperiences}
                multipleErrors={multipleErrors}
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
                deleteData={deleteData}
            />
            <ProfileEducation
                education={education}
                setEducation={setEducation}
                editEducation={editEducation}
                editMultipleData={editMultipleData}
                editMultipleEducations={editMultipleEducations}
                getData={getData}
                sendMultipleData={sendMultipleData}
                setEditMultipleEducations={setEditMultipleEducations}
                setSingleEducation={setSingleEducation}
                setEditEducation={setEditEducation}
                singleEducation={singleEducation}
                multipleErrors={multipleErrors}
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
                deleteData={deleteData}
            />
                <ProfileCourse
                  course={course}
                  setCourse={setCourse}
                  editCourse={editCourse}
                  editMultipleData={editMultipleData}
                  editMultipleCourses={editMultipleCourses}
                  getData={getData}
                  sendMultipleData={sendMultipleData}
                  setEditMultipleCourses={setEditMultipleCourses}
                  setSingleCourse={setSingleCourse}
                  setEditCourse={setEditCourse}
                  singleCourse={singleCourse}
                  multipleErrors={multipleErrors}
                  removeMultipleErrors={removeMultipleErrors}
                  renderFieldErrorMultiple={renderFieldErrorMultiple}
                  deleteData={deleteData}
            />

                <ProfileLanguage
                  language={language}
                  setLanguage={setLanguage}
                  editLanguage={editLanguage}
                  editMultipleData={editMultipleData}
                  editMultipleLanguages={editMultipleLanguages}
                  getData={getData}
                  sendMultipleData={sendMultipleData}
                  setEditMultipleLanguages={setEditMultipleLanguages}
                  setSingleLanguage={setSingleLanguage}
                  setEditLanguage={setEditLanguage}
                  singleLanguage={singleLanguage}
                  multipleErrors={multipleErrors}
                  removeMultipleErrors={removeMultipleErrors}
                  renderFieldErrorMultiple={renderFieldErrorMultiple}
                  deleteData={deleteData}
            />
            <ProfileSkill
              skill={skill}
              setSkill={setSkill}
              editSkill={editSkill}
              editMultipleData={editMultipleData}
              getData={getData}
              sendMultipleData={sendMultipleData}
              setSingleSkill={setSingleSkill}
              setEditSkill={setEditSkill}
              singleSkill={singleSkill}
              multipleErrors={multipleErrors}
              removeMultipleErrors={removeMultipleErrors}
              renderFieldErrorMultiple={renderFieldErrorMultiple}
              deleteData={deleteData}
            />

            <ProfileAbout
              about={about}
              setAbout={setAbout}
              editData={editData}
              getData={getData}
              setEditAbout={setEditAbout}
              editAbout={editAbout}
              multipleErrors={multipleErrors}                                             
              removeMultipleErrors={removeMultipleErrors}
              renderFieldErrorMultiple={renderFieldErrorMultiple}
            />

            <ProfileLink
                link={link}
                setLink={setLink}
                editLink={editLink}
                editMultipleData={editMultipleData}
                editMultipleLinks={editMultipleLinks}
                getData={getData}
                sendMultipleData={sendMultipleData}
                setEditMultipleLinks={setEditMultipleLinks}
                setSingleLink={setSingleLink}
                setEditLink={setEditLink}
                singleLink={singleLink}
                multipleErrors={multipleErrors}
                removeMultipleErrors={removeMultipleErrors}
                renderFieldErrorMultiple={renderFieldErrorMultiple}
                deleteData={deleteData}
            />
        </div>
           
        <div className='container'>
        
          <button className='btn btn-primary w-100 rounded-4 mt-3' onClick={handleCopy}>Copy Profile Link</button>
          
        </div>
        
        <div className='profileStatusHide'>
          <ProfileStatus
                profileStatus={profileStatus}
                getData={getData}
                setProfileStatus={setProfileStatus}
                editData={editData}
                alertError={alertError}
                setAlertError={setAlertError}
              />
          </div>
      </div>
      </>
    )
}
export default Profile