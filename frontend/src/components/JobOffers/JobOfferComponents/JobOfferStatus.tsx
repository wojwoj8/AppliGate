import { JobOfferGetDataFunction, JobOfferEditDataFunction} from "../JobOffer";
import { JobOfferStatusData } from "../JobOffer";
import axios, { AxiosError } from "axios";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../../utils/AuthProvider";
import DeleteModal from "../../DeleteModal";
import { ErrorResponse } from "../../Profile";
import { useNavigate } from "react-router-dom";

interface ProfileCompanyStatusInterface{
    jobOfferStatus: JobOfferStatusData | null;
    setJobOfferStatus: React.Dispatch<React.SetStateAction<JobOfferStatusData | null>>;
    getData: (
        setData: JobOfferGetDataFunction,
        endpoint: string
        ) => void;
    editData: (state: JobOfferEditDataFunction ,
        editField: React.Dispatch<React.SetStateAction<boolean>> | undefined, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    alertError: string;
    setAlertError: React.Dispatch<React.SetStateAction<string>>
    offerid: string;
    error: null;
    setError: React.Dispatch<React.SetStateAction<AxiosError<ErrorResponse, any> | null>>
    setGlobalAlertError: (error: string) => void
}

const JobOfferStatus: React.FC<ProfileCompanyStatusInterface> = ({jobOfferStatus, setJobOfferStatus, getData, 
    editData, alertError, setAlertError, offerid, error, setError, setGlobalAlertError}) => {

    const navigate = useNavigate();
    const {authTokens, user, logoutUser } = useContext(AuthContext);
    const [hasApplied, setHasApplied] = useState({has_applied: false})

    const deleteJobOffer = async (
    ) =>{
        try {
            const response = await axios.delete(`/company/joboffer/deleteoffer/${offerid}`,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + String(authTokens.access),
                },
            });

            const data = response.data;
            if (response.status === 204) {
                setGlobalAlertError('JobOffer deleted successfully success')
                navigate("/");
                
                
            }
            } catch (error: any) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (error.response && error.response.status === 401) {
                // Unauthorized - Logout the user
                logoutUser();
            } 
            else if (error.response && (error.response.status !== 400)) {
                setError(axiosError)
            }
            else {
                console.error('Error:', error);
                
            }
        }
    }

    const JobApply = async (
        ) =>{
            try {
                const response = await axios.post(`/company/joboffer/apply/${offerid}`, {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + String(authTokens.access),
                    },
                });
    
                const data = response.data;
                
                if (response.status === 200) {
                    setGlobalAlertError('Application submitted successfully! Thank you for applying success')
                    JobApplyVerification()
                    // navigate("/");
                    
                    
                }
                } catch (error: any) {
                const axiosError = error as AxiosError<ErrorResponse>;
                if (error.response && error.response.status === 401) {
                    // Unauthorized - Logout the user
                    logoutUser();
                } 
                else if (error.response && (error.response.status !== 400)) {
                    setError(axiosError)
                }
                else {
                    console.error('Error:', error);
                    
                }
            }
        }

    const JobApplyVerification = async (
        ) =>{
            try {
                const response = await axios.get(`/company/joboffer/apply/${offerid}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + String(authTokens.access),
                    },
                });
    
                const data = response.data;
                setHasApplied(data)
                
                if (response.status === 200) {
                    // setGlobalAlertError('Application submitted successfully! Thank you for applying success')
                    // navigate("/");
                    
                    
                }
                } catch (error: any) {
                const axiosError = error as AxiosError<ErrorResponse>;
                if (error.response && error.response.status === 401) {
                    // Unauthorized - Logout the user
                    logoutUser();
                } 
                else if (error.response && (error.response.status !== 400)) {
                    setError(axiosError)
                }
                else {
                    console.error('Error:', error);
                    
                }
            }
        }

const saveDelete = async () =>{
    await deleteJobOffer();
}


const changeJobOfferStatus = async () => {
    const updatedJobOfferStatus = {
        ...jobOfferStatus!,
        job_offer_status: !jobOfferStatus?.job_offer_status,
    };

    await setJobOfferStatus(updatedJobOfferStatus);

    if (updatedJobOfferStatus.job_offer_status === false) {
        setAlertError('JobOffer Changed to not listed, nobody can see that job offer success');
    } else {
        setAlertError('JobOffer Changed to listed, now if your profile is public everyone can see and applay for that job offer success');
    }

    editData(updatedJobOfferStatus, undefined, `/company/joboffer/jobofferstatus/${offerid}`, 'jobOfferStatus');
    };


    useEffect(() =>{
        JobApplyVerification()

    },[hasApplied.has_applied])
    return(
        <>
            <div className='container'>
            {user.user_type === 'user' && (
                
                hasApplied.has_applied ? (
                    <button className='btn btn-info disabled w-100 rounded-4 mt-3 not-hidden'>You have already applied for that offer</button>
                ) : (
                    <button className='btn btn-info w-100 rounded-4 mt-3 not-hidden' onClick={JobApply}>Apply for that offer</button>
                )
                
            )     
                }
            
            
                <div className='prevHidden'>
                    {jobOfferStatus && jobOfferStatus?.job_offer_status === true ? (
                        <button className='btn btn-primary w-100 rounded-4 mt-2' onClick={changeJobOfferStatus}>Set JobOffer to Not listed</button>) : 
                    (
                        <button className='btn btn-primary w-100 rounded-4 mt-3' onClick={changeJobOfferStatus}>Set JobOffer to Listed</button>
                    ) }
                    <div className="d-grid py-2 text-center  ">
                        <button 
                            type="submit" 
                            className={`btn btn-danger btn-block rounded-4`}
                        >
                            <DeleteModal id={`${offerid}`} 
                            name={'Delete Job Offer'} 
                            message={'Do you want to delete that Job Offer?'} 
                            deleteName = {'Delete'}
                            onDelete={() => saveDelete()} />
                        </button>      
                    </div>
                </div>
            </div>
        </>
    )
}
export default JobOfferStatus;