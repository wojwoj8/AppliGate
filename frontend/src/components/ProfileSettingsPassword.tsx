import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../utils/AuthProvider";
import { AxiosError } from "axios";
import { ErrorResponse } from "./Profile";
import { MultipleErrorResponse } from './Profile';
import ProfileAlert from "./profileComponents/ProfileAlert";
import DeleteModal from "./DeleteModal";
import ErrorPage from "./ErrorPage";

interface ProfileData {
    current_password: string;
    new_password: string;
    confirm_password: string;
  }

  const initialMultipleErrors: MultipleErrorResponse = {
    userData: {},
  };
const ProfileSettingsPassword: React.FC = () =>{

    const {authTokens, user, logoutUser } = useContext(AuthContext);
    const [profile, setProfile] = useState<ProfileData | null>({
      current_password: "",
      new_password: "",
      confirm_password: "",
  });
    const [err, setErr] = useState<{ [key: string]: string[] } | null>(null);
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>(initialMultipleErrors)
    const [alertError, setAlertError] = useState('');
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
        // setData: GetDataFunction,
      ) => {
        const { name, value } = event.target;
      
        
        setProfile((prevProfile) => ({
        ...prevProfile!,
        [name]: value,
        }));

      };

    
    const handleDisabled = () => {
        return (
            profile?.current_password === '' ||
            profile?.new_password === '' ||
            profile?.confirm_password === ''
        );
    };


    const changeProfile = async (
        errorField: string,
        index: number = 0,
    ) =>{
        try {
            const response = await axios.put(`/profile/settings/changepassword/${user.user_id}`, profile, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
            });
            removeMultipleErrors(`${errorField}`, index)
            const data = response.data;
            // console.log(data)
            if (response.status === 200) {
                setAlertError('Password changed successfully')
                setProfile({
                  current_password: "",
                  new_password: "",
                  confirm_password: "",
              });
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
              console.error('Error fetching profile:', error);
            }
          }
    }
    
    const saveEdit = async () =>{
        await changeProfile('userData');

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
        <h1 className="text-center display-3 mb-5 mt-3">Change Your Password</h1>
        <div className="row justify-content-center pt-4">
            <div className="col-sm-12 col-md-8 col-lg-6">
            <form onSubmit={e => handleForm(e)}>
                
                <div className="mb-3">
                <label htmlFor="current_password" className="form-label">Current Password:</label>
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

                <div className="mb-3">
                <label htmlFor="new_password" className="form-label">New Password:</label>
                <div className="">
                    <input 
                    name="new_password" 
                    type="password" 
                    onChange={(e) => handleInputChange(e)}
                    
                    className={`form-control${renderFieldErrorMultiple('userData', 0, `new_password`, multipleErrors) ? ' is-invalid' : ''}`} 
                    />
                    {renderFieldErrorMultiple('userData', 0, `new_password`, multipleErrors)}
                </div>
                </div>

                <div className="mb-3">
                <label htmlFor="confirm_password" className="form-label">Confirm New Password:</label>
                <div className="">
                    <input 
                    name="confirm_password" 
                    type="password" 
                    onChange={(e) => handleInputChange(e)}
                    required
                    className={`form-control${renderFieldErrorMultiple('userData', 0, `confirm_password`, multipleErrors) ? ' is-invalid' : ''}`} 
                    />
                    {renderFieldErrorMultiple('userData', 0, `confirm_password`, multipleErrors)}
                </div>
                </div>

                <div className="d-grid py-2 text-center">
                <button 
                    type="submit" 
                    className={`btn btn-primary btn-block`}
                    disabled={handleDisabled()}
                >
                  <DeleteModal id={`${user.user_id}`} 
                  name={'Change Password '} 
                  message={'Do you want to change your password?'} 
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

export default ProfileSettingsPassword;
