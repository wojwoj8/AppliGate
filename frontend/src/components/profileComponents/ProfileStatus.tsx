import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { ProfileStatusData } from '../Profile';
import DeleteModal from '../DeleteModal';

interface ProfileContactProps{
    profileStatus: ProfileStatusData | null;
    setProfileStatus: React.Dispatch<React.SetStateAction<ProfileStatusData | null>>;
    getData: (
        setData: GetDataFunction,
        endpoint: string
        ) => void;
    editData: (state: EditDataFunction, 
        editField: React.Dispatch<React.SetStateAction<boolean>> | undefined, 
        endpoint: string, errorField: string, index?: number
        ) => Promise<void>;
    alertError: string;
    setAlertError: React.Dispatch<React.SetStateAction<string>>
}

const ProfileStatus: React.FC<ProfileContactProps> = ({profileStatus, setProfileStatus, getData, 
    editData, alertError, setAlertError}) => {
    
        const changeProfileStatus = async () => {
            const updatedProfileStatus = {
              ...profileStatus!,
              public_profile: !profileStatus?.public_profile,
            };
        
            await setProfileStatus(updatedProfileStatus);
        
            if (updatedProfileStatus.public_profile === false) {
              setAlertError('Your profile has been set to private. This means that your CV is no longer visible, except to companies you have applied to info');
            } else {
              setAlertError('Profile Changed to Public, now everone can see your CV! Copy profile link and share it success');
            }
        
            editData(updatedProfileStatus, undefined, '/profile/profileStatus', 'profileStatus');
          };

    return(
        <div className='container prevHidden'>
            {profileStatus && profileStatus?.public_profile === true ? (
                
                    <div className='btn btn-danger w-100 rounded-4 mt-2 btn-block'>
                            <DeleteModal id={`1`} 
                            name={'Hide Profile'} 
                            message={'Would you prefer to keep your profile private? Once hidden, your CV will no longer be visible, except to companies you have applied to.'} 
                            deleteName = {'Hide'}
                            title="Hide Profile"
                            onDelete={changeProfileStatus} />
                        </div>  
                ) : 
            (
                <div className='btn btn-danger w-100 rounded-4 mt-2 btn-block'>
                            <DeleteModal id={`1`} 
                            name={'Public Profile'} 
                            message={'Are you ready to make your profile public? Once updated, your profile will be visible to everyone, and other users will have the opportunity to view your information.'} 
                            deleteName = {'Public Profile'}
                            title="Public Profile"
                            onDelete={changeProfileStatus} />
                        </div>  
            ) }
            
        </div>
    )
}
export default ProfileStatus;