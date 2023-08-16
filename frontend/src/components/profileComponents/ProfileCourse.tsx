import React from 'react';
import Icon from '@mdi/react';
import { mdiPencil } from '@mdi/js';
import { CourseData } from '../Profile';
import { MultipleErrorResponse } from '../Profile';
import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { EditMultipleDataFunction } from '../Profile';
import ProfileDeleteModal from './ProfileDeleteModal';
import { mdiPlus } from '@mdi/js';

interface ProfileCourseProps {
    course: CourseData[];
    singleCourse: CourseData | null;
    setSingleCourse: React.Dispatch<React.SetStateAction<CourseData | null>>;
    setCourse: React.Dispatch<React.SetStateAction<CourseData[]>>;
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
    setEditCourse: React.Dispatch<React.SetStateAction<boolean>>;
    editCourse: boolean;
    sendMultipleData:(
        state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>>, 
        setData: GetDataFunction, 
        cleanState: (() => void),
        endpoint: string, 
        errorField: string, 
        index?: number
        ) => Promise<void>
    editMultipleCourses: boolean[];
    setEditMultipleCourses: React.Dispatch<React.SetStateAction<boolean[]>>;
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

const ProfileCourse: React.FC<ProfileCourseProps> = ({
    course, setCourse, editCourse, getData,
    setEditCourse, editMultipleData, sendMultipleData,singleCourse, setSingleCourse,
    editMultipleCourses, setEditMultipleCourses, multipleErrors,
    removeMultipleErrors, renderFieldErrorMultiple, deleteData
}) =>{

    const editMultipleCoursesButton = async (index: number, id?: number) => {
        if (editMultipleCourses[index] === true){
           await cancelEditMultipleCourses(index, id)
           return
        }
        setEditMultipleCourses((prevEditCourses) => {
          const newEditCourses = [...prevEditCourses];
          newEditCourses[index] = !prevEditCourses[index];
          return newEditCourses;
        });
        
    }

    
    const cancelEditMultipleCourses = async (index: number, id?: number) => {
        setEditMultipleCourses((prevEditCourses) => {
          const newEditCourses = [...prevEditCourses];
          newEditCourses[index] = false;
          return newEditCourses;
        });
        removeMultipleErrors('course', index)
        await getData(setCourse, '/profile/course');

      };

    const editCourseButton = () =>{
        setEditCourse(!editCourse);
        if(editCourse === true){
            removeMultipleErrors('addcourse', 0)
            setSingleCourse(null)
            getData(setCourse, '/profile/course');
        }
        
    }
    const cancelEditCourse = async () =>{
        setEditCourse(false);
        removeMultipleErrors('addcourse', 0)
        // await getCourseData();
        setSingleCourse(null)
    }

    const saveEdit = async (index: number, id?: number) =>{

        editMultipleData(course, setEditMultipleCourses, setCourse, 
            '/profile/course', 'course', index, id)
        // setEditPersonal(false);
    }

    const resetCourse = () => {
        setSingleCourse(null);
      };

    const saveCourse = () => {
        sendMultipleData(singleCourse, setEditCourse, setCourse, 
            resetCourse, '/profile/course', 'addcourse');
    }

    const deleteCourse = (id: number) => {
        deleteData(setEditMultipleCourses, setCourse, '/profile/course', id);
    }

    const handleSingleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        const { name, value } = event.target;
      
        
      

        setSingleCourse((prevCourse) => ({
        ...prevCourse!,
        [name]: value,
        }));
    
  
        
      };
    const handleCourseInputChange = (
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
    
        setCourse((prevCourse) => {
        const updatedCourses = [...prevCourse];
        updatedCourses[index] = {
            ...updatedCourses[index],
            ...updatedProperty, 
        };
        return updatedCourses;
        });
    };
    return(
        <div>
            
                
            <div className='bg-black row mb-1 mb-1'>
                <p className='fs-3 fw-semibold text-white col mb-1'>Courses, training, certificates</p>
                    <div className='col-auto d-flex align-items-center'>
                        <div className='profile-svgs d-flex my-1' onClick={editCourseButton}>
                                <Icon className='text-white' path={mdiPlus} size={1.25} />
                            </div>
                        </div>
                    </div>
                    {!course[0] && !editCourse &&
                    <div className='container'> 
                        <p className=' my-4'>
                        Here, you can list all the courses you've taken, 
                        training you've undergone, and certificates you've earned.
                        </p>
                    </div>
                    
                    }
                    {editCourse && (
                        <div className=''>
                            <form>
                            <div className='row my-2'>
                                <div className='mb-3 col-md-6'>
                                <label htmlFor={`course_name`} className='form-label'>
                                    Name:
                                </label>
                                <input
                                    type='text'
                                    name={`course_name`}
                                    className={`form-control${renderFieldErrorMultiple('addcourse', 0, `course_name`, multipleErrors) ? ' is-invalid' : ''}`} 
                                    value={singleCourse?.course_name || ''}
                                    onChange={handleSingleInputChange}
                                    placeholder='Name'
                                />
                                {renderFieldErrorMultiple('addcourse', 0, `course_name`, multipleErrors)}
                                </div>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`organizer`} className='form-label'>
                                        Organizer:
                                    </label>
                                    <input
                                        type='text'
                                        name={`organizer`}
                                        className={`form-control${renderFieldErrorMultiple('addcourse', 0, `organizer`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleCourse?.organizer || ''}
                                        onChange={handleSingleInputChange}
                                        placeholder='Organizer'
                                    />
                                    {renderFieldErrorMultiple('addcourse', 0, `organizer`, multipleErrors)}
                                </div>
                            </div>
                            <div className='row'>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor={`finish_date`} className='form-label'>
                                        Finish:
                                    </label>
                                    <input 
                                        type="month" 
                                        name={`finish_date`}
                                        className={`form-control${renderFieldErrorMultiple('addcourse', 0, `finish_date`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleCourse?.finish_date || ''}
                                        onChange={handleSingleInputChange}                     
                                    />
                                    {renderFieldErrorMultiple('addcourse', 0, `finish_date`, multipleErrors)}
                                </div>
                                <div className='mb-3 col-md-6'>
                                    <label htmlFor={`certificate_link`} className='form-label'>
                                        Link:
                                    </label>
                                    <input
                                        type='text'
                                        name={`certificate_link`}
                                        className={`form-control${renderFieldErrorMultiple('addcourse', 0, `certificate_link`, multipleErrors) ? ' is-invalid' : ''}`} 
                                        value={singleCourse?.certificate_link || ''}
                                        onChange={handleSingleInputChange}
                                        placeholder='Link'
                                    />
                                    {renderFieldErrorMultiple('addcourse', 0, `certificate_link`, multipleErrors)}
                                </div>
                            </div>
                            </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={cancelEditCourse}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={saveCourse}>
                                Save
                            </button>
                            </div>
                            {course && course[0] && <hr className="border border-primary border-3 my-1"></hr>}
                        </div>
                        )}
                {course.map((course, index) => (
                    <div key={index} className='row'>
                        {index >= 1 && <div className="container"><hr className="border border-primary border-3 my-1"></hr></div>}
                        
                        {!editMultipleCourses[index] && (
                        <>
                            <div className='col text-start row'>
                                
                                <div className='d-sm-flex gap-4 align-items-center col-md-6'>
                                    <p className='fw-bold'>{course?.finish_date}</p>
                                </div>
                                <div className='col-md-6'>
                                    <span className='fw-bold'>{course?.organizer || ''}:</span>
                                    {course?.course_name && course?.certificate_link ? (
                                        <p className='fw-medium'><a target='_blank' href={course?.certificate_link} rel="noreferrer">{course?.course_name}</a></p>
                                    ) : (
                                        <p>{course?.course_name}</p>
                                    )}
                            </div>
                                
                                

                                
                            </div>
                            <div className='col-auto'>
                            <div className='profile-svgs d-flex my-1' onClick={() => editMultipleCoursesButton(index, course.id)}>
                                <Icon path={mdiPencil} size={1} />
                            </div>
                            <ProfileDeleteModal id={`${course.course_name}_${course.id}`} onDelete={() => deleteCourse(course.id)} />
                        </div>
                        </>
                        )}
                        
                        {editMultipleCourses[index] && (
                        <div className='container'>
                            <form>
                                <div className='row my-2'>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`course_name_${index}`} className='form-label'>
                                        Name:
                                    </label>
                                    <input
                                        type='text'
                                        name={`course_name_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('course', index, `course_name_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={course?.course_name || ''}
                                        onChange={(e) => handleCourseInputChange(index, e)}
                                        placeholder='Name'
                                    />
                                    {renderFieldErrorMultiple('course', index, `course_name_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-md-6'>
                                        <label htmlFor={`organizer_${index}`} className='form-label'>
                                        Organizer:
                                        </label>
                                        <input
                                            type='text'
                                            name={`organizer_${index}`}
                                            className={`form-control${renderFieldErrorMultiple('course', index, `organizer_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                            value={course?.organizer || ''}
                                            onChange={(e) => handleCourseInputChange(index, e)}
                                            placeholder='Organizer'
                                        />
                                        {renderFieldErrorMultiple('course', index, `organizer_${index}`, multipleErrors)}
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='mb-3 col-md-6'>
                                    <label htmlFor={`finish_date_${index}`} className='form-label'>
                                        Finish:
                                    </label>
                                    <input
                                        type='month'
                                        name={`finish_date_${index}`}
                                        className={`form-control${renderFieldErrorMultiple('course', index, `finish_date_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                        value={course?.finish_date || ''}
                                        onChange={(e) => handleCourseInputChange(index, e)}
                                    />
                                    {renderFieldErrorMultiple('course', index, `finish_date_${index}`, multipleErrors)}
                                    </div>
                                    <div className='mb-3 col-md-6'>
                                        <label htmlFor={`certificate_link_${index}`} className='form-label'>
                                            Link:
                                        </label>
                                        <input
                                            type='text'
                                            name={`certificate_link_${index}`}
                                            className={`form-control${renderFieldErrorMultiple('course', index, `certificate_link_${index}`, multipleErrors) ? ' is-invalid' : ''}`}
                                            value={course?.certificate_link || ''}
                                            onChange={(e) => handleCourseInputChange(index, e)}
                                            placeholder='Link'
                                        />
                                        {renderFieldErrorMultiple('course', index, `certificate_link_${index}`, multipleErrors)}
                                        </div>
                                </div>
                                </form>
                            <div className='text-center'>
                            <button className='btn btn-secondary' onClick={() => cancelEditMultipleCourses(index, course.id)}>
                                Cancel
                            </button>
                            <button className='btn btn-primary' onClick={() => saveEdit(index, course.id)}>
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
export default ProfileCourse;