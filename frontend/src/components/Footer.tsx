import Icon from '@mdi/react';
import { mdiGithub } from '@mdi/js';
import { Link } from 'react-router-dom';


const Footer: React.FC = () =>{
    return(
        <footer className="navbar border-top border-2 border-primary bg-body-tertiary justify-content-center " data-bs-theme="dark">
          <div className="d-flex justify-content-between align-items-center px-4 py-2">
            <Link to="https://github.com/wojwoj8" className="text-decoration-none d-flex align-items-center">
              <span className="me-2">Created by Wojciech Żubrowski</span>
              <Icon path={mdiGithub} size={1} className="text-white" />
            </Link>
          </div>
        </footer>
    )
    
}

export default Footer;