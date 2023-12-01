import React, {useContext} from 'react';
import axios, { AxiosError } from 'axios';
import { ErrorResponse } from '../Profile';
import AuthContext from '../../utils/AuthProvider';


interface JobOfferAssessProps {
  offerid: number;
  username: string | undefined;
  setError: React.Dispatch<React.SetStateAction<AxiosError<ErrorResponse, any> | null>>
}

const JobOfferAssess: React.FC<JobOfferAssessProps> = ({ offerid, setError, username }) => {


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
    <div className='container d-md-flex '>
      <div
        className='btn btn-success w-100 rounded-4 mt-2 btn-block'
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