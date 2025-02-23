import { useState, useEffect, useContext } from 'react'
import "./Boulders.css"
import boulder from "./boulder.png"
import { TokenContext} from "../Context";
import BoulderForm from "./BoulderForm";
import {apiUrl} from "../constants/global";
import Image from "./Image";

function Boulders() {

    const [boulders, setBoulders] = useState<Boulders>({})
    const boulderLength = Object.keys(boulders).length;
    const [page, setPage] = useState(1)
    const { user } = useContext(TokenContext)
    const [editingBoulder, setEditingBoulder] = useState<boolean>(false)
    const [addingBoulder, setAddingBoulder] = useState<boolean>(false)
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
        console.log(`${apiUrl}/boulders?access_token=${user.access_token}`)
        // @ts-ignore
        fetch(`${apiUrl}/boulders?access_token=${user.access_token}`, {
            method: "GET",
        })
            .then(response => response.json())
            .then(responseBody => setBoulders(responseBody))
            .catch(error => console.error(error))
    }, [ user, refetch ]);

    const handleNextClick = () => {
        if(page == boulderLength) {return}
        setEditingBoulder(false)
        setAddingBoulder(false)
        setPage(prevState => prevState + 1)
    }
    const handlePreviousClick = () => {
        if(page == 1) {return}
        setEditingBoulder(false)
        setAddingBoulder(false)
        setPage(prevState => prevState - 1)
    }

    const handleEditSubmit = (event) => {
        event.preventDefault()
        fetch(`${apiUrl}/boulder?access_token=${user.access_token}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "id": boulders[page].id,
                    "name": event.currentTarget.elements.name.value,
                    "attempts": event.currentTarget.elements.attempts.value,
                    "grade": event.currentTarget.elements.grade.value,
                    "image": event.currentTarget.elements.image.value
                }
            )
        })
            .then(response => response.json())
            .then(body => console.log(body))
            .then(_ => setRefetch(prev => !prev))
            .catch(error => console.error(error))
    }

    const handleAddSubmit = (event) => {
        event.preventDefault()
        fetch(`${apiUrl}/boulder?access_token=${user.access_token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "name": event.currentTarget.elements.name.value,
                    "attempts": event.currentTarget.elements.attempts.value,
                    "grade": event.currentTarget.elements.grade.value,
                    "image": event.currentTarget.elements.image.value
                }
            )
        })
            .then(response => response.json())
            .then(body => console.log(body))
            .then(_ => setRefetch(prev => !prev))
            .catch(error => console.error(error))
    }

    return(
        <>
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
                                    <Image className="flex-items" data={boulders[page - 1]}/>
                                </div>
                            </div>
                            <p>Page {page} of {boulderLength}</p>
                            <button onClick={handlePreviousClick}>Previous Boulder</button>
                            <button onClick={handleNextClick}>Next Boulder</button>
                            <div>
                                {editingBoulder ? (
                                        <BoulderForm page={page} handleSubmit={handleEditSubmit} boulders={boulders}
                                                     defaultValues={true}/>
                                    ) : (
                                        <>Not editing</>
                                    )}
                                <button onClick={() => {
                                    setEditingBoulder(prev => !prev)
                                }}>Edit Boulder
                                </button>
                            </div>

                        </div>
                    )
                ) : (
                    <p>Boulder undefined</p>
                )
            }
            <div>
                {addingBoulder ? (
                    <BoulderForm page={page} handleSubmit={handleAddSubmit} boulders={boulders} defaultValues={false}/>
                ) : (
                    <>Not Adding</>
                )}
                <button onClick={() => setAddingBoulder(prev => !prev)}>Add boulder</button>
            </div>
            <button onClick={() => {}}>
                Delete Boulder
            </button>
        </>
    );
}

export default Boulders;