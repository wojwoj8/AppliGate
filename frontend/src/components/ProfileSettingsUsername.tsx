import { useContext, useState, useEffect, useRef } from "react";
import axios from "axios";
import AuthContext from "../utils/AuthProvider";
import { AxiosError } from "axios";
import { ErrorResponse } from "./Profile";
import ErrorPage from "./ErrorPage";
import { MultipleErrorResponse } from './Profile';
import ProfileAlert from "./profileComponents/ProfileAlert";
import DeleteModal from "./DeleteModal";
import Loading from "./Loading";

interface ProfileData {
    username: string;
    email: string;
    current_password: string;
  }

const initialMultipleErrors: MultipleErrorResponse = {
    userData: {},
  };

const ProfileSettingsUsername: React.FC = () =>{

    const {authTokens, user, logoutUser } = useContext(AuthContext);
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [err, setErr] = useState<{ [key: string]: string[] } | null>(null);
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>(initialMultipleErrors)
    const [alertError, setAlertError] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
      const fetchData = async () =>{
        setLoading(true);
        setProgress(50);
        await getProfile();
        setProgress(100);
        setLoading(false);
      }
      fetchData();
        
    },[])

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
    const handlePassword = (e:string) =>{
        setPassword(e)
    }

    const handleForm = (e: React.FormEvent<HTMLFormElement>) =>{
        
        
        e.preventDefault()
    }

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        // setData: GetDataFunction,
      ) => {
        const { name, value } = event.target;
      
        
        setProfile((prevProfile) => ({
        ...prevProfile!,
        [name]: value,
        }));

      };

    
    const handleDisabled = () =>{
        return profile?.current_password === undefined ||  profile?.current_password === '';

    }

    const getProfile = async () => {
        try {
          const response = await axios.get(`/profile/settings`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(authTokens.access),
            },
          });
    
          const data = response.data;
          // console.log(data)
          if (response.status === 200) {
            setProfile(data);
          }
        }catch (error: any) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
          else if (error.response && (error.response.status !== 400)) {
            setError(axiosError)
          }
        }
      };

    const changeProfile = async (
        errorField: string,
        index: number = 0,
    ) =>{
        try {
            const response = await axios.put(`/profile/settings/${user.user_id}`, profile, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
            });
            removeMultipleErrors(`${errorField}`, index)
            const data = response.data;
            // console.log(data)
            if (response.status === 200) {
                setAlertError('Data changed successfully')
                setProfile(data);
            }
          } catch (error: any) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (error.response && error.response.status === 401) {
              // Unauthorized - Logout the user
              logoutUser();
            }
            else if (error.response && (error.response.status !== 400)) {
              setError(axiosError)
            }
            else {
                removeMultipleErrors(`${errorField}`, index)
                const axiosError = error as AxiosError<ErrorResponse>;
                if (axiosError.response?.data) {
                    handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
                }
              console.error('Error fetching profile:', error);
            }
          }
    }
    
    const saveEdit = async () =>{
        await changeProfile('userData');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }


    if (loading){
      <Loading progress={progress} />

    }
    if (error){
      // console.log('error')
      return <ErrorPage axiosError={error} />
    }

    

    return (
        <div className="container">
            {alertError && <ProfileAlert 
                error={alertError}
                setError={setAlertError} />}

            <div className="container">
                <div className="text-center">   
                    {err && err.error && (
                        <span className="text-danger">{err.error[0]}</span>
                        )}
                </div>
                
            </div>
        <h1 className="text-center display-3 mb-5 mt-3">Change Your Data</h1>
        <div className="row justify-content-center pt-4">
            <div className="col-sm-12 col-md-8 col-lg-6">
            <form onSubmit={e => handleForm(e)}>
                <div className="mb-3">   
                <label htmlFor="username" className="form-label">Username:</label>
                
                <div className="">
                    <input 
                    name="username" 
                    type="text" 
                    value={profile?.username || ''}
                    onChange={(e) => handleInputChange(e)}
                    required
                    placeholder="account1"
                    className={`form-control${renderFieldErrorMultiple('userData', 0, `username`, multipleErrors) ? ' is-invalid' : ''}`}  
                    />
                    {renderFieldErrorMultiple('userData', 0, `username`, multipleErrors)}
                </div>
                {err && err.username && (
                            <span className="text-danger">{err.username[0]}</span>
                            )}
                </div>

                <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <div className="">
                    <input 
                    name="email" 
                    type="email" 
                    value={profile?.email || ''}
                    onChange={(e) => handleInputChange(e)}
                    required
                    placeholder="example@test.com"
                    className={`form-control${renderFieldErrorMultiple('userData', 0, `email`, multipleErrors) ? ' is-invalid' : ''}`} 
                    />
                    {renderFieldErrorMultiple('userData', 0, `email`, multipleErrors)}
                </div>
                
                {err && err.email && (
                            <span className="text-danger">{err.email[0]}</span>
                            )}
                </div>

                <div className="mb-3">
                    <label htmlFor="current_password" className="form-label">Password:</label>
                    <div className="">
                        <input 
                        name="current_password" 
                        type="password"
                        ref={inputRef} 
                        onChange={(e) => handleInputChange(e)} 
                        required
                        placeholder="Provide password to apply changes"
                        className={`form-control${renderFieldErrorMultiple('userData', 0, `current_password`, multipleErrors) ? ' is-invalid' : ''}`} 
                        />
                        {renderFieldErrorMultiple('userData', 0, `current_password`, multipleErrors)}
                    </div>
                </div>

                <div className="d-grid py-2 text-center">
                <button 
                    type="submit" 
                    className={`btn btn-primary btn-block`}
                    disabled={handleDisabled()}
                >
                  <DeleteModal id={`${user.user_id}`} 
                  name={'Change Account Data'} 
                  message={'Do you want to change your data?'} 
                  deleteName = {'Change'}
                  onDelete={() => saveEdit()} />
                    
                </button>      
                </div>

            </form>
            </div>
        </div>
    </div>
)
}
export default ProfileSettingsUsername;