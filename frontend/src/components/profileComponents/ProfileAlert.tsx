import React, { useState, useEffect } from "react";
type Alert = {
    error: String
    setError: React.Dispatch<React.SetStateAction<string>>
}


const ProfileAlert: React.FC<Alert> = ({ error, setError }) => {
    const [show, setShow] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
  
    useEffect(() => {
      // success error are static because I didn't expect that I will use that component
      // in more places
      if (error) {
        if (error === 'Image uploaded successfully' || 
        error === 'Image removed successfully' ||
        error === 'Data changed successfully'||
        error === 'Data deleted successfully'||
        error === 'Password changed successfully' ||
        error === 'Profile link coppied successfully' ||
        error === 'Profile Changed to Public, now everone can see your CV! Copy profile link and share it' ||
        error === 'Profile Changed to Private, nobody can see your CV'
        ) {
          setIsSuccess(true);
        }
        setShow(true);
        const timer = setTimeout(() => {
          setShow(false);
          setError('');
          setIsSuccess(false);
        }, 5000);
  
        return () => clearTimeout(timer);
      }
    }, [error, setError]);
  
    return (
      <div className="sticky-top">
        {show && (
          <div
            className={`container alert ${isSuccess ? 'alert-success' : 'alert-danger'} fade show`}
            role="alert"
          >
            <strong>{isSuccess ? 'Success!' : 'Error!'}</strong> {error}.
          </div>
        )}
      </div>
    );
  };

export default ProfileAlert;