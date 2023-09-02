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
          const response = await axios.get('/index/', {
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
      <div className="">
        <div className="container text-center py-3">
          <h2 className="my-3">
            Hi {profile?.username}, are you ready to create or edit your CV?
          </h2>
          <p className="lead mb-4">
            Show off your skills and experience with a professional CV. 
          </p>

          <Link to={`/profile/${profile?.username}/`} className="btn btn-primary btn-lg me-3">
            Create/Edit Your CV
          </Link>
          <p className="lead mb-4 mt-4">
            Also remember to change your profile to public at the bottom of profile in order to share your CV!
          </p>
          <p className="lead mb-4">
            Want some inspiration? Check out my own CV.
          </p>
          
          <Link to="/profile/q" className="btn btn-secondary btn-lg">
            Example Profile
          </Link>
        </div>
      </div>
  );
}
export default Index;