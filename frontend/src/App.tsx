import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, redirect, HashRouter} from "react-router-dom";
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Navbar from './components/Navbar';
import Index from './components/Index';
import Logout from './components/Logout';
import PrivateRoute from './utils/PrivateRoute';
import axios from 'axios';
import { AuthProvider } from './utils/AuthProvider';

axios.defaults.withCredentials = true; // even for get requests if
                                    // demand session authentication
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'x-csrftoken'

function App() {
  return (
    <BrowserRouter>
    <div className='min-h-screen'>
      <AuthProvider>
        <Navbar></Navbar>
        <Routes>
            <Route path="/login" element={<LogIn></LogIn>}></Route>
            <Route path="/register" element={<SignUp></SignUp>}></Route>
            <Route path="/logout" element={<Logout/>}></Route>
            <Route path="/" element={<PrivateRoute><Index/></PrivateRoute>} />
          
        </Routes>
      </AuthProvider>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
