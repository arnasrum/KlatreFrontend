import { useState, useEffect, useContext } from 'react'
import BoulderForm from "../pages/BoulderForm";
import {apiUrl} from "../constants/global";
import {BoulderContext, GroupContext} from "../Context";
import {convertImageToBase64} from "../Helpers";
import ReusableButton from "./ReusableButton";

function AddButton() {

    const [addingBoulder, setAddingBoulder] = useState<boolean>(false)
    const {boulders, page, setPage, boulderLength, setRefetch, accessToken, placeID} = useContext(BoulderContext)
    const { setAddRefetch } = useContext(GroupContext)

    // @ts-ignore
    const handleAddSubmit = async (event) => {
        event.preventDefault()

        let img: string | null = null;

        if(event.target.elements.image.files[0]) {
            const file = event.target.elements.image.files[0];
            const format = event.target.elements.image.files[0].type;
            img = await convertImageToBase64(file, format)
        }

        fetch(`${apiUrl}/boulders/place?accessToken=${accessToken}`, {
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
            .then(_ => setAddRefetch((prev: boolean) => !prev))
            .catch(error => console.error(error))



    }

    return (
        <div>
            {addingBoulder ? (
                <BoulderForm page={page} handleSubmit={handleAddSubmit} boulders={boulders} defaultValues={false}/>
            ) : (
                <></>
            )}
            <ReusableButton onClick={() => setAddingBoulder((prev: boolean) => !prev)}
                children={"Add Boulder"}
            />
        </div>
    )
}

export default AddButton;