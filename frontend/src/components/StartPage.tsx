import React from 'react';
const StartPage = () =>{

    return(
        <div className='start-page-wrapper'>
            <div className="start-page">
                <h1>Welcome at AppliGate!</h1>

                <div className='start-login-form'>
                    <form className='login-form'>
                        <label htmlFor='login'>Login:</label>
                            <input name='login' type='text' required></input>
                        <label htmlFor='password'>Password:</label>
                        <input name='password' type='password' required></input>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default StartPage;