import { useContext, useState} from "react";
import axios from "axios";
import AuthContext from "../utils/AuthProvider";
import { AxiosError } from "axios";
import { ErrorResponse } from "./Profile";
import { MultipleErrorResponse } from './Profile';
import ProfileAlert from "./profileComponents/ProfileAlert";
import DeleteModal from "./DeleteModal";
import ErrorPage from "./ErrorPage";
import { ProfileSettingsProps } from "./ProfileSettingsUsername";

interface ProfileData {
    current_password: string;
  }

  const initialMultipleErrors: MultipleErrorResponse = {
    userData: {},
  };
const ProfileSettingsDelete: React.FC<ProfileSettingsProps> = ({ setAlertError }) =>{

    const {authTokens, user, logoutUser } = useContext(AuthContext);
    const [profile, setProfile] = useState<ProfileData | null>({
      current_password: "",
  });
    const [err, setErr] = useState<{ [key: string]: string[] } | null>(null);
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>(initialMultipleErrors)
    // const [alertError, setAlertError] = useState('');
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);

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

    const handleForm = (e: React.FormEvent<HTMLFormElement>) =>{
        
        
        e.preventDefault()
    }

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        const { name, value } = event.target;
      
        
        setProfile((prevProfile) => ({
        ...prevProfile!,
        [name]: value,
        }));

      };

    
    const handleDisabled = () => {
        return (
            profile?.current_password === ''
        );
    };


    const deleteProfile = async (
        errorField: string,
        index: number = 0,
    ) =>{
        try {
            const response = await axios.post(`/profile/settings/${user.user_id}`, profile, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
            });
            removeMultipleErrors(`${errorField}`, index)
            const data = response.data;
            if (response.status === 204) {
                setAlertError('Account deleted successfully success')
                logoutUser();
               
                
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
                
                if (axiosError.response?.data) {
                    handleMultipleErrors(`${errorField}`, index, axiosError.response?.data)
                }
              console.error('Error:', error);
              
            }
          }
    }
    
    const saveEdit = async () =>{
        await deleteProfile('userData');
    }
    if (error){
      return <ErrorPage axiosError={error} />
    }
    
    return (
        <div className="container">

            {/* {alertError && <ProfileAlert 
                error={alertError}
                setError={setAlertError} />} */}

            <div className="container">
                <div className="text-center">   
                    {err && err.error && (
                        <span className="text-danger">{err.error[0]}</span>
                        )}
                </div>
                
            </div>
        <h1 className="text-center display-3 mb-5 mt-3">Delete Account</h1>
        <div className="row justify-content-center pt-4">
            <div className="col-sm-12 col-md-8 col-lg-6">
            <form onSubmit={e => handleForm(e)}>
                
                <div className="mb-3">
                  <label htmlFor="current_password" className="form-label">Password:</label>
                  <div className="">
                      <input 
                      name="current_password" 
                      type="password" 
                      onChange={(e) => handleInputChange(e)} 
                      required
                      className={`form-control${renderFieldErrorMultiple('userData', 0, `current_password`, multipleErrors) ? ' is-invalid' : ''}`} 
                      />
                      {renderFieldErrorMultiple('userData', 0, `current_password`, multipleErrors)}
                  </div>
                </div>

                

                <div className="d-grid py-2 text-center">
                  <div
                    className={`btn btn-danger btn-block ${handleDisabled() && `disabled`}`}
                    style={{ pointerEvents: handleDisabled() ? 'none' : 'auto' }}
                    >
                    <DeleteModal id={`${user.user_id}`} 
                    name={'Delete Account'} 
                    message={'Do you want to delete your account?'} 
                    deleteName = {'Change'}
                    onDelete={() => saveEdit()} />
                  </div>      
                </div>

            </form>
            </div>
        </div>
    </div>
)
}

export default ProfileSettingsDelete;
