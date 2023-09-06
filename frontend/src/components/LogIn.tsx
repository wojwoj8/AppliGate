import React, { useContext, useEffect, useState } from "react";
// import axios from "axios";
import { Link } from "react-router-dom";
import AuthContext from "../utils/AuthProvider";
import Loading from "./Loading";

const LogIn: React.FC = () => {
  const { loginUser, errorLogIn, setErrorLogIn} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('')

  const handleForm = async (e: React.FormEvent<HTMLFormElement>) => {
    setErrorLogIn({});
    e.preventDefault();
    
    setLoading(true);
    setProgress(50);
    setLoadingMessage('Loading may take up to 3 minutes, please wait')
    await loginUser(e); // Call the loginUser function from the AuthContext
    setProgress(100);
    setLoading(false);
    setLoadingMessage('')
};

  
    return(
        <div className="container my-5">
            {errorLogIn !== null &&
                Object.keys(errorLogIn).map((fieldName) => (
                <div key={fieldName} className="text-danger text-center">
                    <p>{errorLogIn[fieldName]}</p>
                </div>
                ))}
            <div className="text-center text-primary">
            {loadingMessage && loadingMessage }
            </div>
           <div className="text-center">
                <h1 className="display-4 fw-bold">AppliGate</h1>
                <p className="lead">Craft Your CV, Secure Your Future, Find Your Dream Job</p>
            </div>
            <div className="row justify-content-center">
                <div className="col-sm-12 col-md-8 col-lg-6">
                    <form onSubmit={handleForm}>
                        <div className="mb-3">
                            <label htmlFor="login" className="form-label">
                            Login:
                            </label>
                            <input
                            name="login"
                            type="text"
                            required
                            className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                            Password:
                            </label>
                            <input
                            name="password"
                            type="password"
                            required
                            className="form-control"
                            />
                        </div>
                        <div className="d-grid py-2 text-center">
                            <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            >
                            Log In
                            </button>
                        </div>
                        <div className="text-center">
                            <p className="mb-0">Don't have an account? <Link to="/register" className="text-purple-500">Create it Here!</Link></p>
                        </div>
                    </form>
                    {loading && <Loading progress={progress} />}
                </div>
            </div>
        </div>
    )
}
export default LogIn;