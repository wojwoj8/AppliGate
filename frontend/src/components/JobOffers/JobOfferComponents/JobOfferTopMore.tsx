import React, {useState} from "react";
import { JobOfferTopMoreData, JobOfferTopColorsData } from "../JobOffer";
import { JobOfferGetDataFunction, JobOfferEditDataFunction } from "../JobOffer";
import { MultipleErrorResponse } from "../../Profile";
import Icon from '@mdi/react';
import { mdiPencil, mdiPalette } from '@mdi/js';
import { Link } from "react-router-dom";
import CustomColorPicker from "../../sharedComponents/ColorPicker";
// @ts-ignore
import { SketchPicker } from 'react-color';


interface JobOfferTopMoreProps {
    jobOfferTopMore: JobOfferTopMoreData | null;
    setJobOfferTopMore: React.Dispatch<React.SetStateAction<JobOfferTopMoreData | null>>;
    getData: (
        setData: JobOfferGetDataFunction,
        endpoint: string
        ) => void;
    editData: (state: JobOfferEditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    // editJobOfferCompany: boolean;
    // setEditJobOfferCompany: React.Dispatch<React.SetStateAction<boolean>>;
    setEditJobOfferTopMore: React.Dispatch<React.SetStateAction<boolean>>;
    editJobOfferTopMore: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    alertError: string;
    setAlertError: React.Dispatch<React.SetStateAction<string>>;
    offerid: string;
    setEditColors: React.Dispatch<React.SetStateAction<boolean>>
    editColors: boolean;
    setJobOfferTopColors: React.Dispatch<React.SetStateAction<JobOfferTopColorsData | null>>;
    jobOfferTopColors: JobOfferTopColorsData | null;
    }

    const JobOfferTopMore: React.FC<JobOfferTopMoreProps> = ({
    jobOfferTopMore, getData, editData, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, alertError, setAlertError, setEditJobOfferTopMore, editJobOfferTopMore,
    setJobOfferTopMore, offerid, setEditColors, editColors, setJobOfferTopColors,
    jobOfferTopColors
      }) => {


    
    const handleColorChange = (newColor: any) => {
        setJobOfferTopColors((prevColors) => ({
            ...prevColors,
            svg_color: newColor.hex,
            background_color: prevColors ? prevColors.background_color : ''
        }));
        };
    const handleBackColorChange = (newColor: any) => {
        setJobOfferTopColors((prevColors) => ({
            ...prevColors,
            background_color: newColor.hex,
            svg_color: prevColors ? prevColors.svg_color : '' 
        }));
        };

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        ) => {
        const { name, value } = event.target;
        
        
        setJobOfferTopMore((prevJobOfferTopMore) => ({
        ...prevJobOfferTopMore!,
        [name]: value,
        }));

        };

    const editJobOffer = () =>{
        setEditJobOfferTopMore(!editJobOfferTopMore);
        if(editJobOfferTopMore === true){
            removeMultipleErrors('topmore', 0)
            getData(setJobOfferTopMore, `/company/joboffer/topmore/${offerid}`);
        }
        
    }
    const cancelEditJobOffer = () =>{
        setEditJobOfferTopMore(false);
        removeMultipleErrors('topmore', 0)
        getData(setJobOfferTopMore, `/company/joboffer/topmore/${offerid}`);
        
    }

    const editColorsForm = () =>{
        setEditColors(!editColors);
        if(editColors === true){
            removeMultipleErrors('topcolors', 0)
            getData(setJobOfferTopColors, `/company/joboffer/topcolors/${offerid}`);
        } 
    }
    const cancelEditColorsForm = () =>{
        setEditColors(false);
            removeMultipleErrors('topcolors', 0)
            getData(setJobOfferTopColors, `/company/joboffer/topcolors/${offerid}`);
    }

