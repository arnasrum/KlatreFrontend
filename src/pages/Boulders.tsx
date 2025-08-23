import { useState, useEffect, useContext } from 'react'
import "./Boulders.css"
import Image from "./Image.tsx";
import DeleteButton from "../components/DeleteButton.tsx";
import Boulder from "../interfaces/Boulder.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import BoulderData from "../interfaces/BoulderData.ts";
import RouteSends from "./RouteSends.tsx";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import {convertImageToBase64} from "../Helpers.ts";
import FormButton from "../components/FormButton.tsx";


interface BoulderProps{
    boulderData: Array<BoulderData> | undefined
    isLoading?: boolean // Add this
    placeID: number,
    refetchBoulders: () => void

}

function Boulders(props: BoulderProps) {
    const { placeID, boulderData, refetchBoulders, isLoading = false } = props
    const boulders: Array<Boulder> | undefined = boulderData?.map((boulder: BoulderData) => boulder.boulder)
    const boulderLength = boulders?.length || 0
    const [page, setPage] = useState<number>(0)
    const [pageToLast, setPageToLast] = useState<boolean>(false)
    const { user } = useContext(TokenContext)

    useEffect(() => {
        setPage(0)
    }, [placeID, boulderData]);

    useEffect(() => {
        if(boulders && boulderLength > 0 && pageToLast) {
            const lastPage = boulderLength - 1
            if(page !== lastPage) {
                setPage(lastPage)
                setPageToLast(false)
            }
        }
    }, [boulders])


    const handleNextClick = () => {
        if(page == boulderLength - 1) {return}
        setPage((prevState: number) => prevState + 1)
    }
    const handlePreviousClick = () => {
        if(page == 0) {return}
        setPage((prevState: number) => prevState - 1)
    }

    const handleAddSubmit = async (event: any) => {
        event.preventDefault()

        let img: string | null = null;

        if(event.target.elements.image.files[0]) {
            const file = event.target.elements.image.files[0];
            const format = event.target.elements.image.files[0].type;
            img = await convertImageToBase64(file, format)
        }

        fetch(`${apiUrl}/boulders/place`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.access_token
            },
            body: JSON.stringify(
                {
                    "placeID": placeID,
                    "name": event.target.elements.name.value,
                    "grade": event.target.elements.grade.value,
                    "image": img
                }
            )
        })
            .then(_ => {
                setPageToLast(true)
                refetchBoulders()
            })
            .catch(error => console.error(error))
    }

    const handleEditSubmit = async (event: any) => {
        event.preventDefault()
        if(!boulders || boulders.length < 1) {return}
        let img: string | null = null;

        if(event.target.elements.image.files[0]) {
            const file = event.target.elements.image.files[0];
            const format = event.target.elements.image.files[0].type;
            img = await convertImageToBase64(file, format)
        }

        let updateValues: object = {"placeID": boulders[page].place, "boulderID": boulders[page].id}
        if(event.target.elements.name.value != boulders[page].name) {
            updateValues = {...updateValues, "name": event.target.elements.name.value}
        }
        if(event.target.elements.grade.value != boulders[page].grade) {
            updateValues = {...updateValues, "grade": event.target.elements.grade.value}
        }
        if(img) {
            updateValues = {...updateValues, "image": img}
        }

        fetch(`${apiUrl}/boulders`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + user.access_token
            },
            body: JSON.stringify(
                updateValues
            )
        })
            .then(_ => refetchBoulders())
            .catch(error => console.error(error))
    }

    function handleDeleteClick() {
        if(!boulders) {
            return
        }
        const boulderID: number = boulders[page].id

        fetch(`${apiUrl}/boulders?accessToken`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.access_token
                },
                body: JSON.stringify({
                    id: boulderID
                })
            }
        )
            .then(_ => refetchBoulders())
            .then(_ => {
                if(page == 0) {
                    return
                }
                setPage(page - 1)
            })
    }

    const fields = [
        {"label": "Name", "type": "string", "name": "name", "required": true},
        {"label": "Grade", "type": "string", "name": "grade", "required": true},
        {"label": "Image", "type": "file", "name": "image", "required": false, "accept": "image/*"},
    ]


    if (isLoading) {
        return <div>Loading boulders...</div>
    }

    return(
        <>
            {boulders && boulderLength > 0 && page < boulderLength ? (
                <div>
                    <h3>{boulders[page].name}</h3>
                    <div className="Boulder">
                        <ul className="flex-items">
                            <li>Grade: {boulders[page].grade}</li>
                        </ul>
                        <div>
                            <Image className="flex-items" data={boulders[page].image}/>
                        </div>
                    </div>
                    <p>Page {page + 1} of {boulderLength}</p>
                    <ReusableButton onClick={handlePreviousClick} type="button">Previous Boulder</ReusableButton>
                    <ReusableButton onClick={handleNextClick} type="button">Next Boulder</ReusableButton>
                </div>
            ) : (
                <p>No boulders</p>

            )}
            { boulderData && boulderData[page] && (
                <RouteSends routeSend={boulderData[page].routeSend} boulderID={boulderData[page].boulder.id}/>
            )}

            <FormButton formSubmit={handleAddSubmit} fields={fields}> Add Boulder </FormButton>
            <FormButton formSubmit={handleEditSubmit} fields={fields}> Edit Boulder </FormButton>
            <DeleteButton onDelete={handleDeleteClick}>Delete Boulder</DeleteButton>
        </>
    );
}

export default Boulders;