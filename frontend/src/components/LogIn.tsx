import React, { useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";

const LogIn: React.FC = () => {
  const { loginUser } = useContext(AuthContext);
  const [err, setErr] = useState("");

  const handleForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser(e); // Call the loginUser function from the AuthContext
  };

    return(
        <div className=''>
            {err && <p className='text-red-600 text-center font-bold'>{err}</p>}
            <h1 className='text-center text-4xl font-bold'>Welcome at AppliGate!</h1>
            <div className="justify-center sm:mx-auto sm:w-full sm:max-w-sm ">
                
                
                <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 '>
                    <form className='space-y-6' onSubmit={handleForm}>
                        <div className=' '>   
                            <label htmlFor='login' className="text-base">Login:</label>
                            <div className='mt-2'>
                                <input 
                                    name='login' 
                                    type='text' 
                                   
                                    required
                                    className='block mx w-full rounded-md border-0 py-1.5 px-4 text-gray-900 
                                    shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                    focus:ring-2 focus:ring-inset focus:ring-primary-normal-500 focus-visible:outline-0 
                                    sm:text-sm sm:leading-6' 
                                />
                            </div>
                            
                        </div>
                        
                            <div className=''>
                                <label htmlFor='password' className="text-base">Password:</label>
                                <div className='mt-2'>
                                    <input 
                                        name='password' 
                                        type='password' 
                                        
                                        required
                                        className='block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 
                                        ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 
                                        focus:ring-inset focus:ring-primary-normal-500 focus-visible:outline-0 
                                        sm:text-sm sm:leading-6'

                                    />
                                </div>
                            </div>


                        <div className=''>
                            <button 
                                type='submit' 
                                className='flex w-full justify-center rounded-md
                                 bg-primary-normal-500 px-3 py-1.5 text-sm font-semibold leading-6
                                  text-white shadow-sm hover:bg-primary-normal-600
                                  focus-visible:outline focus-visible:outline-2 
                                  focus-visible:outline-offset-2 focus-visible:outline-primary-normal'
                                >LogIn
                            </button>      
                        </div>

                        <div className="flex w-full justify-center">
                            <p className="">Don't have an account? <Link to='/register' className="text-purple-500"> Create it Here!</Link></p>
                            
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}
export default LogIn;