import React, { useState, useContext } from "react";
// import axios from "axios";
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
        <div className="">
            {err && <p className="">{err}</p>}
            <h1 className="">Welcome at AppliGate!</h1>
            <div className="">
                
                
                <div className="">
                    <form className="" onSubmit={handleForm}>
                        <div className="">   
                            <label htmlFor='login' className="">Login:</label>
                            <div className="">
                                <input 
                                    name='login' 
                                    type='text' 
                                   
                                    required
                                    className='' 
                                />
                            </div>
                            
                        </div>
                        
                            <div className="">
                                <label htmlFor='password' className="">Password:</label>
                                <div className="">
                                    <input 
                                        name='password' 
                                        type='password' 
                                        
                                        required
                                        className=''

                                    />
                                </div>
                            </div>


                        <div className="">
                            <button 
                                type='submit' 
                                className=''
                                >LogIn
                            </button>      
                        </div>

                        <div className="">
                            <p className="">Don't have an account? <Link to='/register' className=""> Create it Here!</Link></p>
                            
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}
export default LogIn;