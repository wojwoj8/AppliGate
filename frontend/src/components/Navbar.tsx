import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";

const Navbar: React.FC = () =>{
    
    const authContext = useContext(AuthContext);
    if (!authContext) {
        // Handle the case when context is undefined
        return null; // or return a loading state, error message, or fallback UI
      }
      const { user, logoutUser } = authContext;

    return(
        <div>
            {user ? (
                <div>
                    <p>Hello {user.username}!</p>
                    <p onClick={logoutUser}>Logout</p>
                </div>
                
            ) : (
                <div>
                    <Link to='/login'>Login</Link>
                    <Link to='/register'>SignUp</Link>
                    <Link to='/logout'>Logout</Link>
                </div>
                
            )}
            
        </div>
    )

}
export default Navbar;