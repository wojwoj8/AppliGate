import React, { useState, useEffect, useContext } from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ProfileData } from '../Profile';
import { ErrorResponse } from '../Profile';
import { ExperienceData } from '../Profile';

interface ProfileExperienceProps {
    experience: ExperienceData[];
    singleExperience: ExperienceData | null;
    setSingleExperience: React.Dispatch<React.SetStateAction<ExperienceData | null>>;
    setExperience: React.Dispatch<React.SetStateAction<ExperienceData[]>>;
    
    editExperienceData: () => void;
    getExperienceData: () => void;
    err: ErrorResponse | undefined;
    setErr: React.Dispatch<React.SetStateAction<ErrorResponse | undefined>>;
    setEditExperience: React.Dispatch<React.SetStateAction<boolean>>;
    editExperience: boolean;
    renderFieldError: (field: string, error: ErrorResponse | undefined) => React.ReactNode;
    sendExperienceData: () => void;

}

const ProfileExperience: React.FC<ProfileExperienceProps> = ({
    experience, setExperience, editExperience, getExperienceData,
    err, setErr, setEditExperience, editExperienceData,
    renderFieldError, sendExperienceData,singleExperience, setSingleExperience,
}) =>{

    const editExperienceButton = () =>{
        setEditExperience(!editExperience);
        if(editExperience === true){
            getExperienceData();
        }
        
    }
    const cancelEditExperience = () =>{
        setEditExperience(false);
        setErr({})
        getExperienceData();
    }

    const saveEdit = async (index: number) =>{
        await editExperienceData()
        // setEditPersonal(false);
    }
    const saveExperience = async () =>{
        await sendExperienceData();
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleExperience((prevExperience) => ({
        ...prevExperience!,
        [name]: value,
        }));
    
  
        
      };
    const handleExperienceInputChange = (
        index: number,
        event: React.ChangeEvent<HTMLInputElement>,
        
    ) => {
        let { name, value } = event.target;
        name = name.substring(0, name.lastIndexOf('_'));
        console.log(value)
        // Create an object with the new property and value
        const updatedProperty = {
        [name]: value,
        };
    
        setExperience((prevExperience) => {
        const updatedExperiences = [...prevExperience];
        // console.log(updatedExperiences)
        // console.log(...prevExperience)
        // console.log(updatedExperiences[index])
        console.log(updatedProperty)
        updatedExperiences[index] = {
            ...updatedExperiences[index],
            ...updatedProperty, // Spread the new property and value into the existing object
        };
        console.log(typeof(updatedExperiences))
        return updatedExperiences; // Return the updated state
        });
    };
    //   console.log(typeof(experience))
    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Experience</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm' onClick={editExperienceButton}>
                                Add experience
                            </button>
                        </div>
                    </div>
                    {editExperience && (
                        <div className='container'>
                            <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`position`} className='form-label'>
                                    Position:
                                </label>
                                <input
                                    type='text'
                                    name={`position`}
                                    className={`form-control ${err && err.position && ' is-invalid'}`}
                                    value={singleExperience?.position || ''}
                                    onChange={handleSingleInputChange}
                                />
                                {renderFieldError(`position`, err)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`localization`} className='form-label'>
                                    Localization:
                                </label>
                                <input
                                    type='text'
                                    name={`localization`}
                                    className={`form-control ${err && err.localization && ' is-invalid'}`}
                                    value={singleExperience?.localization || ''}
                                    onChange={handleSingleInputChange}
                                />
                                {renderFieldError(`localization`, err)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`company`} className='form-label'>
                                    Company:
                                </label>
                                <input
                                    type='text'
                                    name={`company`}
                                    className={`form-control ${err && err.company && ' is-invalid'}`}
                                    value={singleExperience?.company || ''}
                                    onChange={handleSingleInputChange}
                                />
                                {renderFieldError(`company`, err)}
                                </div>
                            </div>

                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`responsibilities`} className='form-label'>
                                    Responsibilities:
                                </label>
                                <input
                                    type='text'
                                    name={`responsibilities`}
                                    className={`form-control ${err && err.responsibilities && ' is-invalid'}`}
                                    value={singleExperience?.responsibilities || ''}
                                    onChange={handleSingleInputChange}
                                />
                                {renderFieldError(`responsibilities`, err)}
                                </div>
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditExperience}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={saveExperience}>
                                Save
                            </button>
                            </div>
                        </div>
                        )}
                {/* {experience.map((experience, index) => (
                    <div key={index} className='text-center row'>
                        {!editExperience && (
                        <div className='col-auto col-md-8 col-sm-6 text-start'>
                            <h2 className='mb-1 text-primary fs-1'>
                            {experience?.position || ''} {experience?.localization || ''}
                            </h2>
                            <p>{experience?.company || ''}</p>
                            <p>{experience?.responsibilities || ''}</p>
                        </div>
                        )}

                        {editExperience && (
                        <div className='container'>
                            <form>
                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`position_${index}`} className='form-label'>
                                    Position:
                                </label>
                                <input
                                    type='text'
                                    name={`position_${index}`}
                                    className={`form-control ${err && err.position && ' is-invalid'}`}
                                    value={experience?.position || ''}
                                    onChange={(e) => handleExperienceInputChange(index, e)}
                                />
                                {renderFieldError(`position_${index}`, err)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`localization_${index}`} className='form-label'>
                                    Localization:
                                </label>
                                <input
                                    type='text'
                                    name={`localization_${index}`}
                                    className={`form-control ${err && err.localization && ' is-invalid'}`}
                                    value={experience?.localization || ''}
                                    onChange={(e) => handleExperienceInputChange(index, e)}
                                />
                                {renderFieldError(`localization_${index}`, err)}
                                </div>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`company_${index}`} className='form-label'>
                                    Company:
                                </label>
                                <input
                                    type='text'
                                    name={`company_${index}`}
                                    className={`form-control ${err && err.company && ' is-invalid'}`}
                                    value={experience?.company || ''}
                                    onChange={(e) => handleExperienceInputChange(index, e)}
                                />
                                {renderFieldError(`company_${index}`, err)}
                                </div>
                            </div>

                            <div className='row'>
                                <div className='mb-3 col-4'>
                                <label htmlFor={`responsibilities_${index}`} className='form-label'>
                                    Responsibilities:
                                </label>
                                <input
                                    type='text'
                                    name={`responsibilities_${index}`}
                                    className={`form-control ${err && err.responsibilities && ' is-invalid'}`}
                                    value={experience?.responsibilities || ''}
                                    onChange={(e) => handleExperienceInputChange(index, e)}
                                />
                                {renderFieldError(`responsibilities_${index}`, err)}
                                </div>
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditExperience}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={() => saveExperience(index)}>
                                Save
                            </button>
                            </div>
                        </div>
                        )}
                    </div>
                    ))} */}
            </div>
        </div>
        </div>
    )
}

export default ProfileExperience