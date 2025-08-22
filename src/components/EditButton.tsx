import { useState, useContext } from 'react';
import {TokenContext} from "../Context.tsx";
import {convertImageToBase64} from "../Helpers.ts";
import {apiUrl} from "../constants/global.ts";
import BoulderForm from "../pages/BoulderForm.tsx";
import ReusableButton from "./ReusableButton.tsx";
import Boulder from "../interfaces/Boulder.ts";

interface EditButtonProps {
    page: number,
    boulders: Array<Boulder> | undefined,
    refetchBoulders: () => void,
}



function EditButton( {page, boulders, refetchBoulders} : EditButtonProps) {
    const [editingBoulder, setEditingBoulder] = useState<boolean>(false)
    const { user } = useContext(TokenContext);

    // @ts-ignore
    const handleEditSubmit = async (event) => {
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
        console.log(updateValues)

        fetch(`${apiUrl}/boulders?accessToken`, {
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
            .then(_ => setEditingBoulder(false))
            .catch(error => console.error(error))
    }


    return (
        <div>
            {editingBoulder ? (
                <BoulderForm page={page} handleSubmit={handleEditSubmit} boulders={boulders} defaultValues/>
            ) : (
                <></>
            )}
            <ReusableButton onClick={() => {
                                if(!boulders || boulders.length < 1) {return}
                                setEditingBoulder((prev: boolean) => !prev)}
            }
            > Edit Boulders </ReusableButton>
        </div>
    );
};

export default EditButton;