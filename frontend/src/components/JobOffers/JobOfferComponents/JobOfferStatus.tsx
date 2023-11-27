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
    deadline: string | undefined;
}

const JobOfferStatus: React.FC<ProfileCompanyStatusInterface> = ({jobOfferStatus, setJobOfferStatus, getData, 
    editData, alertError, setAlertError, offerid, error, setError, setGlobalAlertError, deadline}) => {

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

    const formatRemainingTime = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
    
        const timeDifference = (deadlineDate as any) - (currentDate as any);
        if (timeDifference < 0){
            return(
                <>
                    {user.user_type === 'user' && (
                        <button className='btn btn-info w-100 rounded-4 mt-3 not-hidden' onClick={() => navigate('/jobofferlistings/1')}>Offer Expired, click here to see more offers.</button>
                    )}
                    </>
            )
        }
        else{
            return(
                <>
                {user.user_type === 'user' && (
                    
                    hasApplied.has_applied ? (
                        <button className='btn btn-info  w-100 rounded-4 mt-3 not-hidden' onClick={() => navigate('/jobofferlistings/1')}>You have already applied for that offer, click here to see more offers.</button>
                    ) : (
                        <button className='btn btn-info w-100 rounded-4 mt-3 not-hidden' onClick={JobApply}>Apply for that offer</button>
                    )
                    
                )     
                    }
                </>
            )
            
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
            setAlertError('Job offer successfully hidden. It is no longer visible, and new applications are disabled success');
            } else {
            setAlertError('Job offer successfully published. If your profile is public, it is now visible, and others can apply success');
            }

        editData(updatedJobOfferStatus, undefined, `/company/joboffer/jobofferstatus/${offerid}`, 'jobOfferStatus');
        };


    useEffect(() =>{
        JobApplyVerification()

    },[hasApplied.has_applied])
    return(
        <>
            <div className='container'>
            {deadline && formatRemainingTime(deadline)}
            
            
                <div className='prevHidden'>
                    {jobOfferStatus && jobOfferStatus?.job_offer_status === true ? (
                        <div className='btn btn-primary w-100 rounded-4 mt-1 btn-block'>
                            <DeleteModal id={`1`} 
                            name={'Hide Job Offer'} 
                            message={'Would you like to hide this job offer? Once hidden, the job offer will no longer be visible to users, and no further applications can be submitted.'} 
                            deleteName = {'Hide'}
                            title="Hide Job Offer"
                            onDelete={changeJobOfferStatus} />
                        </div>  
                        ) : 
                    (
                        
                        <div className='btn btn-primary w-100 rounded-4 mt-1 btn-block'>
                            <DeleteModal id={`2`} 
                            name={'Publish Job Offer'} 
                            message={'Are you ready to publish the job offer? Once posted, the job offer will be visible to everyone, and any user will have the opportunity to apply.'} 
                            deleteName = {'Publish'}
                            title="Publish Job Offer"
                            onDelete={changeJobOfferStatus} />
                        </div>      
                        
                    ) }
                    <div className="d-grid py-2 text-center  ">
                        <div className='btn btn-danger w-100 rounded-4 mt-1 btn-block'>
                            <DeleteModal id={`${offerid}`} 
                            name={'Delete Job Offer'} 
                            message={'Do you want to delete that Job Offer?'} 
                            deleteName = {'Delete'}
                            onDelete={() => saveDelete()} />
                        </div>      
                    </div>
                </div>
            </div>
        </>
    )
}
export default JobOfferStatus;