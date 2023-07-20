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
        <nav className="bg-primary-normal-500">
            
            <div className="max-w py-2 px-2 flex-wrap flex justify-between align-baseline">
                <div className="">
                    <Link to='/' className="text-2xl font-bold">AppliGate</Link>
                </div>
                
               
                    <div onClick={hamburgerMenu} >
                        {small && <Icon path={mdiMenu} size={1.25} className="cursor-pointer" /> }
                    </div>
                

                <div className={`${small ? 'hidden' : 'block'} h-auto self-center`}>

                {user ? (
                    <div className="flex gap-4">
                        <p className="text-text-dark">Hello {user.username}!</p>
                        <p onClick={logoutUser} className="text-text-dark hover:text-text-light cursor-pointer">Logout</p>
                    </div>
                    
                ) : (
                    
                        <ul className="flex gap-4">
                            <li><Link to='/login' className="text-text-dark hover:text-text-light">Login</Link></li>
                            <li><Link to='/register' className="text-text-dark hover:text-text-light">SignUp</Link></li>
                        </ul>
                        
    
                    
                )}
             
                </div>
            </div>
            
        </nav>
    )

}
export default Navbar;