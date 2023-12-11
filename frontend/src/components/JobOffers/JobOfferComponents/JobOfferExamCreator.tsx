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
import { useNavigate } from "react-router-dom";

  interface QuestionData {
    id: number;
    question: string;
    choice_a: string;
    choice_b: string;
    choice_c: string;
    choice_d: string;
    correct_choice: "a" | "b" | "c" | "d" | "A" | "B" | "C" | "D";
    job_offer: number;
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
    const {jobOfferExamData, setJobOfferExamData} = useJobOfferExamContext();

    //data
    const [question, setQuestion] = useState<QuestionData[]>([])
    const [singleQuestion, setSingleQuestion] = useState<QuestionData | null>(null);

    //edit
    const [editExam, setEditExam] = useState(false)
    const [editQuestion, setEditQuestion] = useState<boolean[]>([]);
    
    
    const nav = useNavigate()


    const editExamButton = () =>{
        setEditExam(!editExam);
        if(editExam === true){
            removeMultipleErrors('add_question', 0)
            setSingleQuestion(null)
            // getData(setquestion, `/company/joboffer/responsibility/${offerid}`);
        }
        
    }
    const cancelEditExam = async () =>{
        setEditExam(false);
        removeMultipleErrors('add_question', 0)
        setSingleQuestion(null)
    }

    const editQuestionButton = async (index: number, id?: number) => {
        if (editQuestion[index] === true){
           await cancelEditQuestion(index, id)
           return
        }
        setEditQuestion((prevEditQuestion) => {
          const neweditquestions = [...prevEditQuestion];
          neweditquestions[index] = !prevEditQuestion[index];
          return neweditquestions;
        });
        
    }

    
    const cancelEditQuestion = async (index: number, id?: number) => {
        setEditQuestion((prevEditQuestion) => {
          const neweditquestions = [...prevEditQuestion];
          neweditquestions[index] = false;
          return neweditquestions;
        });
        removeMultipleErrors('job_responsibility', index)
        await getExam();

      };
    const saveExam = async () =>{
        // to dont get error that no data sent
        let data
        if (singleQuestion){
            singleQuestion!.job_offer = jobOfferExamData!.id
            data = singleQuestion
        }else{
            data = {'job_offer':jobOfferExamData!.id}
        }
        
        try{
            const response = await axios.post(`/joboffer/exam/${jobOfferExamData!.id}`, data,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              setEditExam(false)
  
            removeMultipleErrors(`add_question`, 0)
            getExam();
            setSingleQuestion(null);
            setEditExam(false);
            setGlobalAlertError('Question created successfully success');
        }catch (error: any) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
          else if (error.response && (error.response.status !== 400)) {
            console.log(axiosError)
            setError(axiosError)
          }
          removeMultipleErrors(`add_question`, 0)
          if (axiosError.response?.data) {
            handleMultipleErrors(`add_question`, 0, axiosError.response?.data)
          }
            console.log(error);
          }
            
        
    }
    
    const handlePercentageChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
        setJobOfferExamData((prevQuestion) => ({
        ...prevQuestion!,
        [name]: value,
        }));
      };
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
      const deleteData = async (id: number) => {
        try {
          const response = await axios.delete(`/joboffer/exam/delete/${id}`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + String(authTokens.access),
            },
          });
      
          
          setEditQuestion((prevEditQuestions) => {
            const newEditQuestions = [...prevEditQuestions];
            newEditQuestions[id] = false;
            return newEditQuestions;
        });
          
            getExam();
            setGlobalAlertError('Question deleted successfully success');
      }catch (error: any) {
        if (error.response && error.response.status === 401) {
          // Unauthorized - Logout the user
          logoutUser();
        }
        setGlobalAlertError('Something went wrong error');
    
          console.log(error);
        }
    }

      const deleteQuestion = (id: number) => {
        deleteData(id);
    }

    const handleQuestionInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        
    ) => {
        let { name, value } = event.target;
        name = name.substring(0, name.lastIndexOf('_'));
        // console.log(value)
        // Create an object with the new property and value
        const updatedProperty = {
        [name]: value,
        };
    
        setQuestion((prevQuestion) => {
        const updatedQuestions = [...prevQuestion];
        updatedQuestions[index] = {
            ...updatedQuestions[index],
            ...updatedProperty, 
        };
        return updatedQuestions;
        });
    };

    const saveEditExam = async (index: number, id?: number) =>{
        question[index]!.job_offer = jobOfferExamData!.id
        console.log(question[index])
        try{
            const response = await axios.put(`/joboffer/exam/${jobOfferExamData!.id}`, question[index],  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              setEditExam(false)
  
            removeMultipleErrors(`edit_question`, index)
            cancelEditQuestion(index, id);
            setGlobalAlertError('Question edited successfully success');

        }catch (error: any) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
          else if (error.response && (error.response.status !== 400)) {
            console.log(axiosError)
            setError(axiosError)
          }
          removeMultipleErrors(`edit_question`, index)
          // serializer for errors
        if (axiosError.response?.data) {
            const keys = Object.keys(axiosError.response?.data)
            keys.forEach((key) => {
                const newKey = key + `_${index}`;
                axiosError.response!.data[newKey] = axiosError.response!.data[key];
                delete axiosError.response!.data[key];
            });
            
            handleMultipleErrors(`edit_question`, index, axiosError.response?.data)
          
        }
            
    }
    }
    
    const changePassPercentage = async () =>{
        
        
        try{
            const response = await axios.put(`/joboffer/exam/percentage/${jobOfferExamData!.id}`, jobOfferExamData,  {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
              setEditExam(false)
  
            removeMultipleErrors(`edit_examproc`, 0)

            setGlobalAlertError(`Pass percentage changed to ${jobOfferExamData?.exam_pass_percentage} successfully success`);
        }catch (error: any) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (error.response && error.response.status === 401) {
            // Unauthorized - Logout the user
            logoutUser();
          }
          else if (error.response && (error.response.status !== 400)) {
            console.log(axiosError)
            setError(axiosError)
          }
          removeMultipleErrors(`edit_examproc`, 0)
          if (axiosError.response?.data) {
            handleMultipleErrors(`edit_examproc`, 0, axiosError.response?.data)
          }
            console.log(error);
          }
    }
    
    const deleteExam = async() =>{
        
            try {
              const response = await axios.delete(`/joboffer/wholeexam/delete/${jobOfferExamData!.id}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
              });
          
                setGlobalAlertError('Exam deleted successfully success');
                nav(-1)
          }catch (error: any) {
            if (error.response && error.response.status === 401) {
              // Unauthorized - Logout the user
              logoutUser();
            }
            setGlobalAlertError('Something went wrong error');
        
              console.log(error);
            }
        
    }

    if (loading) {
        return <Loading progress={progress} />
    }
    if (error){
        return <ErrorPage axiosError={error} />
    }
    return(

        <div className={`pb-1`}>
            
            <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Exam</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1 rotate' onClick={editExamButton}>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    {editExam && (
                            <>
                                <div className=''>
                                    <form>
                                        <div className='row my-2'>
                                            <div className='mb-3 col-md-12'>
                                                <label htmlFor={`question`} className='form-label'>
                                                    Question:
                                                </label>
                                                <input
                                                    type='text'
                                                    name={`question`}
                                                    className={`form-control${renderFieldErrorMultiple('add_question', 0, `question`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                    onChange={handleSingleInputChange}
                                                    value={singleQuestion?.question || ''}
                                                    placeholder='Question'
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
                                        <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveExam}>
                                            Add
                                        </button>
                                    </div>
                                </div>
                                <hr></hr>
                            </>
                        )}
                    <div>
                        {question.map((question, index) => (
                            <div key={question.id} className="d-flex row">
                                {!editQuestion[index] && (
                                    <>
                                        <div className="row col justify-content-center">
                                            <p className="fs-3 fw-bold text-center">{index + 1}.{question.question}</p>
                                        </div>
                                        <div className='col-auto'>
                                            <div className='profile-svgs d-flex my-1' onClick={() => editQuestionButton(index, question.id)}>
                                                <Icon path={mdiPencil} size={1} />
                                            </div>
                                            <ProfileDeleteModal id={`${question.id}`} onDelete={() => deleteQuestion(question.id)} />
                                        </div>
                                        <div className="d-flex justify-content-between flex-wrap mt-3">
                                            <div className="form-check col-12">
                                                <input className="form-check-input" type="radio" name={`choice_a${index}`} id={`choice_a${index}`}/>
                                                <label className="form-check-label" htmlFor={`choice_a${index}`}>
                                                    a. {question.choice_a}
                                                </label>
                                            </div>
                                            <div className="form-check col-12">
                                                <input className="form-check-input" type="radio" name={`choice_a${index}`} id={`choice_b${index}`}/>
                                                <label className="form-check-label" htmlFor={`choice_b${index}`}>
                                                    b. {question.choice_b}
                                                </label>
                                            </div>
                                            <div className="form-check col-12">
                                                <input className="form-check-input" type="radio" name={`choice_a${index}`} id={`choice_c${index}`}/>
                                                <label className="form-check-label" htmlFor={`choice_c${index}`}>
                                                    c. {question.choice_c}
                                                </label>
                                            </div>
                                            <div className="form-check col-12">
                                                <input className="form-check-input" type="radio" name={`choice_a${index}`} id={`choice_d${index}`}/>
                                                <label className="form-check-label" htmlFor={`choice_d${index}`}>
                                                    d. {question.choice_d}
                                                </label>
                                            </div>
                    
                                        </div>
                                        <hr></hr>
                                    </>
                                    
                                    )}
                                {editQuestion[index] && (
                                    <>
                                        <div className=''>
                                            <form>
                                                <div className='row my-2'>
                                                    <div className='mb-3 col-md-12'>
                                                        <label htmlFor={`question_${index}`} className='form-label'>
                                                            Question:
                                                        </label>
                                                        <input
                                                            type='text'
                                                            name={`question_${index}`}
                                                            className={`form-control${renderFieldErrorMultiple('edit_question', index, `question_${index}`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                            onChange={(e) => handleQuestionInputChange(index, e)}
                                                            value={question?.question || ''}
                                                            placeholder='Question'
                                                        />
                                                        {renderFieldErrorMultiple(`edit_question`, index, `question_${index}`, multipleErrors)}
                                                    </div>
                                                </div>
                                                <div className='row my-2'>
                                                    <div className='mb-3 col-md-3'>
                                                        <label htmlFor={`choice_a_${index}`} className='form-label'>
                                                            Answer a:
                                                        </label>
                                                        <input
                                                            type='text'
                                                            name={`choice_a_${index}`}
                                                            className={`form-control${renderFieldErrorMultiple('edit_question', index, `choice_a_${index}`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                            placeholder='Answer a'
                                                            onChange={(e) => handleQuestionInputChange(index, e)}
                                                            value={question?.choice_a || ''}
                                                        />
                                                        {renderFieldErrorMultiple('edit_question', index, `choice_a_${index}`, multipleErrors)}
                                                    </div>
                                                    <div className='mb-3 col-md-3'>
                                                        <label htmlFor={`choice_b_${index}`} className='form-label'>
                                                            Answer b:
                                                        </label>
                                                        <input
                                                            type='text'
                                                            name={`choice_b_${index}`}
                                                            className={`form-control${renderFieldErrorMultiple('edit_question', index, `choice_b_${index}`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                            placeholder='Answer b'
                                                            onChange={(e) => handleQuestionInputChange(index, e)}
                                                            value={question?.choice_b || ''}
                                                        />
                                                        {renderFieldErrorMultiple('edit_question', index, `choice_b_${index}`, multipleErrors)}
                                                    </div>
                                                    <div className='mb-3 col-md-3'>
                                                        <label htmlFor={`job_responsibility`} className='form-label'>
                                                            Answer c:
                                                        </label>
                                                        <input
                                                            type='text'
                                                            name={`choice_c_${index}`}
                                                            className={`form-control${renderFieldErrorMultiple('edit_question', index, `choice_c_${index}`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                            placeholder='Answer c'
                                                            onChange={(e) => handleQuestionInputChange(index, e)}
                                                            value={question?.choice_c || ''}
                                                        />
                                                        {renderFieldErrorMultiple('edit_question', index, `choice_c_${index}`, multipleErrors)}
                                                    </div>
                                                    <div className='mb-3 col-md-3'>
                                                        <label htmlFor={`choice_d`} className='form-label'>
                                                            Answer d:
                                                        </label>
                                                        <input
                                                            type='text'
                                                            name={`choice_d_${index}`}
                                                            className={`form-control${renderFieldErrorMultiple('edit_question', index, `choice_d_${index}`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                            placeholder='Answer d'
                                                            onChange={(e) => handleQuestionInputChange(index, e)}
                                                            value={question?.choice_d || ''}
                                                        />
                                                        {renderFieldErrorMultiple('edit_question', index, `choice_d_${index}`, multipleErrors)}
                                                    </div>
                                                </div>
                                                <div className='row my-2'>
                                                    <div className='mb-3 col-md-12'>
                                                        <label htmlFor={`correct_choice`} className='form-label'>
                                                            Correct choice - one only
                                                        </label>
                                                        <input
                                                            type='text'
                                                            name={`correct_choice_${index}`}
                                                            className={`form-control${renderFieldErrorMultiple('edit_question', index, `correct_choice_${index}`, multipleErrors) ? ' is-invalid' : ''}`} 
                                                            placeholder='a, b, c or d'
                                                            onChange={(e) => handleQuestionInputChange(index, e)}
                                                            value={question?.correct_choice || ''}
                                                        />
                                                        {renderFieldErrorMultiple('edit_question', index, `correct_choice_${index}`, multipleErrors)}
                                                    </div>
                                                </div>
                                            </form>
                                            <div className='text-center'>
                                                <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={() => cancelEditQuestion(index, question.id)}>
                                                    Cancel
                                                </button>
                                                <button className='btn btn-primary' style={{width:'5rem'}}onClick={() => saveEditExam(index, question.id)} >
                                                    Add
                                                </button>
                                            </div>
                                        </div>
                                        <hr></hr>
                                    </>
                                )}
                            
                            </div>

                        ))}
                        <div className='mb-3 col-md-12'>
                            <label htmlFor={`exam_pass_percentage`} className='form-label'>
                                Pass percentage
                            </label>
                            <div className="input-group">

                            
                            <input
                                type='number'
                                name={`exam_pass_percentage`}
                                className={`form-control${renderFieldErrorMultiple('edit_examproc', 0, `exam_pass_percentage`, multipleErrors) ? ' is-invalid' : ''}`} 
                                placeholder='70'
                                onChange={handlePercentageChange}
                                min={0}
                                max={100}
                                value={jobOfferExamData?.exam_pass_percentage || ''}
                            />
                            <button className="btn btn-primary" type="button" id="button-addon2" onClick={changePassPercentage}>
                                Change
                            </button>
                            </div>
                            {renderFieldErrorMultiple('edit_examproc', 0, `exam_pass_percentage`, multipleErrors)}
                        </div>
                    </div>
                    <button className="btn btn-primary w-100 rounded-4 mt-1 btn-block" type="button"  onClick={() => nav(-1)}>
                        Return to Offer
                    </button>
                    <div className="d-grid py-2 text-center  ">
                        <div className='btn btn-danger w-100 rounded-4 mt-1 btn-block'>
                            <DeleteModal id={`${jobOfferExamData!.id}`} 
                            name={'Delete Exam'} 
                            message={'Do you want to delete that Exam? Every user will be able to apply for that offer and those applications will no longer be automatically verified.'} 
                            deleteName = {'Delete'}
                            onDelete={() => deleteExam()} 
                            />
                        </div>      
                    </div>
            
            </div>
        </div>
    )
}
export default JobOfferExamCreator;