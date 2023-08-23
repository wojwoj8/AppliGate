import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../utils/AuthProvider";
import { ErrorResponse } from "./Profile";

interface ProfileData {
    username: string;
    email: string;
  }

const ProfileSettingsPassword: React.FC = () =>{

    const {authTokens, user, logoutUser } = useContext(AuthContext);
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [err, setErr] = useState<{ [key: string]: string[] } | null>(null);

    useEffect(() => {
        getProfile()
    },[])

    const handlePassword = (e:string) =>{
        setPassword(e)
    }
    const handleConfirm = (e:string) =>{
        setConfirm(e)
    }
    const handleForm = (e: React.FormEvent<HTMLFormElement>) =>{
        setErr({})
        if (password === confirm){
            setErr({})
        }
        else{
            setErr({
                confirm: ['Passwords are not the same']
              });
        }
        
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
        return password === '';

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
        } catch (error: any) {
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          } else {
            // Handle other errors here
            console.error('Error fetching profile:', error);
          }
        }
      };

    const changeProfie = async () =>{
        try {
            const response = await axios.put(`profile/settings/${user.user_id}`, profile, {
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
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              // Unauthorized - Logout the user
              logoutUser();
            } else {
              // Handle other errors here
              console.error('Error fetching profile:', error);
            }
          }
    }
    

    return (
        <div className="container">
            <div className="container">
                <div className="text-center">   
                    {err && err.error && (
                        <span className="text-danger">{err.error[0]}</span>
                        )}
                </div>
                
            </div>
        <h1 className="text-center display-4">Change Your Password</h1>
        <div className="row justify-content-center mt-4">
            <div className="col-sm-12 col-md-8 col-lg-6">
            <form onSubmit={e => handleForm(e)}>
                
                <div className="mb-3">
                <label htmlFor="password" className="form-label">Current Password:</label>
                <div className="">
                    <input 
                    name="password" 
                    type="password" 
                    onChange={data => handlePassword(data.target.value)} 
                    required
                    className="form-control"
                    />
                </div>
                </div>

                <div className="mb-3">
                <label htmlFor="newpassword" className="form-label">New Password:</label>
                <div className="">
                    <input 
                    name="newpassword" 
                    type="password" 
                    onChange={data => handleConfirm(data.target.value)} 
                    
                    className={`form-control ${err && err.confirm && 'is-invalid'}`}
                    />
                </div>
                {err && err.confirm && (
                            <span className="text-danger">{err.confirm[0]}</span>
                            )}
                </div>

            

                <div className="d-grid py-2 text-center">
                <button 
                    type="submit" 
                    className={`btn btn-primary btn-block`}
                    disabled={handleDisabled()}
                    onClick={changeProfie}
                >
                    Change Password
                </button>      
                </div>

            </form>
            </div>
        </div>
    </div>
)
}
export default ProfileSettingsPassword;