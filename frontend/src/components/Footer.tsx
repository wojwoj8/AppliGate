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
        <footer className="navbar border-top border-2 border-primary bg-body-tertiary justify-content-center " data-bs-theme="dark">
  <div className="d-flex justify-content-between align-items-center px-4 py-2">
    <Link to="https://github.com/wojwoj8" className="text-decoration-none d-flex align-items-center">
      <span className="me-2">Created by wojwoj8</span>
      <Icon path={mdiGithub} size={1} className="text-white" />
    </Link>

  </div>
</footer>
    )
    
}

export default Footer;