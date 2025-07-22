import { useState, useEffect, useContext } from 'react'
import "./Boulders.css"
import { TokenContext} from "../Context";
import BoulderForm from "./BoulderForm";
import {apiUrl} from "../constants/global";
import Image from "./Image";
import AddButton from "../components/AddButton";
import EditButton from "../components/EditButton";
import DeleteButton from "../components/DeleteButton";
import { BoulderContext } from "../Context";
import {convertImageToBase64} from "../Helpers";

function Boulders() {

    const [boulders, setBoulders] = useState<Boulders>({})
    const boulderLength = Object.keys(boulders).length;
    const [page, setPage] = useState(0)
    const { user } = useContext(TokenContext)
    const [refetch, setRefetch] = useState<boolean>(false)

   interface Boulders extends Object{
        [key: number]: Boulder
   }

   interface Boulder {
        id: number,
        name: string,
        attempts: number,
        grade: string,
        image: string
   }

    useEffect(() => {
        console.log(`${apiUrl}/boulders?accessToken=${user.access_token}`)
        // @ts-ignore
        fetch(`${apiUrl}/boulders?accessToken=${user.access_token}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(responseBody => setBoulders(responseBody))
            .catch(error => console.error(error))
    }, [ user, refetch ]);

    const handleNextClick = () => {
        if(page == boulderLength - 1) {return}
        setPage(prevState => prevState + 1)
    }
    const handlePreviousClick = () => {
        if(page == 0) {return}
        setPage(prevState => prevState - 1)
    }

    // @ts-ignore
    const handleEditSubmit = async (event) => {
        event.preventDefault()
        let img: string | null = null;

        if(event.target.elements.image.files[0]) {
            const file = event.target.elements.image.files[0];
            const format = event.target.elements.image.files[0].type;
            img = await convertImageToBase64(file, format)
        }
        fetch(`${apiUrl}/boulder?accessToken=${user.access_token}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "id": boulders[page].id,
                    "name": event.target.elements.name.value,
                    "attempts": event.target.elements.attempts.value,
                    "grade": event.target.elements.grade.value,
                    "image": img
                }
            )
        })
            //.then(response => console.log(response.json()))
            //.then(body => console.log(body))
            .then(_ => setRefetch(prev => !prev))
            .then(_ => console.log("Boulder updated"))
            .catch(error => console.error(error))
    }

    const boulderContext = {
        boulders: boulders,
        setBoulders: setBoulders,
        page: page,
        setPage: setPage,
        setRefetch: setRefetch,
        boulderLength: boulderLength,
        accessToken: user.access_token,
    }


    return(
        <BoulderContext.Provider value={boulderContext}>
            {
                boulders ? (
                    boulderLength < 1 ? (
                        <p>Please insert some boulders</p>
                    ) : (
                        <div>
                            <h3>{boulders[page].name}</h3>
                            <div className="Boulder">
                                <ul className="flex-items">
                                    <li>Attempts: {boulders[page].attempts}</li>
                                    <li>Grade: {boulders[page].grade}</li>
                                </ul>
                                <div>
                                    <Image className="flex-items" data={boulders[page].image}/>
                                </div>
                            </div>
                            <p>Page {page + 1} of {boulderLength}</p>
                            <button onClick={handlePreviousClick}>Previous Boulder</button>
                            <button onClick={handleNextClick}>Next Boulder</button>
                        </div>
                    )
                ) : (
                    <p>Boulder undefined</p>
                )
            }
            <AddButton/>
            <EditButton/>
            <DeleteButton/>
        </BoulderContext.Provider>
    );
}

export default Boulders;