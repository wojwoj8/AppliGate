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

// axios.defaults.withCredentials = true; // even for get requests if
//                                     // demand session authentication
// axios.defaults.xsrfCookieName = 'csrftoken'
// axios.defaults.xsrfHeaderName = 'x-csrftoken'

function App() {
  setInitialMode();
  return (
    <BrowserRouter>
    <div className='pb-2'>
      <AuthProvider>
        <Navbar></Navbar>
        <Routes>
          {/* default route */}
            <Route path="*" element={<Navigate to="/" replace />} />
            {/* IfNotLoggedIn = Accessable IfNotLoggedIn */}
            <Route path="/login" element={<IfNotLoggedIn><LogIn/></IfNotLoggedIn>}></Route>
            <Route path="/register" element={<IfNotLoggedIn><SignUp/></IfNotLoggedIn>}></Route>

            {/* PrivateRoute = Accessable if logged in */}
            <Route path="/profile" element={<PrivateRoute><Profile/></PrivateRoute>}></Route>
            <Route path="/" element={<PrivateRoute><Index/></PrivateRoute>} />
          
        </Routes>
      </AuthProvider>
    </div>
    {/* <div className='mt-2'></div> */}
    </BrowserRouter>
    
  );
}

export default App;
