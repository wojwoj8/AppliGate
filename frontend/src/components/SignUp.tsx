import React, { useState, useContext } from "react";
// import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";



const SignUp: React.FC = () =>{

    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [err, setErr] = useState('');
    const navigate = useNavigate();
    const { signupUser } = useContext(AuthContext)

    const handleForm = (e: React.FormEvent<HTMLFormElement>) =>{
        if (password === confirm){
            signupUser(e)
        }
        else{
            setErr('Passwords are not the same')
        }
        
        e.preventDefault()
    }


    return(
        <div className="">
            {err && <p className="">{err}</p>}
            <h1 className="">Welcome at AppliGate!</h1>
            <div className="">
                
                <div className="">
                    <form className="" onSubmit={e => handleForm(e)}>
                        <div className="">   
                            <label htmlFor='login' className="">Login:</label>
                            <div className="">
                                <input 
                                    name='login' 
                                    type='text' 
                                    // onChange={data => handleLogin(data.target.value)} 
                                    required
                                    placeholder='account1'
                                    className="" 
                                />
                            </div>
                            
                        </div>
                        
                            <div className="">
                                <label htmlFor='password' className="">Password:</label>
                                <div className="">
                                    <input 
                                        name='password' 
                                        type='password' 
                                        // onChange={data => handlePassword(data.target.value)} 
                                        required
                                        className=""

                                    />
                                </div>
                            </div>

                        <div className="">
                            <label htmlFor='confirm' className="">Confirm Password:</label>
                            <div className="">
                                <input 
                                    name='confirm' 
                                    type='password' 
                                    // onChange={data => handleConfirm(data.target.value)} 
                                    required
                                    className=""

                                />
                            </div>
                        </div>

                        <div className="">
                            <label htmlFor='email' className="">Email:</label>
                            <div className="">
                                <input 
                                    name='email' 
                                    type='email' 
                                    // onChange={data => handleEmail(data.target.value)} 
                                    required
                                    placeholder='example@test.com'
                                    className=""
                                />
                            </div>
                        </div>
                        <div className="">
                            <button 
                                type='submit' 
                                className=""
                                >SignUp
                            </button>      
                        </div>
                        
                        <div className="">
                        <p className="">Already have an account? <Link to='/login' className=""> Log In Here!</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default SignUp;