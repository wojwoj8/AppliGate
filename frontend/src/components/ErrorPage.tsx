import { ErrorResponse } from "./Profile";
import { AxiosError } from "axios";

interface ErrorProps{

    axiosError: AxiosError<ErrorResponse, any>
}


const ErrorPage: React.FC<ErrorProps> = ({axiosError}) =>{
    const errorData = axiosError?.response;
    console.log(errorData)
    return (
        <div>
            {/* <h1>Error</h1> */}
            {errorData ? (
                <>
                    <div className="error-page text-center">
                        <h2>{axiosError.response?.status}</h2>
                        {axiosError.response?.data?.detail ? (
                            <p>{axiosError.response?.data?.detail}</p>
                        )  : (
                            <p>{axiosError.response?.statusText}</p>
                        ) 
                        
                        }
                        
                    </div>
                    
                    
                    
                </>
            ) : (
                <div className="error-page text-center">
                    <h2>500</h2>
                    <p>An error occurred.</p>
                </div>
            )}
        </div>
    );
};
export default ErrorPage;