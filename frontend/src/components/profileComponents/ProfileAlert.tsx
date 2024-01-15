import React, { useState, useEffect } from "react";
type Alert = {
    error: String
    setError: React.Dispatch<React.SetStateAction<string>>
}


const getErrorType = (error: string): "success" | "error" | "info" => {
  // split the error message into words
  const words = error.split(' ');
  // get the last word in lowercase
  const lastWord = words[words.length - 1].toLowerCase(); 

  if (lastWord === "error") {
    return "error";
  } else if (lastWord === "info") {
    return "info";
  } else if (lastWord === "success") {
    return "success";
  } else {
    return "error"; // Default to error
  }
};

const ProfileAlert: React.FC<Alert> = ({ error, setError }) => {
  const [show, setShow] = useState(true);
  const errorType = getErrorType(error.toString());
  let errMessage = error.split(' ');
  errMessage.pop()
  const errFinalMessage = errMessage.join(' ')
  useEffect(() => {
    if (error) {

      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setError('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, setError]);

  const alertClassName =
    errorType === "success" ? "alert-success" : errorType === "info" ? "alert-info" : "alert-danger";


  return (
    <div className="sticky-top high-z-index">
      {show && (
        <div className={`container alert ${alertClassName} fade show`} role="alert">
          <strong>{errorType === "success"
              ? "Success!"
              : errorType === "info"
              ? "Info!"
              : "Error!"}</strong> {errFinalMessage}.
        </div>
      )}
    </div>
  );
};

export default ProfileAlert;