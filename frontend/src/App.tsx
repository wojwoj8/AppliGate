import React from 'react';
import logo from './logo.svg';
import { BrowserRouter, Routes, Route, Navigate, redirect, HashRouter} from "react-router-dom";
import './App.css';
import StartPage from './components/StartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage></StartPage>}></Route>
      </Routes>
    </BrowserRouter>
    
  );
}

export default App;
