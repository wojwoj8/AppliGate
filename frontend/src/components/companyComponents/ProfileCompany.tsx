import React, { useState, useEffect, useContext, useLayoutEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import AuthContext from '../../utils/AuthProvider';

import ProfileAlert from '../profileComponents/ProfileAlert';
import ErrorPage from '../ErrorPage';
import Loading from '../Loading';
import ProfileCompanyMain from './companyProfileComponents/ProfileCompanyMain';

export interface ProfileCompanyMainData{
    first_name: string;
    last_name: string;
    date_of_birth: string;
    country: string;
    city: string;
    current_position: string;
    profile_image: string;
    background_image: string;
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
    | UpdateFunction<ProfileCompanyMainData>
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
    ProfileCompanyMainData | null |
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
    profileMain: {},
    experience: {}
  };
  
  const ProfileCompany: React.FC = () =>{
  
      // Data for all components
      const [profileMain, setProfileMain] = useState<ProfileCompanyMainData | null>(null);
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
  
      // Where is only one data in component (only contact data etc.)
      const [singleCourse, setSingleCourse] = useState<CourseData | null>(null);
      const [singleExperience, setSingleExperience] = useState<ExperienceData | null>(null);
      const [singleEducation, setSingleEducation] = useState<EducationData | null>(null);
      const [singleLanguage, setSingleLanguage] = useState<LanguageData | null>(null);
      const [singleLink, setSingleLink] = useState<LinkData | null>(null);
      const [singleSkill, setSingleSkill] = useState<SkillData | null>(null);
      
  
      // Authtoken for CRUD and user for username and logout
      const { authTokens, user, logoutUser } = useContext(AuthContext);
  
      // To chech if given form is in edit state
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
      
      // All errors for all fields
      const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>(initialMultipleErrors)
  
      // To check how others see your CV
      const [previewMode, setPreviewMode] = useState(false);
      // For alert component
      const [alertError, setAlertError] = useState('');
      // Is page still loading (fetching data)
      const [isLoading, setIsLoading] = useState(true);
      // Axios error for error component
      const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
      // Loading bar
      const [progress, setProgress] = useState(0);
  
  
      // For getting username from url
  
      const params = useParams();
      const username = params['*'];
  
      
  
      // Universal method for rendering errors under given inputs, gets
      // field: key of error section like language
      // index of given item in state array like language[1]
      // errorKey: input field name
      // my array of errors
  
  
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
  
     
      // Universal get
      // setData: setter for my state
      // endpoint: endpoint
      // id: optional id of item in db
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
                  
                  console.error('Error fetching profile:', error);
                  console.log(axiosError)
                  setError(axiosError);
                }
          }
      }
  
  
      // Universal put for states where state is just object
      // state: given state, for example singleLanguage
      // editField: state of given item/form (if is opened or closed)
      // endpoint: endpoint
      // errorField: given section error key like language, 
      // for remove all language errors under given index because I store errors like:
      // multipleErrors: {key: {index: {fileld_index: Array of errors}}}
      // index: index of given object in state array, default 0
  
      const editData = async (
        state: EditDataFunction,
        editField: React.Dispatch<React.SetStateAction<boolean>> | undefined,
        endpoint: string,
        errorField: string,
        index: number = 0,
  
      ) =>{
        console.log(state)
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
  
      // Universal post for states where state is array of objects or just object
      // state: given state, for example language[] or singleLanguage
      // editField: state of given item/form (if is opened or closed)
      // setData : react set state for given state
      // cleanState: setState to null to reset given field in order to add another one
      // endpoint: endpoint
      // errorField: given section error key like language, 
      // for remove all language errors under given index because I store errors like:
      // multipleErrors: {key: {index: {fileld_index: Array of errors}}}
      // index: index of given object in state array, default 0
  
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
  
  
      // Universal put for states where state is array of objects
      // state: given array of objects, for example language[]
      // editField: state of given item/form (if is opened or closed)
      // setData : react set state for given state
      // endpoint: endpoint
      // errorField: given section error key like language, 
      // for remove all language errors under given index because I store errors like:
      // multipleErrors: {key: {index: {fileld_index: Array of errors}}}
      // index: index of given object in state array
      // id: id in database of given object
      
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
            // serializer for errors
            if (axiosError.response?.data) {
                const keys = Object.keys(axiosError.response?.data)
                keys.forEach((key) => {
                    const newKey = key + `_${index}`;
                    axiosError.response!.data[newKey] = axiosError.response!.data[key];
                    delete axiosError.response!.data[key];
                });
                
                handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
              
            }
            
          }
    }
  
    
      // Universal delete Data, make possible to delete given item from list, gets:
      // editField: state of given item/form (if is opened or closed)
      // setData: react set state for given data
      // endpoint just backend endpoint as a string
      // id - item id for endpoint and clearing
      const deleteData = async (
          editField: React.Dispatch<React.SetStateAction<boolean[]>> | undefined,
          setData: GetDataFunction,
          endpoint: string,
          id: number
        ) =>{
        try{
            const response = await axios.delete(`${endpoint}/${username}/${id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              // set editFields to false => set state of that form to closed
              if (editField){
              editField((prevEditExperiences) => {
                const newEditExperiences = [...prevEditExperiences];
                newEditExperiences[id] = false;
                return newEditExperiences;
              });
            }
              getData(setData, `${endpoint}`);
              setAlertError('Data deleted successfully');
        }catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
            setAlertError('Something went wrong');
  
            console.log(error);
          }
    }
  
  
      // For handling errors in correct inputs in correct places where are multiple items like work1 and work2
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
  
      // For removing list of errors in given section
      const removeMultipleErrors = (key: string, index: number) => {
        setMultipleErrors((prevState) => ({
          ...prevState,
          [key]: {
            ...(prevState[key] || {}),
            [index]: {}
          }
        }));
      };
  
  
  
  
      // Handle hide interactive elements on cv for preview mode
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
  
      // To make preview mode by removing most of interactive elements while looking at others cv
      const handleAnotherCV = () =>{
        let pageElement = document.getElementById('page');
        let profStatus = document.getElementsByClassName('profileStatusHide');
        if (pageElement && username) {
          let elements = pageElement.querySelectorAll('button, svg, .profile-svgs, .prevHidden');
          let preview = document.getElementById('preview');
          let correctedUsername = username.slice(0, -1);
          if (user.username !== correctedUsername){
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
  
  
    // To handle copy to clipboard button at the bottom of page
    const handleCopy = () => {
      let currentURL = window.location.href;
      navigator.clipboard.writeText(currentURL);
      setAlertError('Profile link coppied successfully');
    };
  
    // For fetching data
    useEffect(() => {
      const fetchData = async () => {
        setError(null);
        setIsLoading(true);
  
        const steps = 11; // Total number of steps for loading bar
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
    
        await fetchDataAndUpdateProgress(setProfileMain, `/company/profile/`);
        // await fetchDataAndUpdateProgress(setContact, `/profile/contact`);
        // await fetchDataAndUpdateProgress(setSummary, `/profile/summary`);
        // await fetchDataAndUpdateProgress(setExperience, `/profile/experience`);
        // await fetchDataAndUpdateProgress(setEducation, `/profile/education`);
        // await fetchDataAndUpdateProgress(setCourse, `/profile/course`);
        // await fetchDataAndUpdateProgress(setLanguage, `/profile/language`);
        // await fetchDataAndUpdateProgress(setSkill, `/profile/skill`);
        // await fetchDataAndUpdateProgress(setAbout, `/profile/about`);
        // await fetchDataAndUpdateProgress(setLink, `/profile/link`);
        // await fetchDataAndUpdateProgress(setProfileStatus, `/profile/profileStatus`);
       
        
        
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
        return <Loading progress={progress} />
      }
      if (error){
        return <ErrorPage axiosError={error} />
      }
  
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
          <div className="container shadow-lg rounded-2 text-break" id="page">
          
          {/* Every interface takes some functions/data/states from profile and 
          assign them through interface, some components have some functions, but 
          most of them are built to utilize those passed functions in some way */}
              <ProfileCompanyMain 
                personal={profileMain}
                setPersonal={setProfileMain}
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
          </div>
             
          <div className='container'>
          
            <button className='btn btn-primary w-100 rounded-4 mt-3' onClick={handleCopy}>Copy Profile Link</button>
            
          </div>
          
            <div className='profileStatusHide'>

                {/* <ProfileStatus
                  profileStatus={profileStatus}
                  getData={getData}
                  setProfileStatus={setProfileStatus}
                  editData={editData}
                  alertError={alertError}
                  setAlertError={setAlertError}
                /> */}
            </div>
        </div>
        </>
      )
  }
  export default ProfileCompany