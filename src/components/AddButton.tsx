import { useState, useContext } from 'react'
import BoulderForm from "../pages/BoulderForm";
import {apiUrl} from "../constants/global";
import {BoulderContext} from "../Context";
import {convertImageToBase64} from "../Helpers";
import ReusableButton from "./ReusableButton";

function AddButton() {

    const [addingBoulder, setAddingBoulder] = useState<boolean>(false)
    const {boulders, page, setPage, setRefetch, boulderLength, accessToken} = useContext(BoulderContext)

    // @ts-ignore
    const handleAddSubmit = async (event) => {
        event.preventDefault()

        let img: string | null = null;

        if(event.target.elements.image.files[0]) {
            const file = event.target.elements.image.files[0];
            const format = event.target.elements.image.files[0].type;
            img = await convertImageToBase64(file, format)
        }

        fetch(`${apiUrl}/boulder?accessToken=${accessToken}`, {
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
            .then(_ => setRefetch((prev: boolean) => !prev))
            .then(_ => {
                if(boulders.length < 1) {return}
                setPage(boulderLength - 1)})
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