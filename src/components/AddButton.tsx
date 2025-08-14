import { useState, useContext } from 'react'
import BoulderForm from "../pages/BoulderForm.tsx";
import {apiUrl} from "../constants/global.ts";
import {GroupContext, TokenContext} from "../Context.tsx";
import {convertImageToBase64} from "../Helpers.ts";
import ReusableButton from "./ReusableButton.tsx";
import Boulder from "../interfaces/Boulder.ts";


interface AddButtonProps {
    page: number,
    setPage: (page: number) => void,
    boulders: Array<Boulder> | null,
    placeID: number,
    refetchBoulders: () => void,
}

function AddButton({
    page,
    setPage,
    boulders,
    placeID,
    refetchBoulders,
    }: AddButtonProps) {

    const [addingBoulder, setAddingBoulder] = useState<boolean>(false)
    const { user } = useContext(TokenContext)

    const handleAddSubmit = async (event: any) => {
        event.preventDefault()

        let img: string | null = null;

        if(event.target.elements.image.files[0]) {
            const file = event.target.elements.image.files[0];
            const format = event.target.elements.image.files[0].type;
            img = await convertImageToBase64(file, format)
        }

        fetch(`${apiUrl}/boulders/place?accessToken=${user.access_token}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(
                {
                    "placeID": placeID,
                    "name": event.target.elements.name.value,
                    "attempts": event.target.elements.attempts.value,
                    "grade": event.target.elements.grade.value,
                    "image": img
                }
            )
        })
            .then(_ => refetchBoulders())
            .then(_ => setPage(boulders!.length - 1))
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