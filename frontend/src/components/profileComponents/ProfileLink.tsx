import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { LinkData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';

const ProfileLink = () =>{

    return(
        <div className="container ">
            <div className='border border-1 border-danger'>
                <div className="container">
                    <div className='text-center bg-info-subtle row'>
                        <p className='fs-4 fw-semibold text-info col'>Links</p>
                        <div className='col-auto'>
                            <button className='btn btn btn-outline-secondary btn-sm'>
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ProfileLink