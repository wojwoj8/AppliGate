import { GetDataFunction } from "../ProfileCompany";
import { EditDataFunction } from "../ProfileCompany";
import { ProfileStatusData } from "../ProfileCompany";


interface ProfileCompanyStatusInterface{
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

const ProfileCompanyStatus: React.FC<ProfileCompanyStatusInterface> = ({profileStatus, setProfileStatus, getData, 
    editData, alertError, setAlertError}) => {
    
        const changeProfileStatus = async () => {
            const updatedProfileStatus = {
              ...profileStatus!,
              public_profile: !profileStatus?.public_profile,
            };
        
            await setProfileStatus(updatedProfileStatus);
        
            if (updatedProfileStatus.public_profile === false) {
              setAlertError('Profile Changed to Private, nobody can see your profile');
            } else {
              setAlertError('Profile Changed to Public, now everone can see your profile! Copy profile link and share it');
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
export default ProfileCompanyStatus;