import { useContext } from "react"
import {TokenContext} from "../Context";


function SendAPIRequest() {

    const { user } = useContext(TokenContext)

    const handleClick = () => {
        fetch(`http://localhost:8080/google_login?token=${user.access_token}`, {
           body: JSON.stringify({
               "token": user.access_token
           })
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error(error))
    }

   return(
      <>
          <button onClick={handleClick}>
              Send Request
          </button>
      </>
   )
}

export default SendAPIRequest;