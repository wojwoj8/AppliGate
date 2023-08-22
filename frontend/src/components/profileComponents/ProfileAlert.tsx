import React, { useState, useEffect } from "react";
type Alert = {
    error: String
    setError: React.Dispatch<React.SetStateAction<string>>
}


const ProfileAlert: React.FC<Alert> = ({ error, setError }) => {
    const [show, setShow] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
  
    useEffect(() => {
      if (error) {
        if (error === 'Image uploaded successfully' || error === 'Image removed successfully') {
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