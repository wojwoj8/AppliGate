import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";
import DarkMode from "../utils/DarkMode";


const Navbar: React.FC = () =>{
    
    const [check, setCheck] = useState(false);
    const handleCheck = () => {
      if (localStorage.getItem('mode') !== 'dark'){

        setCheck(true)
        DarkMode()
      } else{

        setCheck(false)
        DarkMode()
      }
      
    }
    useEffect(() =>{
      handleCheck();
    },[])
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
              <ul className="navbar-nav text-primary justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <Link to='/' className="nav-link" aria-current="page">Home</Link>
                </li>
                <li className="nav-item">
                  <Link to={`/profile/${user.username}/`} className="nav-link" aria-current="page">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to='/profileSettings' className="nav-link" aria-current="page">Profile Settings</Link>
                </li>
                <li className="nav-item" onClick={logoutUser}>
                  <a className="nav-link" href="/" data-bs-dismiss="offcanvas">Log Out</a>
                </li>
                {/* <li>
                  <button className="nav-link" onClick={DarkMode}>Toggle Dark Mode</button>
                </li> */}
                <li className="nav-item">
                  <div className="form-check form-switch form-check-reverse nav-link me-4 text-left d-table">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckCheckedReverse" 
                    onChange={handleCheck}
                    checked={check}
                    
                    />
                    
                    <label className="form-check-label" htmlFor="flexSwitchCheckCheckedReverse">Dark Mode</label>
                  </div>
                </li>
                {/* <li className="nav-item dropdown">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    Dropdown link
                  </a>
                  <ul className="dropdown-menu">
                    <li><a className="dropdown-item" href="#">Another action</a></li>
                    <li><a className="dropdown-item" href="#">Something else here</a></li>
                  </ul>
                </li> */}
              </ul>
              
              ) : (
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                {/* <li className="nav-item">
                  <Link to='/' className="nav-link active" aria-current="page">Home</Link>
                </li> */}
                <li className="nav-item">
                  <Link to='/login' className="nav-link">Log In</Link>
                </li>
                <li className="nav-item">
                  <Link to='/register' className="nav-link">Sign Up</Link>
                </li>
                <li className="nav-item">
                  <div className="form-check form-switch form-check-reverse nav-link me-4 text-left d-table">
                    <input className="form-check-input" type="checkbox" id="flexSwitchCheckCheckedReverse" 
                    onChange={handleCheck}
                    checked={check}
                    
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