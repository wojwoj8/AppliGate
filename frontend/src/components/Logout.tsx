import {useEffect, useState} from "react"
import axios from "axios";
const Logout: React.FC = () => {
    
    useEffect(() =>{
      axios.post('/logout/').then((res)=>{
        console.log(res)
        console.log('logout correctly')
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