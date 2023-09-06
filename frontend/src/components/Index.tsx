import { useContext, useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from "axios";
import { AxiosError } from "axios";
import { ErrorResponse } from "./Profile";
import ErrorPage from "./ErrorPage";
import AuthContext from "../utils/AuthProvider";
import Loading from './Loading';

interface ProfileData {
    username: string;
    email: string;
  }

const Index: React.FC = () =>{

    const { authTokens, logoutUser } = useContext(AuthContext);
    let [profile, setProfile] = useState<ProfileData | null>(null)
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
    const [loading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    

    useEffect(() => {
        const fetchData = async () =>{
          setIsLoading(true)
          setProgress(50)
          await getProfile()
          setProgress(100)
          setIsLoading(false)
        }

        fetchData();
        
    },[])

    const getProfile = async () => {
        try {
          const response = await axios.get('https://appligate.onrender.com/index/', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(authTokens.access),
            },
          });
    
          const data = response.data;
          if (response.status === 200) {
            setProfile(data);
          }
        } catch (error: any) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          } else if (error.response && (error.response.status !== 400)) {
            setError(axiosError)
          }
        }
      };
    
      if (error){
        return <ErrorPage axiosError={error} />
      }
      if (loading) {
        return <Loading progress={progress} />
      }

    return (
<div className="container my-5">
  <div className="text-center pb-5">
    <h2 className="display-4 fw-bold">Welcome, {profile?.username}!</h2>
    <p className="lead">Are you ready to create or edit your professional CV?</p>
  </div>
  <div className="row justify-content-center">
    <div className="col-lg-4 mb-4 order-lg-1 order-3">
      <div className="card h-100">
        <div className="card-body">
          <h3 className="card-title">Manage Your Profile Settings</h3>
          <p className="card-text">
            Easily update your personal information or remove your account with just a few clicks.
          </p>
        </div>
        <div className="card-footer">
          <Link to="/profileSettings" className="btn btn-secondary btn-block w-100">Go to Profile Settings</Link>
        </div>
      </div>
    </div>
    <div className="col-lg-4 mb-4 order-lg-2 order-1">
      <div className="card h-100">
        <div className="card-body">
          <h3 className="card-title">Create/Edit Your CV</h3>
          <p className="card-text">
            Craft and enhance your professional CV. Add details about your work experience, education, skills, and more to create an outstanding resume.
          </p>
        </div>
        <div className="card-footer">
          <Link to={`/profile/${profile?.username}/`} className="btn btn-primary btn-block w-100">Create/Edit Your CV</Link>
        </div>
      </div>
    </div>
    <div className="col-lg-4 mb-4 order-lg-3 order-2">
      <div className="card h-100">
        <div className="card-body">
          <h3 className="card-title">Get Inspired</h3>
          <p className="card-text">
            Take a look at my own CV as an example. I hope it can provide valuable insights to help you improve your own CV.
          </p>
        </div>
        <div className="card-footer">
          <Link to="/profile/q" className="btn btn-secondary btn-block w-100">View CV Example</Link>
        </div>
      </div>
    </div>
  </div>
  <div className="row justify-content-center mb-4 mt-lg-5 mt-0">
    <div className="col-lg-6 mb-4">
      <div className="card h-100">
        <div className="card-body">
          <h3 className="card-title">Make Your Profile Public</h3>
          <p className="card-text">
            Share your CV with others by setting it to public. It's as easy as clicking a button at the bottom of your resume!
          </p>
        </div>
      </div>
    </div>
    <div className="col-lg-6 mb-4">
      <div className="card h-100">
        <div className="card-body">
          <h3 className="card-title">Preview Your CV</h3>
          <p className="card-text">
            Use the preview mode to see how others will view your CV before making it public. Get it just right!
          </p>
        </div>
      </div>
    </div>
  </div>
</div>

  );
}
export default Index;