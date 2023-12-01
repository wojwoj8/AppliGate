import { useState } from 'react';
import { Routes, Route, Navigate, BrowserRouter} from "react-router-dom";
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
import JobOfferUserApplications from './components/JobOffers/JobOfferUserApplications';
import JobOfferAssessApplicationListing from './components/JobOffers/JobOfferAssessApplicationListing';
// Company part
import ProfileCompany from './components/companyComponents/ProfileCompany';


//JobOffer
import JobOffer from './components/JobOffers/JobOffer';
import JobOfferListing from './components/JobOffers/JobOfferListing';
import MyJobOffers from './components/JobOffers/MyJobOffers';

//Context JobOffer
import { JobOfferProvider } from './components/JobOffers/JobOfferContexts/JobOfferContext';

function App() {
  setInitialMode();
  const [alertError, setAlertError] = useState('');
  return (
    <BrowserRouter>
    
      <AuthProvider>
        <Navbar setGlobalAlertError={setAlertError}></Navbar>
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
            {/* HAD TO MAKE THERE THAT PROVIDER... */}
            <Route path="/profile/*" element={
              <JobOfferProvider>
                <PrivateRoute>
                  <Profile/>
                </PrivateRoute>
              </JobOfferProvider>
            }></Route>
            <Route path="/profileSettings" element={<PrivateRoute><ProfileSettings/></PrivateRoute>}></Route>
            <Route path="/profileSettings/userData" element={<PrivateRoute><ProfileSettingsUsername setAlertError={setAlertError}/></PrivateRoute>}></Route>
            <Route path="/profileSettings/password" element={<PrivateRoute><ProfileSettingsPassword setAlertError={setAlertError}/></PrivateRoute>}></Route>
            <Route path="/profileSettings/delete" element={<PrivateRoute><ProfileSettingsDelete setAlertError={setAlertError}/></PrivateRoute>}></Route>
            <Route path="/" element={<PrivateRoute><Index/></PrivateRoute>} />

            <Route path="/applications/:page" element={
              <JobOfferProvider>
                <PrivateRouteUserOnly>
                  <JobOfferUserApplications/>
                </PrivateRouteUserOnly>
              </JobOfferProvider>}></Route>
            {/* company routes */}
            <Route path="/company/profile/*" element={<PrivateRoute><ProfileCompany/></PrivateRoute>}></Route>
            <Route path="/company/joboffer" element={<PrivateRouteCompanyOnly><JobOffer setGlobalAlertError={setAlertError}/></PrivateRouteCompanyOnly>}></Route>
            <Route path="/company/joboffer/createjoboffer" element={<PrivateRouteCompanyOnly><JobOffer setGlobalAlertError={setAlertError}/></PrivateRouteCompanyOnly>}></Route>
            {/* <Route path="/company/joboffer/:offerid" element={<PrivateRouteCompanyOnly><JobOffer setGlobalAlertError={setAlertError}/></PrivateRouteCompanyOnly>}></Route> */}
            <Route path="/company/joboffer/:offerid" element={<PrivateRoute><JobOffer setGlobalAlertError={setAlertError}/></PrivateRoute>}></Route>
            <Route path="/jobofferlistings/:page" element={<PrivateRoute><JobOfferListing/></PrivateRoute>}></Route>
            
            <Route path="/company/myJobOffers/:page" element={
              <JobOfferProvider>
                <PrivateRouteCompanyOnly>
                  <MyJobOffers/>
                </PrivateRouteCompanyOnly>
              </JobOfferProvider>
            
            }></Route>
            <Route path="/company/joboffer/applicants/:page" element={
              <JobOfferProvider>
                <PrivateRouteCompanyOnly>
                  <JobOfferAssessApplicationListing />
                </PrivateRouteCompanyOnly>
              </JobOfferProvider>
            }></Route>
            <Route path="/company/joboffer/applicant/*" element={
              <JobOfferProvider>
                <PrivateRouteCompanyOnly>
                  <Profile/>
                </PrivateRouteCompanyOnly>
              </JobOfferProvider>
            }></Route>
          
        </Routes>
        </div>
        <Footer></Footer>
      </AuthProvider>
   
    
    {/* <div className='mt-2'></div> */}
    </BrowserRouter>
    
  );
}

export default App;
