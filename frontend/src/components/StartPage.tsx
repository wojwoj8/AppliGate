import React, { useState } from 'react';


const StartPage: React.FC = () =>{


    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')


    const handleLogin = (data: string) =>{
        setLogin(data);
    }

    const handlePassword = (data: string) =>{
        setPassword(data);
    }


    return(
        <div className='start-page-wrapper'>
            <div className="start-page">
                <h1>Welcome at AppliGate!</h1>

                <div className='start-login-form'>
                    <form className='login-form'>
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
                    </form>
                </div>
            </div>
        </div>
    )
}
export default StartPage;