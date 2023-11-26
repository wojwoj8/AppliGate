import { GetCompanyDataFunction } from "../ProfileCompany";
import { EditCompanyDataFunction } from "../ProfileCompany";
import { ProfileStatusData } from "../ProfileCompany";
import DeleteModal from "../../DeleteModal";


interface ProfileCompanyStatusInterface{
    profileStatus: ProfileStatusData | null;
    setProfileStatus: React.Dispatch<React.SetStateAction<ProfileStatusData | null>>;
    getData: (
        setData: GetCompanyDataFunction,
        endpoint: string
        ) => void;
    editData: (state: EditCompanyDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>> | undefined, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    alertError: string;
    setAlertError: React.Dispatch<React.SetStateAction<string>>
}

const ProfileCompanyStatus: React.FC<ProfileCompanyStatusInterface> = ({profileStatus, setProfileStatus, getData, 
    editData, alertError, setAlertError}) => {
    
        const changeProfileStatus = async () => {
            const updatedProfileStatus = {
              ...profileStatus!,
              public_profile: !profileStatus?.public_profile,
            };
        
            await setProfileStatus(updatedProfileStatus);
        
            if (updatedProfileStatus.public_profile === false) {
              setAlertError('Profile Changed to Private, nobody can see your profile and your Job Offers success');
            } else {
              setAlertError('Profile Changed to Public, now everone can see your profile and your Job Offers! Copy profile link and share it success');
            }
        
            editData(updatedProfileStatus, undefined, '/profile/profileStatus', 'profileStatus');
          };

    return(
        <div className='container prevHidden'>
            {profileStatus && profileStatus?.public_profile === true ? (
                <div className='btn btn-danger w-100 rounded-4 mt-3 btn-block'>
                    <DeleteModal id={`1`} 
                    name={'Set Profile to Private'} 
                    message={'Do you want to change your profile status to Private? Your posted job offers will no longer be visible.'} 
                    deleteName = {'Change'}
                    title="Change Profile Status"
                    onDelete={changeProfileStatus} />
                
                
                </div>) : 
            (
                <div className='btn btn-danger w-100 rounded-4 mt-3'>
                    <DeleteModal id={`2`} 
                    name={'Set Profile to Public'} 
                    message={'Do you want to change your profile status to Public? Your posted job offers and profile will be visible for everyone.'} 
                    deleteName = {'Change'}
                    title="Change Profile Status"
                    onDelete={changeProfileStatus} />
                </div>
            ) }
            
        </div>
    )
}
export default ProfileCompanyStatus;