import { ErrorResponse } from "./Profile";
import { AxiosError } from "axios";

interface ErrorProps{

    axiosError: AxiosError<ErrorResponse, any>
}


const ErrorPage: React.FC<ErrorProps> = ({axiosError}) =>{
    const errorData = axiosError?.response;
    return (
        <div>
            {/* <h1>Error</h1> */}
            {errorData ? (
                <>
                    <div className="error-page text-center">
                        <h2>{axiosError.response?.status}</h2>
                        <p>{axiosError.response?.statusText}</p>
                    </div>
                    
                    
                    
                </>
            ) : (
                <p>An error occurred.</p>
            )}
        </div>
    );
};
export default ErrorPage;