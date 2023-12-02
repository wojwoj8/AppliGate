import React, {useContext} from 'react';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../Profile';
import AuthContext from '../../utils/AuthProvider';
import { useNavigate } from 'react-router-dom';


interface JobOfferAssessProps {
  offerid: number;
  username: string | undefined;
  setError: React.Dispatch<React.SetStateAction<AxiosError<ErrorResponse, any> | null>>
  setGlobalAlertError?: (error: string) => void;
}

const JobOfferAssess: React.FC<JobOfferAssessProps> = ({ offerid, setError, username, setGlobalAlertError }) => {

  const nav = useNavigate()

  const { logoutUser, authTokens } = useContext(AuthContext);

  const handleAction = async (status: string) => {
    try {

        let path = `/joboffer/profile/assess/${username}/${offerid}`
        
        const response = await axios.put(path , {status: status},{
          headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(authTokens.access),
            },
        }
        );
        

       if(response.status === 200){
        if(setGlobalAlertError){
          setGlobalAlertError(`User status set to ${status} success`)
          // nav back
          nav(-1)

        }
        
      }
  }catch(error: any){
        const axiosError = error as AxiosError<ErrorResponse>;
        if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
        else if (error.response && (error.response.status !== 400)) {
            setError(axiosError)
            
        } 
        else {
            
            console.error('Error fetching data:', error);
            console.log(axiosError)
            setError(axiosError);
          }
    }
  };

  return (
    <div className='container d-md-flex column-gap-2'>
      <div
        className='btn btn-primary w-100 rounded-4 mt-2 btn-block'
        onClick={() => handleAction('approved')}
      >
        Approve
      </div>
      <div
        className='btn btn-danger w-100 rounded-4 mt-2 btn-block'
        onClick={() => handleAction('rejected')}
      >
        Reject
      </div>
    </div>
  );
};

export default JobOfferAssess;