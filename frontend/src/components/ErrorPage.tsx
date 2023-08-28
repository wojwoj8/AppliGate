import { ErrorResponse } from "./Profile";
import { AxiosError } from "axios";

interface ErrorProps{

    axiosError: AxiosError<ErrorResponse, any>
}


const ErrorPage: React.FC<ErrorProps> = ({axiosError}) =>{
    const errorData = axiosError?.response;
    return (
        <div>
            <h1>Error</h1>
            {errorData ? (
                <>
                    <p>Status Code: {axiosError.response?.status}</p>
                    <p>Error Message: {axiosError.response?.data?.detail}</p>
                    
                </>
            ) : (
                <p>An error occurred.</p>
            )}
        </div>
    );
};
export default ErrorPage;