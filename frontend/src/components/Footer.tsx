import Icon from '@mdi/react';
import { mdiGithub } from '@mdi/js';
import { Link } from 'react-router-dom';
import AuthContext from '../utils/AuthProvider';
import { useContext } from 'react';

const Footer: React.FC = () =>{
    const authContext = useContext(AuthContext);
    const { user, logoutUser } = authContext;
    return(
        // <footer className="navbar bg-body-tertiary bg-primary mt-auto  bg-dark" data-bs-theme="dark">
            
        //         <div className="container h-2 ">
        //         <p className='navbar-brand'>Created by wojwoj8 </p>
        //         <Link to='https://github.com/wojwoj8'>
        //             <Icon className='text-white' path={mdiGithub} size={1} />wojwoj8
        //         </Link>
                
        //         </div>
        // </footer>
        <footer className="navbar d-flex px-0 px-sm-3 flex-wrap justify-content-between align-items-center py-2 mt-4 border-top bg-body-tertiary " data-bs-theme="dark">
            <p className="col-sm-4 mb-0 ps-2 pe-sm-0 pe-2 text-white">AppliGate</p>

             <Link to='https://github.com/wojwoj8' className='col-sm-4 d-flex align-items-center justify-content-center mb-0 mx-4 mx-sm-0 mb-sm-3 mb-md-0 me-md-auto  text-decoration-none'>
                Created by wojwoj8 <Icon className='text-white' path={mdiGithub} size={1} />
                </Link>


                <ul className="nav navbar-nav col-sm-4 d-flex flex-row justify-content-end">
                    {user ? (
                        <>
                        <li className="nav-item">
                            <a href="/" className="nav-link px-2">Home</a>
                        </li>
                        <li className="nav-item">
                            <a href="/profile" className="nav-link px-2">Profile</a>
                        </li>
                        <li className="nav-item" onClick={logoutUser}>
                            <a href="/" className="nav-link px-2">Log Out</a>
                        </li>
                        </>
                    ) : (
                        <>
                        <li className="nav-item">
                            <a href="/login" className="nav-link px-2">Log In</a>
                        </li>
                        <li className="nav-item">
                            <a href="/register" className="nav-link px-2">Sign Up</a>
                        </li>
                        </>
                    )}
                    </ul>
        </footer>
    )
    
}

export default Footer;