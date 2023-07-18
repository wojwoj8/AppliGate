import {useEffect, useState} from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Logout: React.FC = () => {

  const navigate = useNavigate()
    
    useEffect(() =>{
      axios.post('/logout/').then((res)=>{
        console.log(res)
        console.log('logout correctly')
        navigate('/login')
      }).catch((err) =>{
        console.log(err)
        console.log('error')
      }) 
    })

    return (
       <div>
          
       </div>
     )
}
export default Logout;