    const saveEdit = async () =>{
        await editData(jobOfferTopMore, setEditJobOfferTopMore, `/company/joboffer/topmore/${offerid}`, 'topmore')
    }
    const saveEditColors = async () =>{
        await editData(jobOfferTopColors, setEditColors, `/company/joboffer/topcolors/${offerid}`, 'topcolors')
    }
    const formatRemainingTime = (deadline: string) => {
        const deadlineDate = new Date(deadline);
        const currentDate = new Date();
    
        const timeDifference = (deadlineDate as any) - (currentDate as any);
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    
        if (daysDifference >= 1) {
            return(
            <div className="m-0">
                <p className="m-0">Valid for: {daysDifference} Days</p>
                <p>Until: {deadlineDate.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'})}</p>
            </div>
            )
        } 
        else {
            const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
            if (hoursDifference >= 1) {
                return `Valid for: ${hoursDifference} hours`;
        } 
        else {
            const minutesDifference = Math.floor(timeDifference / (1000 * 60));
            if (minutesDifference >= 1) {
                return `Valid for: ${minutesDifference} minutes`;
            } 
            else {
                return "Offer Expired";
            }
        }
    }
}


      return(
        <div>
            <hr></hr>
            
            
            <div className='profile-svgs d-flex justify-content-end my-1'>
                <div className='profile-svgs d-flex my-1' onClick={editJobOffer}>
                    <Icon path={mdiPencil} size={1.25} />
                </div>
                <div className='profile-svgs d-flex my-1' onClick={editColorsForm}>
                    <Icon path={mdiPalette} size={1.25} />
                </div>
            </div>

            {editColors &&
                <>
                
                <div className="d-flex row row-cols-md-auto justify-content-md-around">
                    <div className="d-flex flex-column align-items-center">
                        <p>Main color:</p>
                        <SketchPicker color={jobOfferTopColors?.svg_color} onChange={handleColorChange} />
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <p>Background color:</p>
                        <SketchPicker color={jobOfferTopColors?.background_color} onChange={handleBackColorChange} />
                    </div>
                </div>
                <div className='text-center mb-1 mt-2'>
                        <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditColorsForm}>Cancel</button>
                        <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveEditColors}>Save</button>
                    </div>
                <hr></hr>
                </>
            }

