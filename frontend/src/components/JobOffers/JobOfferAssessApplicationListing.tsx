
import axios, { AxiosError } from "axios";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../utils/AuthProvider";
import DeleteModal from "../DeleteModal";
import { ErrorResponse } from "../Profile";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ProfileData } from "../Profile";
import Pagination from "../sharedComponents/Pagination";
import { PaginationData } from "../sharedComponents/Pagination";
import JobOfferAssessApplicationListingItem from "./JobOfferAssessApplicationListingItem";
import Loading from "../Loading";
import ErrorPage from "../ErrorPage";
import { useJobOfferContext } from "./JobOfferContexts/JobOfferContext";

export interface ApplicantData{
    applicant: ProfileData;
    application_date: string;
    id: number;
    title: string;
    job_offer: number;
    status: string;
    user_username: string;
  }
const JobOfferAssessApplicationListing: React.FC = () =>{


    const navigate = useNavigate();
    const API_BASE_URL = 'http://localhost:8000';
    const [data, setData]= useState<PaginationData>({
        count: null,
        next: "",
        previous: ""
    });
    // for loading
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    // Authtoken for CRUD and user for username and logout
    const { authTokens, logoutUser } = useContext(AuthContext);

    // Axios error for error component
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null)
    // Fetch job offer data from the backend
    const [applicant, setApplicant] = useState<ApplicantData[]>([]);

    const {offerid, page} = useParams()
    const { jobOffer } = useJobOfferContext();
    
    const getData = async (
        ) =>{
            try {
                if (jobOffer === null) {
                    // when no job offer id go to my job offers
                    navigate('/company/myJobOffers/1')
                    return;
                }

                const response = await axios.get(`${API_BASE_URL}/company/joboffer/applicants/${jobOffer.id}/${page}?page=${page}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + String(authTokens.access),
                    },
                });
    
                const {results, ...rest} = response.data
                // console.log(response.data)
                
                if (response.status === 200) {
                    // setGlobalAlertError('Application submitted successfully! Thank you for applying success')
                    // navigate("/");
                    setData(rest)
                    setApplicant(results)
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
    const fetchData = async () =>{
    
        setIsLoading(true);
        setProgress(50);
        await getData();
        setProgress(100);
        setIsLoading(false);
    }
    
    useEffect(() => {
        fetchData();
    }, [page]);

    if (isLoading) {
        return <Loading progress={progress} />
    }
    if (error){
        return <ErrorPage axiosError={error} />
    }    
    return(
        <>
        <div className='container-fluid'>
            
          
          {applicant && applicant.length ? (<>
            <h1>{applicant[0].title} offer applicants </h1>
            {applicant.map((user) => (
                
              <JobOfferAssessApplicationListingItem key={user.id}  data={user} />
  
            ))}
          </>)
          : (
            <div>
                <h2>There are no applicants for that offer</h2>
            </div>
          )}
          
            
        </div>
      
        <Pagination data={data} page={page} url={'/company/joboffer/applicants/'}/>
        
      </>
    )

}
export default JobOfferAssessApplicationListing;