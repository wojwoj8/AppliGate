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
import ProfileDeleteModal from '../../profileComponents/ProfileDeleteModal';
import Loading from "../../Loading";
import { MultipleErrorResponse, ErrorResponse } from "../../Profile";

  interface QuestionData {
    id: number;
    question: string;
    choice_a: string;
    choice_b: string;
    choice_c: string;
    choice_d: string;
    correct_choice: "a" | "b" | "c" | "d" | "A" | "B" | "C" | "D";
  }
  



interface JobOfferExamCreatorProps {
    setGlobalAlertError: (error: string) => void
}

const JobOfferExamCreator: React.FC<JobOfferExamCreatorProps> = ({
    setGlobalAlertError
}) =>{
    
    
    
    const [err, setErr] = useState<{ [key: string]: string[] } | null>(null);
    const [multipleErrors, setMultipleErrors] = useState<MultipleErrorResponse>({})
    // const [alertError, setAlertError] = useState('');
    // const inputRef = useRef<HTMLInputElement | null>(null);
    const [error, setError] = useState<AxiosError<ErrorResponse> | null>(null);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const {authTokens, logoutUser } = useContext(AuthContext);
    const {jobOfferExamData} = useJobOfferExamContext();

    //data
    const [question, setQuestion] = useState<QuestionData[]>([])

    //edit
    const [editExam, setEditExam] = useState(false)
    const [singleQuestion, setSingleQuestion] = useState<QuestionData | null>(null);
    
    


    const editExamButton = () =>{
        setEditExam(!editExam);
        if(editExam === true){
            removeMultipleErrors('add_question', 0)
            setSingleQuestion(null)
            // getData(setJobOfferResponsibility, `/company/joboffer/responsibility/${offerid}`);
        }
        
    }
    const cancelEditExam = async () =>{
        setEditExam(false);
        removeMultipleErrors('add_question', 0)
        setSingleQuestion(null)
    }
    const saveEditExam = async (endpoint: string, state: QuestionData) =>{
  
        try{
            const response = await axios.post(`${endpoint}`, state,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              setEditExam(false)
  
            removeMultipleErrors(`add_question`, 0)
            getExam();
            setSingleQuestion(null);
        }catch (error: any) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
          else if (error.response && (error.response.status !== 400)) {
            setError(axiosError)
          }
          removeMultipleErrors(`add_question`, 0)
          
            console.log(error);
          }
            
        
    }
    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
        setSingleQuestion((prevQuestion) => ({
        ...prevQuestion!,
        [name]: value,
        }));
      };


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
            setQuestion(data);
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
                            <div className='profile-svgs d-flex my-1' onClick={editExamButton}>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        {question.map((question, index) => (
                            <div key={question.id} className="d-flex row">
                                <div className="row justify-content-center">
                                    <p className="fs-3 fw-bold text-center">{index + 1}.{question.question}</p>
                                </div>
                                <div className="d-flex justify-content-between mt-3">
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name={`choice_a${index}`} id={`choice_a${index}`}/>
                                        <label className="form-check-label" htmlFor={`choice_a${index}`}>
                                            a. {question.choice_a}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name={`choice_a${index}`} id={`choice_b${index}`}/>
                                        <label className="form-check-label" htmlFor={`choice_b${index}`}>
                                            b. {question.choice_b}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name={`choice_a${index}`} id={`choice_c${index}`}/>
                                        <label className="form-check-label" htmlFor={`choice_c${index}`}>
                                            c. {question.choice_c}
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input className="form-check-input" type="radio" name={`choice_a${index}`} id={`choice_d${index}`}/>
                                        <label className="form-check-label" htmlFor={`choice_d${index}`}>
                                            d. {question.choice_d}
                                        </label>
                                    </div>
            
                                </div>
                                <hr></hr>
                            
                            </div>

                        ))}
                        {editExam && (
                            <>
                                <div className=''>
                                    <form>
                                        <div className='row my-2'>
                                            <div className='mb-3 col-md-12'>
                                                <label htmlFor={`question`} className='form-label'>
                                                    QuestionData:
                                                </label>
                                                <input
                                                    type='text'
                                                    name={`question`}
                                                    className={`form-control${renderFieldErrorMultiple('add_question', 0, `question`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                    onChange={handleSingleInputChange}
                                                    value={singleQuestion?.question || ''}
                                                    placeholder='QuestionData'
                                                />
                                                {renderFieldErrorMultiple('add_question', 0, `question`, multipleErrors)}
                                            </div>
                                        </div>
                                        <div className='row my-2'>
                                            <div className='mb-3 col-md-3'>
                                                <label htmlFor={`choice_a`} className='form-label'>
                                                    Answer a:
                                                </label>
                                                <input
                                                    type='text'
                                                    name={`choice_a`}
                                                    className={`form-control${renderFieldErrorMultiple('add_question', 0, `choice_a`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                    placeholder='Answer a'
                                                    onChange={handleSingleInputChange}
                                                    value={singleQuestion?.choice_a || ''}
                                                />
                                                {renderFieldErrorMultiple('add_question', 0, `choice_a`, multipleErrors)}
                                            </div>
                                            <div className='mb-3 col-md-3'>
                                                <label htmlFor={`choice_b`} className='form-label'>
                                                    Answer b:
                                                </label>
                                                <input
                                                    type='text'
                                                    name={`choice_b`}
                                                    className={`form-control${renderFieldErrorMultiple('add_question', 0, `choice_b`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                    placeholder='Answer b'
                                                    onChange={handleSingleInputChange}
                                                    value={singleQuestion?.choice_b || ''}
                                                />
                                                {renderFieldErrorMultiple('add_question', 0, `choice_b`, multipleErrors)}
                                            </div>
                                            <div className='mb-3 col-md-3'>
                                                <label htmlFor={`job_responsibility`} className='form-label'>
                                                    Answer c:
                                                </label>
                                                <input
                                                    type='text'
                                                    name={`choice_c`}
                                                    className={`form-control${renderFieldErrorMultiple('add_question', 0, `choice_c`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                    placeholder='Answer c'
                                                    onChange={handleSingleInputChange}
                                                    value={singleQuestion?.choice_c || ''}
                                                />
                                                {renderFieldErrorMultiple('add_question', 0, `choice_c`, multipleErrors)}
                                            </div>
                                            <div className='mb-3 col-md-3'>
                                                <label htmlFor={`choice_d`} className='form-label'>
                                                    Answer d:
                                                </label>
                                                <input
                                                    type='text'
                                                    name={`choice_d`}
                                                    className={`form-control${renderFieldErrorMultiple('add_question', 0, `choice_d`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                    placeholder='Answer d'
                                                    onChange={handleSingleInputChange}
                                                    value={singleQuestion?.choice_d || ''}
                                                />
                                                {renderFieldErrorMultiple('add_question', 0, `choice_d`, multipleErrors)}
                                            </div>
                                        </div>
                                        <div className='row my-2'>
                                        <div className='mb-3 col-md-12'>
                                                <label htmlFor={`correct_choice`} className='form-label'>
                                                    Correct choice - one only
                                                </label>
                                                <input
                                                    type='text'
                                                    name={`correct_choice`}
                                                    className={`form-control${renderFieldErrorMultiple('add_question', 0, `correct_choice`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                    placeholder='a, b, c or d'
                                                    onChange={handleSingleInputChange}
                                                    value={singleQuestion?.correct_choice || ''}
                                                />
                                                {renderFieldErrorMultiple('add_question', 0, `correct_choice`, multipleErrors)}
                                            </div>
                                        </div>
                                    </form>
                                    <div className='text-center'>
                                        <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditExam}>
                                            Cancel
                                        </button>
                                        <button className='btn btn-primary' style={{width:'5rem'}} >
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <hr></hr>
                            </>
                        )}
                    </div>
                    
            
            </div>
        </div>
    )
}
export default JobOfferExamCreator;