            {!editJobOfferTopMore && 
            <>
                <div className="row gy-4 row-cols-md-2 d-flex align-items-center">
                    <div className="d-flex align-items-center">
                        <div className="rounded-3" style={{background: jobOfferTopColors?.background_color}}>
                            <svg className="not-hidden p-1" width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill={`${jobOfferTopColors?.svg_color}`} d="M12 20a8 8 0 0 0 8-8a8 8 0 0 0-8-8a8 8 0 0 0-8 8a8 8 0 0 0 8 8m0-18a10 10 0 0 1 10 10a10 10 0 0 1-10 10C6.47 22 2 17.5 2 12A10 10 0 0 1 12 2m.5 5v5.25l4.5 2.67l-.75 1.23L11 13V7h1.5Z"/>
                            </svg>
                        </div>
                        
                        <div className="ms-2">
                            {jobOfferTopMore?.job_application_deadline
                            ? formatRemainingTime(jobOfferTopMore.job_application_deadline)
                            : 'No deadline specified'}
                        </div>
                    </div>
                    

                    <div className="d-flex align-items-center">
                        <div className="rounded-3" style={{background: jobOfferTopColors?.background_color}}>
                            <svg className="not-hidden p-1" width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <g id="evaPinOutline0">
                                    <g id="evaPinOutline1">
                                        <g id="evaPinOutline2" fill={`${jobOfferTopColors?.svg_color}`}>
                                            <path d="M12 2a8 8 0 0 0-8 7.92c0 5.48 7.05 11.58 7.35 11.84a1 1 0 0 0 1.3 0C13 21.5 20 15.4 20 9.92A8 8 0 0 0 12 2Zm0 17.65c-1.67-1.59-6-6-6-9.73a6 6 0 0 1 12 0c0 3.7-4.33 8.14-6 9.73Z"/>
                                            <path d="M12 6a3.5 3.5 0 1 0 3.5 3.5A3.5 3.5 0 0 0 12 6Zm0 5a1.5 1.5 0 1 1 1.5-1.5A1.5 1.5 0 0 1 12 11Z"/>
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <p>{jobOfferTopMore?.job_location}</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="rounded-3" style={{background: jobOfferTopColors?.background_color}}>
                            <svg className="not-hidden p-1" width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill={`${jobOfferTopColors?.svg_color}`} d="M4 19V8v11v-.375V19Zm0 2q-.825 0-1.413-.588T2 19V8q0-.825.588-1.413T4 6h4V4q0-.825.588-1.413T10 2h4q.825 0 1.413.588T16 4v2h4q.825 0 1.413.588T22 8v4.275q-.45-.325-.95-.563T20 11.3V8H4v11h7.075q.075.525.225 1.025t.375.975H4Zm6-15h4V4h-4v2Zm8 17q-2.075 0-3.538-1.463T13 18q0-2.075 1.463-3.538T18 13q2.075 0 3.538 1.463T23 18q0 2.075-1.463 3.538T18 23Zm.5-5.2V15h-1v3.2l2.15 2.15l.7-.7l-1.85-1.85Z"/>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <p>{jobOfferTopMore?.work_schedule}</p>
                        </div>
                    </div>
                    <div className="d-flex align-items-center">
                        <div className="rounded-3" style={{background: jobOfferTopColors?.background_color}}>
                            <svg className="not-hidden p-1" width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill={`${jobOfferTopColors?.svg_color}`} d="M21.71 8.71c1.25-1.25.68-2.71 0-3.42l-3-3c-1.26-1.25-2.71-.68-3.42 0L13.59 4H11C9.1 4 8 5 7.44 6.15L3 10.59v4l-.71.7c-1.25 1.26-.68 2.71 0 3.42l3 3c.54.54 1.12.74 1.67.74c.71 0 1.36-.35 1.75-.74l2.7-2.71H15c1.7 0 2.56-1.06 2.87-2.1c1.13-.3 1.75-1.16 2-2C21.42 14.5 22 13.03 22 12V9h-.59l.3-.29M20 12c0 .45-.19 1-1 1h-1v1c0 .45-.19 1-1 1h-1v1c0 .45-.19 1-1 1h-4.41l-3.28 3.28c-.31.29-.49.12-.6.01l-2.99-2.98c-.29-.31-.12-.49-.01-.6L5 15.41v-4l2-2V11c0 1.21.8 3 3 3s3-1.79 3-3h7v1m.29-4.71L18.59 9H11v2c0 .45-.19 1-1 1s-1-.55-1-1V8c0-.46.17-2 2-2h3.41l2.28-2.28c.31-.29.49-.12.6-.01l2.99 2.98c.29.31.12.49.01.6Z"/>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <p>{jobOfferTopMore?.recruitment_type}</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="rounded-3" style={{background: jobOfferTopColors?.background_color}}>
                            <svg className="not-hidden p-1" width="54" height="54" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                <path fill={`${jobOfferTopColors?.svg_color}`} d="M30 30h-8V4h8zm-6-2h4V6h-4zm-4 2h-8V12h8zm-6-2h4V14h-4zm-4 2H2V18h8z"/>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <p>{jobOfferTopMore?.position_level}</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="rounded-3" style={{background: jobOfferTopColors?.background_color}}>
                            <svg className="not-hidden p-1" width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill={`${jobOfferTopColors?.svg_color}`} d="M8 12h8v2H8v-2m2 8H6V4h7v5h5v3.1l2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4v-2m-2-2h4.1l.9-.9V16H8v2m12.2-5c.1 0 .3.1.4.2l1.3 1.3c.2.2.2.6 0 .8l-1 1l-2.1-2.1l1-1c.1-.1.2-.2.4-.2m0 3.9L14.1 23H12v-2.1l6.1-6.1l2.1 2.1Z"/>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <p>{jobOfferTopMore?.contract_type}</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="rounded-3" style={{background: jobOfferTopColors?.background_color}}>
                            <svg className="not-hidden p-1" width="54" height="54" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path fill={`${jobOfferTopColors?.svg_color}`} d="M17 9h2V7h-2v2Zm0 4h2v-2h-2v2Zm0 4h2v-2h-2v2Zm0 4v-2h4V5h-9v1.4l-2-1.45V3h13v18h-6ZM1 21V11l7-5l7 5v10H9v-5H7v5H1Zm2-2h2v-5h6v5h2v-7L8 8.45L3 12v7Zm14-9Zm-6 9v-5H5v5v-5h6v5Z"/>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <p>{jobOfferTopMore?.work_mode}</p>
                        </div>
                    </div>

                    <div className="d-flex align-items-center">
                        <div className="rounded-3" style={{background: jobOfferTopColors?.background_color}}>
                            <svg className="not-hidden p-1" width="54" height="54" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path fill='none' stroke={`${jobOfferTopColors?.svg_color}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M402 168c-2.93 40.67-33.1 72-66 72s-63.12-31.32-66-72c-3-42.31 26.37-72 66-72s69 30.46 66 72Z"/>
                                <path fill='none' stroke={`${jobOfferTopColors?.svg_color}`} strokeMiterlimit="10" strokeWidth="32" d="M336 304c-65.17 0-127.84 32.37-143.54 95.41c-2.08 8.34 3.15 16.59 11.72 16.59h263.65c8.57 0 13.77-8.25 11.72-16.59C463.85 335.36 401.18 304 336 304Z"/>
                                <path fill='none' stroke={`${jobOfferTopColors?.svg_color}`} strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M200 185.94c-2.34 32.48-26.72 58.06-53 58.06s-50.7-25.57-53-58.06C91.61 152.15 115.34 128 147 128s55.39 24.77 53 57.94Z"/>
                                <path fill='none' stroke={`${jobOfferTopColors?.svg_color}`} strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" d="M206 306c-18.05-8.27-37.93-11.45-59-11.45c-52 0-102.1 25.85-114.65 76.2c-1.65 6.66 2.53 13.25 9.37 13.25H154"/>
                            </svg>
                        </div>
                        <div className="ms-2">
                            <p>{jobOfferTopMore?.vacancy}</p>
                        </div>
                    </div>
                    

                    
                </div>
                <hr></hr>
                <div className="pb-3">
                    <p>Specialization: <b>{jobOfferTopMore?.specialization}</b></p>
                </div>
            </>
                    }
            {editJobOfferTopMore &&
                <>
                <div className="col-12">
                    <form>
                        <div className='row my-2'>
                            <div className='mb-3 col-md-6'>
                                <label htmlFor='job_application_deadline' className='form-label'>Job Application Deadline:</label>
                                <input
                                    type='date' name='job_application_deadline'
                                    className={`form-control${renderFieldErrorMultiple('topmore', 0, 'job_application_deadline', multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='2023-12-31 23:59:59' value={jobOfferTopMore?.job_application_deadline  ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('topmore', 0, 'job_application_deadline', multipleErrors)}
                            </div>
                            <div className='mb-3 col-md-6'>
                                <label htmlFor='job_location' className='form-label'>Job Location:</label>
                                <input
                                    type='text' name='job_location'
                                    className={`form-control${renderFieldErrorMultiple('topmore', 0, 'job_location', multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Location' value={jobOfferTopMore?.job_location ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('topmore', 0, 'job_location', multipleErrors)}
                            </div>
                        </div>
                        <div className='row my-2'>
                            <div className='mb-3 col-md-4'>
                                <label htmlFor='work_schedule' className='form-label'>Work Schedule:</label>
                                <input
                                    type='text' name='work_schedule'
                                    className={`form-control${renderFieldErrorMultiple('topmore', 0, 'work_schedule', multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Full-time' value={jobOfferTopMore?.work_schedule ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('topmore', 0, 'work_schedule', multipleErrors)}
                            </div>
                            <div className='mb-3 col-md-4'>
                                <label htmlFor='recruitment_type' className='form-label'>Recruitment Type:</label>
                                <input
                                    type='text' name='recruitment_type'
                                    className={`form-control${renderFieldErrorMultiple('topmore', 0, 'recruitment_type', multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Online' value={jobOfferTopMore?.recruitment_type  ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('topmore', 0, 'recruitment_type', multipleErrors)}
                            </div>
                            <div className='mb-3 col-md-4'>
                                <label htmlFor='position_level' className='form-label'>Position Level:</label>
                                <input
                                    type='text' name='position_level'
                                    className={`form-control${renderFieldErrorMultiple('topmore', 0, 'position_level', multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Senior' value={jobOfferTopMore?.position_level ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('topmore', 0, 'position_level', multipleErrors)}
                            </div>
                        </div>
                        <div className='row my-2'>
                            <div className='mb-3 col-md-4'>
                                <label htmlFor='contract_type' className='form-label'>Contract Type:</label>
                                <input
                                    type='text' name='contract_type'
                                    className={`form-control${renderFieldErrorMultiple('topmore', 0, 'contract_type', multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Permanent' value={jobOfferTopMore?.contract_type ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('topmore', 0, 'contract_type', multipleErrors)}
                            </div>
                            <div className='mb-3 col-md-4'>
                                <label htmlFor='work_mode' className='form-label'>Work Mode:</label>
                                <input
                                    type='text' name='work_mode'
                                    className={`form-control${renderFieldErrorMultiple('topmore', 0, 'work_mode', multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Home office work' value={jobOfferTopMore?.work_mode  ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('topmore', 0, 'work_mode', multipleErrors)}
                            </div>
                            <div className='mb-3 col-md-4'>
                                <label htmlFor='vacancy' className='form-label'>Vacancy:</label>
                                <input
                                    type='text' name='vacancy'
                                    className={`form-control${renderFieldErrorMultiple('topmore', 0, 'vacancy', multipleErrors) ? ' is-invalid' : ''}`}
                                    placeholder='Many vacancies (4)' value={jobOfferTopMore?.vacancy ?? ''}
                                    onChange={handleInputChange}
                                />
                                {renderFieldErrorMultiple('topmore', 0, 'vacancy', multipleErrors)}
                            </div>
                            <div className="row my-2">
                                <div className='mb-3 col-md-12'>
                                    <label htmlFor='specialization' className='form-label'>Specialization:</label>
                                    <input
                                        type='text' name='specialization'
                                        className={`form-control${renderFieldErrorMultiple('topmore', 0, 'specialization', multipleErrors) ? ' is-invalid' : ''}`}
                                        placeholder='Backend' value={jobOfferTopMore?.specialization ?? ''}
                                        onChange={handleInputChange}
                                    />
                                    {renderFieldErrorMultiple('topmore', 0, 'specialization', multipleErrors)}
                                </div>
                            </div>
                        </div>
                    </form>
                    <div className='text-center mb-1'>
                        <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditJobOffer}>Cancel</button>
                        <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveEdit}>Save</button>
                    </div>
                </div>
                
                    
                    
            </>
            }
            
        </div>
    )
}
export default JobOfferTopMore;