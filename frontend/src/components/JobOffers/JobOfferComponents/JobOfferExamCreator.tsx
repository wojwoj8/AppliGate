import React, { useContext, useState, useEffect, useRef } from "react";
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';
import { useJobOfferExamContext } from '../JobOfferContexts/JobOfferExamContext';
import axios from "axios";
import AuthContext from "../../../utils/AuthProvider";
import { AxiosError } from "axios";
import ErrorPage from "../../ErrorPage";
import ProfileAlert from "../../profileComponents/ProfileAlert";
import DeleteModal from "../../DeleteModal";
import Loading from "../../Loading";
import { MultipleErrorResponse, ErrorResponse } from "../../Profile";

interface Question {
    id: number;
    question: string;
    choice_a: string;
    choice_b: string;
    choice_c: string;
    choice_d: string;
  }
  
  interface ExamData {
    id: number;
    questions: Question[];
    job_offer: number;
  }


interface JobOfferExamCreatorProps {
    setGlobalAlertError: (error: string) => void
}

const JobOfferExamCreator: React.FC<JobOfferExamCreatorProps> = ({
    setGlobalAlertError
}) =>{
    
    const [exam, setExam] = useState<ExamData>()
    const {authTokens, logoutUser } = useContext(AuthContext);
    const [err, setErr] = useState<{ [key: string]: string[] } | null>(null);
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>({})
    // const [alertError, setAlertError] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const {jobOfferExamData} = useJobOfferExamContext();


    useEffect(() => {
        const fetchData = async () =>{
          setLoading(true);
          setProgress(50);
          await getExam();
          setProgress(100);
          setLoading(false);
        }
        fetchData();
          
      },[])
  
    const renderFieldErrorMultiple = (
        field: string, 
        index: number, 
        errorKey: string, 
        error: MultipleErrorResponse | undefined) => {
        if (error && error[field] && typeof error[field][index] === "object" && 
        error[field][index].hasOwnProperty(errorKey)) {
        const messages = error[field][index][errorKey];
        return (
            <div>
            {messages.map((message, i) => (
                <span key={i} className="text-danger">
                {message}
                </span>
            ))}
            </div>
        );
        }
        return null;
    };
    
    const handleMultipleErrors = (key: string, index: number, errorData: ErrorResponse) => {
        setMultipleErrors((prevState) => ({
        ...prevState,
        [key]: {
            ...(prevState[key] || {}),
            [index]: {
            ...(prevState[key]?.[index] || {}),
            ...errorData
            }
        }
        }));
    };

    const removeMultipleErrors = (key: string, index: number) => {
        setMultipleErrors((prevState) => ({
        ...prevState,
        [key]: {
            ...(prevState[key] || {}),
            [index]: {}
        }
        }));
    };


    const getExam = async () => {
        try {
          const response = await axios.get(`/joboffer/exam/${jobOfferExamData!.id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(authTokens.access),
            },
          });
    
          const data = response.data;
          console.log(data)
          if (response.status === 200) {
            setExam(data);
          }
        }catch (error: any) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
          else if (error.response && (error.response.status !== 400)) {
            setError(axiosError)
          }
        }
      };




    return(

        <div className={`pb-1`}>
            
            <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Exam</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1'>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    <div>
                        {exam?.questions.map((question) => (
                            <div key={question.id} className="d-flex row">
                                <div className="row justify-content-center">
                                    <p className="fs-3 fw-bold text-center">{question.question}</p>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/>
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            a. {question.choice_a}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/>
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            b. {question.choice_b}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/>
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            c. {question.choice_c}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"/>
                                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                                            d. {question.choice_d}
                                        </label>
                                    </div>
            
                                </div>
                                <hr></hr>
                            
                            </div>

                        ))}
                        <p></p>
                    </div>
                    
            
            </div>
        </div>
    )
}
export default JobOfferExamCreator;