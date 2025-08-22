import { useState, useContext, useEffect } from 'react'
import BoulderForm from "../pages/BoulderForm.tsx";
import {apiUrl} from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import {convertImageToBase64} from "../Helpers.ts";
import ReusableButton from "./ReusableButton.tsx";
import Boulder from "../interfaces/Boulder.ts";


interface AddButtonProps {
    page: number,
    setPage: (page: number) => void,
    boulders: Array<Boulder> | undefined,
    refetchBoulders: () => void,
    placeID: number,
}

function AddButton({
    page,
    setPage,
    boulders,
    refetchBoulders,
    placeID,
    }: AddButtonProps) {

    const boulderLength = boulders?.length || 0
    const [addingBoulder, setAddingBoulder] = useState<boolean>(false)
    const [pageToLast, setPageToLast] = useState<boolean>(false)
    const { user } = useContext(TokenContext)

    useEffect(() => {
        if(boulders && boulderLength > 0 && pageToLast) {
            const lastPage = boulderLength - 1
            if(page !== lastPage) {
                setPage(lastPage)
                setPageToLast(false)
            }
        }
    }, [boulders])


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
            .then(_ => setAddingBoulder(false))
            .catch(error => console.error(error))
    }

    return (
        <div>
            {addingBoulder ? (
                <BoulderForm page={page} handleSubmit={handleAddSubmit} boulders={boulders} defaultValues={false}/>
            ) : (
                <></>
            )}
            <ReusableButton onClick={() => setAddingBoulder((prev: boolean) => !prev)}> Add Boulder </ReusableButton>
        </div>
    )
}

export default AddButton;