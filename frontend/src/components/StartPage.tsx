import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StartPage: React.FC = () =>{


    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [err, setErr] = useState('');

    const handleLogin = (data: string) =>{
        setLogin(data);
    }

    const handlePassword = (data: string) =>{
        setPassword(data);
    }

    const createUser = () =>{
        axios.post('/api/', {
            username: login,
            password: password
        }).then((res) =>{
            console.log(res)
        }).catch((err) =>{
            console.log(err)
            for (const key in err.response.data) {
                if (err.response.data.hasOwnProperty(key)) {
                  console.log(key, err.response.data[key][0]);
                  setErr(err.response.data[key][0])
                }
              }
        })
        
    }
    const handleForm = (e: React.FormEvent<HTMLFormElement>) =>{
        createUser()
        e.preventDefault()
    }


    return(
        <div className='flex justify-center'>
            <div className="flex flex-col">
                <h1 className='text-center text-4xl font-bold'>Welcome at AppliGate!</h1>
                <div className='flex flex-col mt-4'>
                    <form className='border-black border-[1px] flex flex-col' onSubmit={e => handleForm(e)}>
                        <div className=''>   
                            <label htmlFor='login'>Login:</label>
                            <input 
                                name='login' 
                                type='text' 
                                onChange={data => handleLogin(data.target.value)} 
                                required
                            />
                        </div>
                        
                        <div>
                            <label htmlFor='password' >Password:</label>
                            <input 
                                name='password' 
                                type='password' 
                                onChange={data => handlePassword(data.target.value)} 
                                required
                            />
                        </div>
                        
                        <button type='submit' >SignUp</button>      
                    </form>
                </div>
            </div>
        </div>
    )
}
export default StartPage;