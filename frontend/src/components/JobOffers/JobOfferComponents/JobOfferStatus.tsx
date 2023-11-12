import { JobOfferGetDataFunction, JobOfferEditDataFunction , JobOfferEditMultipleDataFunction } from "../JobOffer";
import { JobOfferStatusData } from "../JobOffer";
import axios, { AxiosError } from "axios";
import { useContext } from "react";
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
    const {authTokens, logoutUser } = useContext(AuthContext);

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
        setAlertError('JobOffer Changed to listed, now everone can see and applay for that job offer success');
    }

    editData(updatedJobOfferStatus, undefined, `/company/joboffer/jobofferstatus/${offerid}`, 'jobOfferStatus');
    };

    return(
        <div className='container prevHidden'>
            {jobOfferStatus && jobOfferStatus?.job_offer_status === true ? (
                <button className='btn btn-primary w-100 rounded-4 mt-3' onClick={changeJobOfferStatus}>Set JobOffer to Not listed</button>) : 
            (
                <button className='btn btn-primary w-100 rounded-4 mt-3' onClick={changeJobOfferStatus}>Set Profile to Listed</button>
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
    )
}
export default JobOfferStatus;