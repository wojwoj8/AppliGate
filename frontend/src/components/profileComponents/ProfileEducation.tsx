import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { EducationData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';
import ProfileDeleteModal from './ProfileDeleteModal';
import { mdiPlus } from '@mdi/js';

interface ProfileEducationProps {
    education: EducationData[];
    singleEducation: EducationData | null;
    setSingleEducation: React.Dispatch<React.SetStateAction<EducationData | null>>;
    setEducation: React.Dispatch<React.SetStateAction<EducationData[]>>;
    editMultipleData: (
        state: EditMultipleDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: GetDataFunction, 
        endpoint: string, 
        errorField: string, 
        index: number,
        id: number | undefined
        ) => Promise<void>
    getData: (
        setData: GetDataFunction,
        endpoint: string,
        id?: number | undefined
        ) => void;
    setEditEducation: React.Dispatch<React.SetStateAction<boolean>>;
    editEducation: boolean;
    sendMultipleData:(
        state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: GetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>
    editMultipleEducations: boolean[];
    setEditMultipleEducations: React.Dispatch<React.SetStateAction<boolean[]>>;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
    deleteData: (
        editField: React.Dispatch<React.SetStateAction<boolean[]>>, 
        setData: GetDataFunction, 
        endpoint: string, 
        id: number
        ) => Promise<void>;
}

const ProfileEducation: React.FC<ProfileEducationProps> = ({
    education, setEducation, editEducation, getData,
    setEditEducation, editMultipleData, sendMultipleData,singleEducation, setSingleEducation,
    editMultipleEducations, setEditMultipleEducations, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, deleteData
}) =>{

    const editMultipleEducationsButton = async (index: number, id?: number) => {
        if (editMultipleEducations[index] === true){
           await cancelEditMultipleEducations(index, id)
           return
        }
        setEditMultipleEducations((prevEditEducations) => {
          const newEditEducations = [...prevEditEducations];
          newEditEducations[index] = !prevEditEducations[index];
          return newEditEducations;
        });
        
    }

    
    const cancelEditMultipleEducations = async (index: number, id?: number) => {
        setEditMultipleEducations((prevEditEducations) => {
          const newEditEducations = [...prevEditEducations];
          newEditEducations[index] = false;
          return newEditEducations;
        });
        removeMultipleErrors('education', index)
        await getData(setEducation, '/profile/education');

      };

    const editEducationButton = () =>{
        setEditEducation(!editEducation);
        if(editEducation === true){
            removeMultipleErrors('addeducation', 0)
            setSingleEducation(null)
            getData(setEducation, '/profile/education');
        }
        
    }
    const cancelEditEducation = async () =>{
        setEditEducation(false);
        removeMultipleErrors('addeducation', 0)
        // await getEducationData();
        setSingleEducation(null)
    }

    const saveEdit = async (index: number, id?: number) =>{

        editMultipleData(education, setEditMultipleEducations, setEducation, 
            '/profile/education', 'education', index, id)
        // setEditPersonal(false);
    }

    const resetEducation = () => {
        setSingleEducation(null);
      };

    const saveEducation = () => {
        sendMultipleData(singleEducation, setEditEducation, setEducation, 
            resetEducation, '/profile/education', 'addeducation');
    }

    const deleteEducation = (id: number) => {
        deleteData(setEditMultipleEducations, setEducation, '/profile/education', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleEducation((prevEducation) => ({
        ...prevEducation!,
        [name]: value,
        }));
    
  
        
      };
    const handleEducationInputChange = (
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
    
        setEducation((prevEducation) => {
        const updatedEducations = [...prevEducation];
        updatedEducations[index] = {
            ...updatedEducations[index],
            ...updatedProperty, 
        };
        return updatedEducations;
        });
    };
    return(
        <div>
            
                
            <div className='bg-dark row'>
                <p className='fs-3 fw-semibold text-white col mb-1'>Education</p>
                    <div className='col-auto'>
                        <div className='profile-svgs d-flex my-1' onClick={editEducationButton}>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    {!education[0] && !editEducation &&
                    <div className='container'> 
                        <p className='text-secondary my-4'>
                        By sharing your educational background, you're increasing your 
                        chances of discovering the perfect job fit.
                        </p>
                    </div>
                    
                    }
                    {editEducation && (
                        <div className='container'>
                            <form>
                            <div className='row my-2'>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor={`school`} className='form-label'>
                                    School Name:
                                </label>
                                <input
                                    type='text'
                                    name={`school`}
                                    className={`form-control${renderFieldErrorMultiple('addeducation', 0, `school`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleEducation?.school || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='School Name'
                                />
                                {renderFieldErrorMultiple('addeducation', 0, `school`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor={`educational_level`} className='form-label'>
                                    Educational Level:
                                </label>
                                <input
                                    type='text'
                                    name={`educational_level`}
                                    className={`form-control${renderFieldErrorMultiple('addeducation', 0, `educational_level`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleEducation?.educational_level || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Educational Level'
                                />
                                {renderFieldErrorMultiple('addeducation', 0, `educational_level`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor={`major`} className='form-label'>
                                    Major:
                                </label>
                                <input
                                    type='text'
                                    name={`major`}
                                    className={`form-control${renderFieldErrorMultiple('addeducation', 0, `major`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleEducation?.major || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Major'
                                />
                                {renderFieldErrorMultiple('addeducation', 0, `major`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor={`specialization`} className='form-label'>
                                    Specialization:
                                </label>
                                <input
                                    type="text"
                                    name={`specialization`}
                                    className={`form-control${renderFieldErrorMultiple('addeducation', 0, `specialization`, multipleErrors) ? ' is-invalid' : ''}`}
                                    value={singleEducation?.specialization || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Specialization'
                                />
                                {renderFieldErrorMultiple('addeducation', 0, `specialization`, multipleErrors)}
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor={`from_date`} className='form-label'>
                                        From:
                                    </label>
                                    <input 
                                        type="month" 
                                        name={`from_date`}
                                        className={`form-control${renderFieldErrorMultiple('addeducation', 0, `from_date`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleEducation?.from_date || ''}
                                        onChange={handleSingleInputChange}                     
                                    />
                                    {renderFieldErrorMultiple('addeducation', 0, `from_date`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor={`to_date`} className='form-label'>
                                        To:
                                    </label>
                                    <input 
                                        type="month" 
                                        name={`to_date`}
                                        className={`form-control${renderFieldErrorMultiple('addeducation', 0, `to_date`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleEducation?.to_date || ''}
                                        onChange={handleSingleInputChange}
                                    />
                                    {renderFieldErrorMultiple('addeducation', 0, `to_date`, multipleErrors)}
                                </div>
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditEducation}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={saveEducation}>
                                Save
                            </button>
                            </div>
                            {education && education[0] && <hr className="border border-primary border-3 my-1"></hr>}
                        </div>
                        )}
                {education.map((education, index) => (
                    <div key={index} className='text-center row'>
                        {index >= 1 && <div className="container"><hr className="border border-primary border-3 my-1"></hr></div>}
                        
                        {!editMultipleEducations[index] && (
                        <>
                            <div className='col row text-start'>
                                <div className='col-md-6'>
                                <h2 className='mb-1 text-primary fs-3'>
                                    {education?.school || ''}
                                    </h2>
                                    {education?.from_date && !education?.to_date && <p>From: {education?.from_date}</p>} 
                                    {education?.from_date && education?.to_date && <p>{education?.from_date} - {education?.to_date}</p>} 
                                    {!education?.from_date && education?.to_date && <p>To: {education?.to_date}</p>}  
                                </div>
                                <div className='col-md-6'>
                                    <p><i><b>{education?.major || ''}</b>, {education?.specialization || ''}</i></p>
                                    <p></p>
                                    <p> {education?.educational_level || ''}</p>
                                </div>
                            </div>
                            <div className='col-auto'>
                            <div className='profile-svgs d-flex my-1' onClick={() => editMultipleEducationsButton(index, education.id)}>
                                <Icon className='text-black' path={mdiPencil} size={1} />
                            </div>
                            <ProfileDeleteModal id={`${education.school}_${education.id}`} onDelete={() => deleteEducation(education.id)} />
                        </div>
                        </>
                        )}
                        
                        {editMultipleEducations[index] && (
                        <div className='container'>
                            <form>
                                <div className='row my-2'>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`school_${index}`} className='form-label'>
                                        School Name:
                                    </label>
                                    <input
                                        type='text'
                                        name={`school_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `school_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.school || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                        placeholder='School Name'
                                    />
                                    {renderFieldErrorMultiple('education', index, `school_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`educational_level_${index}`} className='form-label'>
                                        Educational Level:
                                    </label>
                                    <input
                                        type='text'
                                        name={`educational_level_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `educational_level_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.educational_level || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                        placeholder='Educational Level'
                                    />
                                    {renderFieldErrorMultiple('education', index, `educational_level_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`major_${index}`} className='form-label'>
                                        Major:
                                    </label>
                                    <input
                                        type='text'
                                        name={`major_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `major_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.major || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                        placeholder='Major'
                                    />
                                    {renderFieldErrorMultiple('education', index, `major_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`specialization_${index}`} className='form-label'>
                                        Specialization:
                                    </label>
                                    <input
                                        type='text'
                                        name={`specialization_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `specialization_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.specialization || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                        placeholder='Specialization'
                                    />
                                    {renderFieldErrorMultiple('education', index, `specialization_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`from_date_${index}`} className='form-label'>
                                        From:
                                    </label>
                                    <input
                                        type='month'
                                        name={`from_date_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `from_date_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.from_date || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                    />
                                    {renderFieldErrorMultiple('education', index, `from_date_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`to_date_${index}`} className='form-label'>
                                        To:
                                    </label>
                                    <input
                                        type='month'
                                        name={`to_date_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('education', index, `to_date_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={education?.to_date || ''}
                                        onChange={(e) => handleEducationInputChange(index, e)}
                                    />
                                    {renderFieldErrorMultiple('education', index, `to_date_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={() => cancelEditMultipleEducations(index, education.id)}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={() => saveEdit(index, education.id)}>
                                Save
                            </button>
                            </div>
                            
                        </div>
                        
                        )}
                        
                    </div>
                    ))}
                
        </div>
    )
}
export default ProfileEducation