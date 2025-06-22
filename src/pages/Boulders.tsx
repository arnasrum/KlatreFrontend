import { useState, useEffect, useContext } from 'react'
import "./Boulders.css"
import { TokenContext} from "../Context";
import BoulderForm from "./BoulderForm";
import {apiUrl} from "../constants/global";
import Image from "./Image";

function Boulders() {

    const [boulders, setBoulders] = useState<Boulders>({})
    const boulderLength = Object.keys(boulders).length;
    const [page, setPage] = useState(0)
    const { user } = useContext(TokenContext)
    const [editingBoulder, setEditingBoulder] = useState<boolean>(false)
    const [addingBoulder, setAddingBoulder] = useState<boolean>(false)
    const [refetch, setRefetch] = useState<boolean>(false)
    console.log(boulders)

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
        setEditingBoulder(false)
        setAddingBoulder(false)
        setPage(prevState => prevState + 1)
    }
    const handlePreviousClick = () => {
        if(page == 0) {return}
        setEditingBoulder(false)
        setAddingBoulder(false)
        setPage(prevState => prevState - 1)
    }



    const convertImageToBase64 = async (file: File, format: string) => {
        if(file == null || format == null) {
            return null
        }
        let img = null
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        // Convert to base64
        let binary = '';
        bytes.forEach((byte) => binary += String.fromCharCode(byte));
        img = btoa(binary);

        console.log('Image converted to base64, length:', img.length);
        img = `data:${format};base64,${img}`
        return img
    }


    // Fix the handleAddSubmit function
    // @ts-ignore
    const handleAddSubmit = async (event) => {
        event.preventDefault()

        let img: string | null = null;

        if(event.target.elements.image.files[0]) {
            const file = event.target.elements.image.files[0];
            const format = event.target.elements.image.files[0].type;
            img = await convertImageToBase64(file, format)
        }

        fetch(`${apiUrl}/boulder?accessToken=${user.access_token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "name": event.target.elements.name.value,
                    "attempts": event.target.elements.attempts.value,
                    "grade": event.target.elements.grade.value,
                    "image": img
                }
            )
        })
            //.then(response => response.json())
            .then(_ => setRefetch(prev => !prev))
            .catch(error => console.error(error))
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
                                    <Image className="flex-items" data={boulders[page].image}/>
                                </div>
                            </div>
                            <p>Page {page + 1} of {boulderLength}</p>
                            <button onClick={handlePreviousClick}>Previous Boulder</button>
                            <button onClick={handleNextClick}>Next Boulder</button>
                            <div>
                                {editingBoulder ? (
                                    <BoulderForm page={page} handleSubmit={handleEditSubmit} boulders={boulders} defaultValues={true}/>
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