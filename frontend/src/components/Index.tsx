import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { AxiosError } from "axios";
import { ErrorResponse } from "./Profile";
import AuthContext from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";

interface ProfileData {
    username: string;
    email: string;
  }

const Index: React.FC = () =>{

    const { authTokens, user, logoutUser } = useContext(AuthContext);
    let [profile, setProfile] = useState<ProfileData | null>(null)
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
    const [loading, setIsLoading] = useState(false);
    // console.log(localStorage)
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () =>{
          setIsLoading(true)
          await getProfile()
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
          // console.log(data)
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
      if (loading){
        return (
          <div>
            loading...
          </div>
        )
      }

    return (
        <div className="">
            <p>You are logged in to the homepage!</p>
            <p>Name: {profile?.username}</p>
            <p>Email: {profile?.email}</p>
            <button type='button' onClick={() => navigate(`/profile/${user.username}/`)}>Create Profile</button>

        </div>
    )
}
export default Index;