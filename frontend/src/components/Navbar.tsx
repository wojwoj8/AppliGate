import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';

const Navbar: React.FC = () =>{
    
    const [toggle, setToggle] = useState(false);
    const [small, setSmall] = useState(false);
    
    const hamburgerMenu = () =>{
        
        setToggle(!toggle)
    }

    // handle unclicking button while expanded and expanding page

    useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth > 768 && toggle === true) {
            setToggle(false);
          }
        };
      
        window.addEventListener('resize', handleResize);
      
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [toggle]);
      
      useEffect(() => {
        const handleSmall = () => {
          if (window.innerWidth <= 1280 && !small) {
            setSmall(true);
          } else if (window.innerWidth > 1280 && small) {
            setSmall(false);
          }
        };
      
        handleSmall(); // Call handleSmall initially to set the correct 'small' state
        window.addEventListener('resize', handleSmall);
      
        return () => {
          window.removeEventListener('resize', handleSmall);
        };
      }, [small]);


    const authContext = useContext(AuthContext);
    if (!authContext) {
        // Handle the case when context is undefined
        return null; // or return a loading state, error message, or fallback UI
      }
      const { user, logoutUser } = authContext;

    return(
        <nav className="">
            
            <div className="">
                <div className="">
                    <Link to='/' className="">AppliGate</Link>
                </div>
                
               
                    <div onClick={hamburgerMenu} >
                        {small && <Icon path={mdiMenu} size={1.25} className="" /> }
                    </div>
                

                <div className={`${small ? 'hidden' : 'block'} h-auto self-center`}>

                {user ? (
                    <div className="">
                        <p className="">Hello {user.username}!</p>
                        <p onClick={logoutUser} className="">Logout</p>
                    </div>
                    
                ) : (
                    
                        <ul className="">
                            <li><Link to='/login' className="">Login</Link></li>
                            <li><Link to='/register' className="">SignUp</Link></li>
                        </ul>
                        
    
                    
                )}
             
                </div>
            </div>
            
        </nav>
    )

}
export default Navbar;