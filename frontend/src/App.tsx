import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, redirect, HashRouter} from "react-router-dom";
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';

function App() {
  return (
    <BrowserRouter>
    <div className='min-h-screen'>
      <Routes>
          <Route path="/login" element={<LogIn></LogIn>}></Route>
          <Route path="/register" element={<SignUp></SignUp>}></Route>
        
      </Routes>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
