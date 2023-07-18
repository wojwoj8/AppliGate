import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () =>{

    const [user, setUser] = useState('')

    return(
        <div>
            {user ? (
                <div>
                    <p>Hello {user}!</p>
                    <Link to='/logout'>Logout</Link>
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