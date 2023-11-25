import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";
import NavbarJobOfferCreate from "./NavbarJobOfferCreate";
interface NavbarProps {
  setGlobalAlertError: (error: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({setGlobalAlertError}) =>{
    
    const [check, setCheck] = useState(false);
    useEffect(() => {
      const body = document.querySelector('body');
      const mode = localStorage.getItem('mode');
      
      if (body) {
        if (mode === 'dark') {
          body.id = 'dark';
          setCheck(true);
        } else {
          body.id = '';
          setCheck(false);
        }
      }
    }, []);
  
    const toggleDarkMode = () => {
      const body = document.querySelector('body');
      if (body) {
        if (check) {
          body.id = '';
          localStorage.setItem('mode', '');
          setCheck(false);
        } else {
          body.id = 'dark';
          localStorage.setItem('mode', 'dark');
          setCheck(true);
        }
      }
    };
    const authContext = useContext(AuthContext);
    if (!authContext) {
        // Handle the case when context is undefined
        return null; // or return a loading state, error message, or fallback UI
      }
      const { user, logoutUser } = authContext;
      

    return(
      <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
        <div className="container-fluid">
          <Link to='/' className="navbar-brand">AppliGate</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasNavbarLabel">AppliGate</h5>
              <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body">
            
            {user ? (
              // user as user
              (user.user_type === 'user') ?
              
              <ul className="navbar-nav text-primary justify-content-end flex-grow-1 pe-3">
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <p className="nav-link" aria-current="page">{user.user_type}</p>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to='/' className="nav-link" aria-current="page">Home</Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to='/example' className="nav-link">Example</Link>
                </li>

                <li className="nav-item dropdown-center">
                  <a className="nav-link dropdown-toggle" href="/profileSettings" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Job Offers
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item" data-bs-dismiss="offcanvas">
                      <Link to='/applications/1' className="nav-link" aria-current="page">My applications</Link>
                    </li>
                    <li className="dropdown-item" data-bs-dismiss="offcanvas">
                      <Link to='/jobofferlistings/1' className="nav-link" aria-current="page">Job Offers Listing</Link>
                    </li>
                    {/* <li className="dropdown-item" data-bs-dismiss="offcanvas">
                      <Link to='/company/myJobOffers' className="nav-link" aria-current="page">My Job Offers</Link>
                    </li> */}
                  </ul>
                </li>

                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to={`/profile/${user.username}/`} className="nav-link" aria-current="page">Profile</Link>
                </li>
                <li className="nav-item dropdown-center">
                  <a className="nav-link dropdown-toggle" href="/profileSettings" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Settings
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item" data-bs-dismiss="offcanvas">
                      <Link to='/profileSettings' className="nav-link" aria-current="page">Profile Settings</Link>
                    </li>
                    <li className="dropdown-item">
                      <div className="form-check form-switch form-check-reverse nav-link me-4 text-left d-table">
                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckCheckedReverse" 
                        onChange={toggleDarkMode}
                        checked={check}
                        data-bs-dismiss="offcanvas"
                        />  
                        <label className="form-check-label" htmlFor="flexSwitchCheckCheckedReverse">Dark Mode</label>
                      </div>
                    </li>
                    
                  </ul>
                </li>
               
                <li className="nav-item" onClick={logoutUser}>
                  <Link to='/' className="nav-link" data-bs-dismiss="offcanvas">Log Out</Link>
                </li>
               
              </ul>
              // logged in company user under
              :
              <ul className="navbar-nav text-primary justify-content-end flex-grow-1 pe-3">
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <p className="nav-link" aria-current="page">{user.user_type}</p>
                </li>
                <li className="nav-item dropdown-center">
                  <a className="nav-link dropdown-toggle" href="/profileSettings" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Job Offers
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item" data-bs-dismiss="offcanvas"><NavbarJobOfferCreate setGlobalAlertError={setGlobalAlertError}/></li>
                    <li className="dropdown-item" data-bs-dismiss="offcanvas">
                      <Link to='/jobofferlistings' className="nav-link" aria-current="page">Job Offer Listings</Link>
                    </li>
                    <li className="dropdown-item" data-bs-dismiss="offcanvas">
                      <Link to='/company/myJobOffers' className="nav-link" aria-current="page">My Job Offers</Link>
                    </li>
                    
                  </ul>
                </li>
                
                
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to='/' className="nav-link" aria-current="page">Home</Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to='/example' className="nav-link">Example</Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to={`/company/profile/${user.username}/`} className="nav-link" aria-current="page">Profile</Link>
                </li>
                <li className="nav-item dropdown-center">
                  <a className="nav-link dropdown-toggle" href="/profileSettings" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Settings
                  </a>
                  <ul className="dropdown-menu">
                    <li className="dropdown-item" data-bs-dismiss="offcanvas">
                      <Link to='/profileSettings' className="nav-link" aria-current="page">Profile Settings</Link>
                    </li>
                    <li className="dropdown-item">
                      <div className="form-check form-switch form-check-reverse nav-link me-4 text-left d-table">
                        <input className="form-check-input" type="checkbox" id="flexSwitchCheckCheckedReverse" 
                        onChange={toggleDarkMode}
                        checked={check}
                        data-bs-dismiss="offcanvas"
                        />  
                        <label className="form-check-label" htmlFor="flexSwitchCheckCheckedReverse">Dark Mode</label>
                      </div>
                    </li>
                    
                  </ul>
                </li>
               
                <li className="nav-item" onClick={logoutUser}>
                  <Link to='/' className="nav-link" data-bs-dismiss="offcanvas">Log Out</Link>
                </li>
               
              </ul>
              // not logged in
              ) : (
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to='/example' className="nav-link">Example</Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to='/login' className="nav-link">Log In</Link>
                </li>
                <li className="nav-item" data-bs-dismiss="offcanvas">
                  <Link to='/register' className="nav-link">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <div className="form-check form-switch form-check-reverse nav-link me-4 text-left d-table">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckCheckedReverse" 
                    onChange={toggleDarkMode}
                    checked={check}
                    data-bs-dismiss="offcanvas"
                    />
                    <label className="form-check-label" htmlFor="flexSwitchCheckCheckedReverse">Dark Mode</label>
                  </div>
                </li>
              </ul>
              )}

            </div>
          </div>
        </div>
        
      </nav>
    )

}
export default Navbar;