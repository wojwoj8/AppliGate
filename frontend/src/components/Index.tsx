import { useContext, useState, useEffect } from "react";
// import axios from "axios";
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

    const getProfile = async() => {
        let response = await fetch('/index/', {
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization':'Bearer ' + String(authTokens.access)
        }
        })
        let data = await response.json()
        // console.log(data)
        if(response.status === 200){
            setProfile(data)
        } else if(response.statusText === 'Unauthorized'){
            logoutUser()
        }
    }

    return (
        <div>
            <p>You are logged in to the homepage!</p>
            <p>Name: {profile?.username}</p>
            <p>Email: {profile?.email}</p>
            <button type='button' onClick={() => navigate('/profile')}>Create Profile</button>
        </div>
    )
}
export default Index;