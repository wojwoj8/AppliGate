import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { ProfileData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { SummaryData } from '../Profile';


interface ProfileAboutProps {
    summary: SummaryData | null;
    setSummary: React.Dispatch<React.SetStateAction<SummaryData | null>>;
    // handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    editData: (state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    getData: (
        setData: GetDataFunction,
        endpoint: string
        ) => void;
    setEditSummary: React.Dispatch<React.SetStateAction<boolean>>;
    editSummary: boolean;
    multipleErrors: MultipleErrorResponse;
    removeMultipleErrors: (key: string, index: number) => void;
    renderFieldErrorMultiple: (field: string, index: number, errorKey: string, error: MultipleErrorResponse | undefined) => React.ReactNode;
  }

const ProfileSummary: React.FC<ProfileAboutProps> = ({ 
        summary, setEditSummary, editSummary, getData, editData,
        multipleErrors, removeMultipleErrors, renderFieldErrorMultiple,
    setSummary}) => {


        const handleInputChange = (
            event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
            // setData: GetDataFunction,
          ) => {
            const { name, value } = event.target;

            setSummary((prevAbout) => ({
            ...prevAbout!,
            [name]: value,
            }));
    
          };
    
    
        const editAboutSection = () =>{
            setEditSummary(!editSummary);
            if(editSummary === true){
                removeMultipleErrors('summary', 0)
                getData(setSummary, '/profile/summary');
            }
            
        }
        const cancelEditProfile = () =>{
            setEditSummary(false);
            removeMultipleErrors('summary', 0)
            getData(setSummary, '/profile/summary');
        }
    
        const saveEdit = async () =>{
            await editData(summary, setEditSummary, '/profile/summary', 'summary')
            // setEditSummary(false);
        }

    return(
        <div className={`${!summary?.professional_summary && 'prevHidden'}`}>
            <div className='bg-black row mb-1 '>
                <p className='fs-3 fw-semibold text-white col mb-1'>Professional Summary</p>
                <div className='col-auto d-flex align-items-center'>
                    <div className='profile-svgs d-flex my-1' onClick={editAboutSection}>
                        <Icon className='text-white' path={mdiPencil} size={1.25} />
                    </div>
                </div>
            </div>
            {!summary?.professional_summary && !editSummary &&
            <div className='container'> 
                <p className='my-4'>
                Your professional summary is crucial. Highlight your skills, background, and ambitions to boost your job prospects.
                </p>
            </div>
            
            }
            
            {!editSummary && summary?.professional_summary &&
            <div className='text-center row my-3'>
                <div className='text-start'>
                    {summary?.professional_summary && <p>{summary?.professional_summary}</p>}
                </div>
            </div>
            }
                
      
            {editSummary &&  
                <div className="">
                    <form>
                        <div className='row my-2'>
                            <div className='mb-3 col'>
                                <label htmlFor='professional_summary' className="form-label">Summary:</label>
                                <textarea
                                    name='professional_summary' 
                                    className={`form-control${renderFieldErrorMultiple('summary', 0, `professional_summary`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={summary?.professional_summary || ''} 
                                    onChange={handleInputChange}>
                                </textarea>
                                {renderFieldErrorMultiple('summary', 0, `professional_summary`, multipleErrors)}
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
export default ProfileSummary;