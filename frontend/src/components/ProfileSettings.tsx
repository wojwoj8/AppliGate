import { Link } from "react-router-dom";

const ProfileSettings: React.FC = () =>{

    
    return (
        <div className="container">
            <h1 className="text-center display-2 mb-5 mt-3">Settings</h1>
            <div className="pt-5 d-flex flex-column align-items-center col-lg-8 col-12 center mx-auto">
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