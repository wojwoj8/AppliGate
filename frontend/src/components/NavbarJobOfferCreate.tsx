import React, { useContext, useState } from 'react';
import { Link, useNavigate  } from 'react-router-dom';
import ErrorPage from "./ErrorPage";
import axios from "axios";
import AuthContext from "../utils/AuthProvider";

interface NavbarJobOfferCreateProps {
    setGlobalAlertError: (error: string) => void;
  }

const NavbarJobOfferCreate: React.FC<NavbarJobOfferCreateProps> = ({ setGlobalAlertError }) => {
    const {authTokens, user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCreateJobOffer = async () => {
        try {
            const response = await axios.post(`/company/joboffer/createjoboffer`, {}, {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: 'Bearer ' + String(authTokens.access),
                },
            });
            const data = response.data;
            
            if (response.status === 201) {
                setGlobalAlertError(
                    'Job Offer has been created successfully! Now customize that offer and than make sure to list that public success')
                navigate(`/company/joboffer/${data.job_offer_id}`);
            
            } 
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              // Unauthorized - Logout the user
              logoutUser();
            } 
            else if (error.response && (error.response.status !== 400)) {
                setGlobalAlertError(
                    'Something went wrong. error')
            }
            else {
                setGlobalAlertError('Something else went wrong error')
                console.error('Error fetching profile:', error);
            }
          }
    }

    return (
        <Link to='#' className="nav-link" aria-current="page" onClick={handleCreateJobOffer}>
            Create New Job Offer
        </Link>
    );
};
export default NavbarJobOfferCreate;