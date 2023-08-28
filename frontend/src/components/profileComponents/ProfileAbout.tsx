import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { AboutData } from '../Profile';


interface ProfileAboutProps {
    about: AboutData | null;
    setAbout: React.Dispatch<React.SetStateAction<AboutData | null>>;
    editData: (state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    getData: (
        setData: GetDataFunction,
        endpoint: string
        ) => void;
    setEditAbout: React.Dispatch<React.SetStateAction<boolean>>;
    editAbout: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
  }

const ProfileAbout: React.FC<ProfileAboutProps> = ({ 
        about, setEditAbout, editAbout, getData, editData,
        multipleErrors, removeMultipleErrors, renderFieldErrorMultiple,
    setAbout}) => {


        const handleInputChange = (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => {
            const { name, value } = event.target;

            setAbout((prevAbout) => ({
            ...prevAbout!,
            [name]: value,
            }));
    
          };
    
    
        const editAboutSection = () =>{
            setEditAbout(!editAbout);
            if(editAbout === true){
                removeMultipleErrors('about', 0)
                getData(setAbout, '/profile/about');
            }
            
        }
        const cancelEditProfile = () =>{
            setEditAbout(false);
            removeMultipleErrors('about', 0)
            getData(setAbout, '/profile/about');
        }
    
        const saveEdit = async () =>{
            await editData(about, setEditAbout, '/profile/about', 'about')
        }

    return(
        <div className={`${!about?.about_me && 'prevHidden'}`}>
            
                
                <div className='bg-black row mb-1 '>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Hobby</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1' onClick={editAboutSection}>
                                <Icon className='text-white' path={mdiPencil} size={1.25} />
                            </div>
                        </div>
                    </div>
                    {!about?.about_me && !editAbout &&
                    <div className='container'> 
                        <p className=' my-4'>
                        Show your passion, hobby to your future employers.
                        </p>
                    </div>
                    
                    }
                   
                    {!editAbout && about?.about_me &&
                     <div className='text-center row my-3'>
                        <div className='col-auto text-start'>
                            {about?.about_me && <p>{about?.about_me}</p>}
                        </div>
                    </div> 
                }
                   
                {editAbout &&  
                    <div className="">
                        <form>
                            <div className='row my-2'>
                                <div className='mb-3 col'>
                                    <label htmlFor='about_me' className="form-label">Hobby:</label>
                                    <textarea
                                        name='about_me' 
                                        className={`form-control${renderFieldErrorMultiple('about', 0, `about_me`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={about?.about_me || ''} 
                                        onChange={handleInputChange}>
                                    </textarea>
                                    {renderFieldErrorMultiple('about', 0, `about_me`, multipleErrors)}
                                </div>
                            </div>
                        </form>
                        <div className='text-center mb-1'>
                            <button className='btn btn-secondary me-2' style={{width:'5rem'}} onClick={cancelEditProfile}>Cancel</button>
                            <button className='btn btn-primary' style={{width:'5rem'}} onClick={saveEdit}>Save</button>
                        </div>
                        
                    </div>
                    
                    
                }
                
        </div>
    )
}
export default ProfileAbout;