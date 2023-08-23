import { Link } from "react-router-dom";

const ProfileSettings: React.FC = () =>{

    
    return (
        <div className="container">
            <h1 className="text-center display-4">Settings</h1>
            <div className="d-flex flex-column align-items-center">
                <Link to="/profileSettings/userData" className="btn btn-primary mt-4 w-100">
                    Change Profile Data
                </Link>
                <Link to="/profileSettings/password" className="btn btn-primary mt-3 w-100">
                    Change Password
                </Link>
                <Link to="/profileSettings/delete" className="btn btn-danger mt-3 w-100">
                    Delete Account
                </Link>
            </div>
        </div>
)
}

export default ProfileSettings;