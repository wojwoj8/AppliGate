import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, redirect, HashRouter} from "react-router-dom";
import StartPage from './components/StartPage';

function App() {
  return (
    <BrowserRouter>
    <div className='min-h-screen'>
      <Routes>

          <Route path="/" element={<StartPage></StartPage>}></Route>
        
      </Routes>
    </div>
    </BrowserRouter>
    
  );
}

export default App;
