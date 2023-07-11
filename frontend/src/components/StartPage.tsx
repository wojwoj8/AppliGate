import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StartPage: React.FC = () =>{


    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')


    const handleLogin = (data: string) =>{
        setLogin(data);
    }

    const handlePassword = (data: string) =>{
        setPassword(data);
    }

    const createUser = () =>{
        axios.post('/api/', {
            login: login,
            password: password
        }).then((res) =>{
            console.log(res)
        }).catch((err) =>{
            console.log(err)
        })
        
    }
    const handleForm = (e: React.FormEvent<HTMLFormElement>) =>{
        createUser()
        e.preventDefault()
    }


    return(
        <div className='start-page-wrapper'>
            <div className="start-page">
                <h1>Welcome at AppliGate!</h1>

                <div className='start-login-form'>
                    <form className='login-form' onSubmit={e => handleForm(e)}>
                        <label htmlFor='login'>Login:</label>
                        <input 
                            name='login' 
                            type='text' 
                            onChange={data => handleLogin(data.target.value)} 
                            required
                        />
                    
                        <label htmlFor='password' >Password:</label>
                        <input 
                            name='password' 
                            type='password' 
                            onChange={data => handlePassword(data.target.value)} 
                            required
                        />
                        <button type='submit' >LogIn</button>      
                    </form>
                </div>
            </div>
        </div>
    )
}
export default StartPage;