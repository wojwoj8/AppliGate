import { useContext } from "react";
import axios from "axios";
import AuthContext from "../utils/AuthProvider";

const Index: React.FC = () =>{

    const { user } = useContext(AuthContext);

    return (user ? (
        <div>
            <p>You are logged in to the homepage!</p>
        </div>
        ):(
        <div>
            <p>You are not logged in, redirecting...</p>
        </div>
        )
    )
}
export default Index;