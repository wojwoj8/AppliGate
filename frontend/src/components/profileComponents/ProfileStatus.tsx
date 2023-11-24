import { GetDataFunction } from '../Profile';
import { EditDataFunction } from '../Profile';
import { ProfileStatusData } from '../Profile';


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
              setAlertError('Your profile has been set to private. This means that your CV is no longer visible, even if you have already applied for a job offer info');
            } else {
              setAlertError('Profile Changed to Public, now everone can see your CV! Copy profile link and share it success');
            }
        
            editData(updatedProfileStatus, undefined, '/profile/profileStatus', 'profileStatus');
          };

    return(
        <div className='container prevHidden'>
            {profileStatus && profileStatus?.public_profile === true ? (
                <button className='btn btn-danger w-100 rounded-4 mt-3' onClick={changeProfileStatus}>Set Profile to Private</button>) : 
            (
                <button className='btn btn-danger w-100 rounded-4 mt-3' onClick={changeProfileStatus}>Set Profile to Public</button>
            ) }
            
        </div>
    )
}
export default ProfileStatus;