import React from 'react';
import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Navbar from './components/Navbar';
import Index from './components/Index';
import PrivateRoute from './utils/PrivateRoute';
import IfNotLoggedIn from './utils/IfLoggedIn';
import Profile from './components/Profile';
import { AuthProvider } from './utils/AuthProvider';
import setInitialMode from './utils/InitlializeDarkMode';
import Footer from './components/Footer';
import ProfileSettings from './components/ProfileSettings';
import ProfileSettingsPassword from './components/ProfileSettingsPassword';
import ProfileSettingsUsername from './components/ProfileSettingsUsername';
import ProfileSettingsDelete from './components/ProfileSettingsDelete';
import Example from './components/Example';


function App() {
  setInitialMode();
  return (
    <BrowserRouter>
    
      <AuthProvider>
        <Navbar></Navbar>
        <div className='pb-2 d-flex flex-column myMain'>
        <Routes>
          {/* default route */}
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* IfNotLoggedIn = Accessable IfNotLoggedIn */}
            <Route path="/example" element={<Example/>}></Route>
            <Route path="/login" element={<IfNotLoggedIn><LogIn/></IfNotLoggedIn>}></Route>
            <Route path="/register" element={<IfNotLoggedIn><SignUp/></IfNotLoggedIn>}></Route>

            {/* PrivateRoute = Accessable if logged in */}
            <Route path="/profile/*" element={<PrivateRoute><Profile/></PrivateRoute>}></Route>
            <Route path="/profileSettings" element={<PrivateRoute><ProfileSettings/></PrivateRoute>}></Route>
            <Route path="/profileSettings/userData" element={<PrivateRoute><ProfileSettingsUsername/></PrivateRoute>}></Route>
            <Route path="/profileSettings/password" element={<PrivateRoute><ProfileSettingsPassword/></PrivateRoute>}></Route>
            <Route path="/profileSettings/delete" element={<PrivateRoute><ProfileSettingsDelete/></PrivateRoute>}></Route>
            <Route path="/" element={<PrivateRoute><Index/></PrivateRoute>} />
          
        </Routes>
        </div>
        <Footer></Footer>
      </AuthProvider>
   
    
    {/* <div className='mt-2'></div> */}
    </BrowserRouter>
    
  );
}

export default App;
