import { useContext, useState, useEffect } from "react";
import axios from "axios";
import AuthContext from "../utils/AuthProvider";
import { useNavigate } from "react-router-dom";

interface ProfileData {
    username: string;
    email: string;
  }

const Index: React.FC = () =>{

    const { authTokens, logoutUser } = useContext(AuthContext);
    let [profile, setProfile] = useState<ProfileData | null>(null)
    // console.log(localStorage)
    const navigate = useNavigate();
    useEffect(() => {
        getProfile()
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
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          } else {
            // Handle other errors here
            console.error('Error fetching profile:', error);
          }
        }
      };
    

    return (
        <div>
            <p>You are logged in to the homepage!</p>
            <p>Name: {profile?.username}</p>
            <p>Email: {profile?.email}</p>
            <button type='button' onClick={() => navigate('/profile')}>Create Profile</button>
 
{/* <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
  Launch static backdrop modal
</button>

<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        ...
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Understood</button>
      </div>
    </div>
  </div>
</div> */}
        </div>
    )
}
export default Index;