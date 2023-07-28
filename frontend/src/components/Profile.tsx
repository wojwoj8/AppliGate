import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ProfileData{
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    residence: string;
}

const Profile: React.FC = () =>{
    const [profile, setProfile] = useState<ProfileData | null>(null)
    
    return(
        <div className="container-sm">
            <div className="container-fluid text-center">
                <span>First Name Last Name</span>
                <p>Date of birth, Residence</p>
                
            </div>
        </div>
    )
}
export default Profile