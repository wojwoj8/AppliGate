import React, { useEffect, useState, useSyncExternalStore } from 'react';
import axios from 'axios';

const StartPage: React.FC = () =>{


    const [login, setLogin] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [err, setErr] = useState('');

    const handleLogin = (data: string) =>{
        setLogin(data);
    }

    const handlePassword = (data: string) =>{
        setPassword(data);
    }

    const handleEmail = (data: string) => {
        setEmail(data);
    }

    const handleConfirm = (data:string) =>{
        setConfirm(data)
    }

    const createUser = () =>{
        axios.post('/api/', {
            username: login,
            password: password,
            email: email
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
        if (password === confirm){
            createUser()
        }
        else{
            setErr('Passwords are not the same')
        }
        
        e.preventDefault()
    }


    return(
        <div className='flex justify-center'>
            <div className="flex flex-col">
                {err && <p className='text-red-600 text-center'>{err}</p>}
                <h1 className='text-center text-4xl font-bold'>Welcome at AppliGate!</h1>
                <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
                    <form className='space-y-6' onSubmit={e => handleForm(e)}>
                        <div className=''>   
                            <label htmlFor='login' className="text-base">Login:</label>
                            <div className='mt-2'>
                                <input 
                                    name='login' 
                                    type='text' 
                                    onChange={data => handleLogin(data.target.value)} 
                                    required
                                    className='block mx w-full rounded-md border-0 py-1.5 px-4 text-gray-900 
                                    shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 
                                    focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus-visible:outline-0 
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
                                        onChange={data => handlePassword(data.target.value)} 
                                        required
                                        className='block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus-visible:outline-0 sm:text-sm sm:leading-6'

                                    />
                                </div>
                            </div>

                        <div className=''>
                            <label htmlFor='confirm' className="text-base">Confirm Password:</label>
                            <div className='mt-2'>
                                <input 
                                    name='confirm' 
                                    type='password' 
                                    onChange={data => handleConfirm(data.target.value)} 
                                    required
                                    className='block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus-visible:outline-0 sm:text-sm sm:leading-6'

                                />
                            </div>
                        </div>

                        <div className=''>
                            <label htmlFor='email' className="text-base">Email:</label>
                            <div className='mt-2'>
                                <input 
                                    name='email' 
                                    type='email' 
                                    onChange={data => handleEmail(data.target.value)} 
                                    required
                                    className='block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus-visible:outline-0 sm:text-sm sm:leading-6'

                                />
                            </div>
                        </div>
                        <div className=''>
                            <button 
                                type='submit' 
                                className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                >SignUp
                            </button>      
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}
export default StartPage;