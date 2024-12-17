import { useState, useEffect, useContext } from 'react'
import { TokenContext} from "../Context";

function Boulders() {

    const [boulders, setBoulders] = useState<Boulders>({})
    const boulderLength = Object.keys(boulders).length;
    const [page, setPage] = useState(1)
    const { user } = useContext(TokenContext)

   interface Boulders extends Object{
        [key: number]: Boulder
   }

   interface Boulder {
        attempts: number,
        grade: string,
        image: string
   }


    useEffect(() => {
        // @ts-ignore
        fetch(`http://localhost:8080/boulders?access_token=${user.access_token}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(responseBody => setBoulders(responseBody))
            .then(_ => console.log(boulders))
            .then(_ => console.log(`http://localhost:8080/boulders?access_token=${user.access_token}`))
            .catch(error => console.error(error))
    }, [ user ]);


    const handleNextClick = () => {
        if(page == boulderLength) {
            return
        }
        setPage(prevState => prevState + 1)
    }
    const handlePreviousClick = () => {
        if(page == 1) {
            return
        }
        setPage(prevState => prevState - 1)
    }
    return(
       <>
           {
               boulders ? (
                   boulderLength == 0 ? (
                       <p>Please insert some boulders</p>
                   ) : (
                       <div>
                           <h3>{boulders[page].name}</h3>
                           <p>Page {page} of {boulderLength}</p>
                           <button onClick={handlePreviousClick}>Previous Boulder</button>
                           <button onClick={handleNextClick}>Next Boulder</button>
                       </div>
                   )
               ) : <p>Boulder undefined</p>

           }
       </>
    );
}

export default Boulders;