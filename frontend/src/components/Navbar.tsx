import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";

const Navbar: React.FC = () =>{
    
    const [toggle, setToggle] = useState(false);
    
    const hamburgerMenu = () =>{
        setToggle(prev => !prev)
    }
    const authContext = useContext(AuthContext);
    if (!authContext) {
        // Handle the case when context is undefined
        return null; // or return a loading state, error message, or fallback UI
      }
      const { user, logoutUser } = authContext;

    return(
        <nav className="bg-primary-normal-500">
            <div className="max-w-screen-xl py-4 px-2 flex-wrap flex justify-between align-baseline">
                <div className="">
                    <Link to='/' className="text-2xl font-bold">AppliGate</Link>
                </div>
                <button onClick={hamburgerMenu} data-collapse-toggle="navbar-default" type="button" className="inline-flex items-center p-2 w-8 h-8 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
                <div
                    className={`${
                        toggle ? ('block'? (`top-16`) : (`top-0`)) : ('hidden')
                    } md:block absolute  right-0 bg-gray-900 bg-opacity-75 h-screen w-full md:h-auto md:relative md:bg-transparent md:w-auto`}
                    id="navbar-default"
        >
                {/* <div className="hidden w-full md:block md:w-auto" id="navbar-default"> */}
                    
                {user ? (
                    <div className="flex gap-4">
                        <p className="text-text-dark">Hello {user.username}!</p>
                        <p onClick={logoutUser} className="text-text-dark hover:text-text-light cursor-pointer">Logout</p>
                    </div>
                    
                ) : (
                    <div className="flex justify-between gap-4">
                        <Link to='/login' className="text-text-dark hover:text-text-light">Login</Link>
                        <Link to='/register' className="text-text-dark hover:text-text-light">SignUp</Link>
                    </div>
                    
                )}
                </div>
            </div>
            
        </nav>
    )

}
export default Navbar;