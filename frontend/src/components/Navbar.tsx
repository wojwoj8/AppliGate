import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () =>{

    const [isAuth, setIsAuth] = useState(false);
    useEffect(() =>{
        if (localStorage.getItem('access_token') !== null){
            setIsAuth(true);
        }
    }, [isAuth])
    return(
        <div>
            {isAuth ? (
                <Link to='/logout'>Logout</Link>
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