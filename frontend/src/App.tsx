import { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, BrowserRouter} from "react-router-dom";
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Navbar from './components/Navbar';
import Index from './components/Index';
import PrivateRouteCompanyOnly from './utils/PrivateRouteCompanyOnly';
import PrivateRouteUserOnly from './utils/PrivateRouteUserOnly';
import PrivateRoute from './utils/PrivateRoute';
import IfNotLoggedIn from './utils/IfNotLoggedIn';
import Profile from './components/Profile';
import { AuthProvider } from './utils/AuthProvider';
import setInitialMode from './utils/InitlializeDarkMode';
import Footer from './components/Footer';
import ProfileSettings from './components/ProfileSettings';
import ProfileSettingsPassword from './components/ProfileSettingsPassword';
import ProfileSettingsUsername from './components/ProfileSettingsUsername';
import ProfileSettingsDelete from './components/ProfileSettingsDelete';
import Example from './components/Example';
import ProfileAlert from './components/profileComponents/ProfileAlert';

// Company part
import ProfileCompany from './components/companyComponents/ProfileCompany';


//JobOffer
import JobOfferCreator from './components/companyComponents/JobOfferCreator';


function App() {
  setInitialMode();
  const [alertError, setAlertError] = useState('');
  return (
    <BrowserRouter>
    
      <AuthProvider>
        <Navbar></Navbar>
        <div className='pb-2 d-flex flex-column myMain'>
        {alertError && <ProfileAlert 
                error={alertError}
                setError={setAlertError} />}
        <Routes>
          {/* default route */}
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* IfNotLoggedIn = Accessable IfNotLoggedIn */}
            <Route path="/example" element={<Example/>}></Route>
            <Route path="/login" element={<IfNotLoggedIn><LogIn/></IfNotLoggedIn>}></Route>
            <Route path="/register" element={<IfNotLoggedIn><SignUp/></IfNotLoggedIn>}></Route>

            

            {/* PrivateRoute = Accessable if logged in */}
            {/* PrivateRouteUserOnly = Accessable if logged in and user type is user */}
            {/* PrivateRouteCompanyOnly = Accessable if logged in and user type is company */}
            <Route path="/profile/*" element={<PrivateRouteUserOnly><Profile/></PrivateRouteUserOnly>}></Route>
            <Route path="/profileSettings" element={<PrivateRoute><ProfileSettings/></PrivateRoute>}></Route>
            <Route path="/profileSettings/userData" element={<PrivateRoute><ProfileSettingsUsername setAlertError={setAlertError}/></PrivateRoute>}></Route>
            <Route path="/profileSettings/password" element={<PrivateRoute><ProfileSettingsPassword setAlertError={setAlertError}/></PrivateRoute>}></Route>
            <Route path="/profileSettings/delete" element={<PrivateRoute><ProfileSettingsDelete setAlertError={setAlertError}/></PrivateRoute>}></Route>
            <Route path="/" element={<PrivateRoute><Index/></PrivateRoute>} />


            {/* company routes */}
            <Route path="/company/profile/*" element={<PrivateRouteCompanyOnly><ProfileCompany/></PrivateRouteCompanyOnly>}></Route>
            <Route path="/company/joboffercreator" element={<PrivateRouteCompanyOnly><JobOfferCreator/></PrivateRouteCompanyOnly>}></Route>


          
        </Routes>
        </div>
        <Footer></Footer>
      </AuthProvider>
   
    
    {/* <div className='mt-2'></div> */}
    </BrowserRouter>
    
  );
}

export default App;
