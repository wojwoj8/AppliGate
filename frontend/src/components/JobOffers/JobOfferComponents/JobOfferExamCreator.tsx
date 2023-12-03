import React from 'react';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';
import { mdiPencil } from '@mdi/js';

interface JobOfferExamCreatorProps {
    setGlobalAlertError: (error: string) => void
}

const JobOfferExamCreator: React.FC<JobOfferExamCreatorProps> = ({
    setGlobalAlertError
}) =>{

    
    return(
        <div className={`pb-1)  && 'prevHidden'}`}>
            
            <div className="container shadow-lg bg-body-bg rounded-2 text-break mt-4 z-1">
                <div className='bg-black row mb-0 rounded-top-2'>
                        <p className='fs-3 fw-semibold text-white col mb-1'>Exam</p>
                        <div className='col-auto d-flex align-items-center'>
                            <div className='profile-svgs d-flex my-1'>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    
            
            </div>
        </div>
    )
}
export default JobOfferExamCreator;