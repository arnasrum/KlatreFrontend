import { useState, useContext } from 'react';
import {BoulderContext, TokenContext} from "../Context.tsx";
import {convertImageToBase64} from "../Helpers.ts";
import {apiUrl} from "../constants/global.ts";
import BoulderForm from "../pages/BoulderForm.tsx";
import ReusableButton from "./ReusableButton.tsx";
import Boulder from "../interfaces/Boulder.ts";

interface EditButtonProps {
    page: number,
    boulders: Array<Boulder> | null,
    placeID: number,
    refetchBoulders: () => void,
}



const EditButton = ( {page, boulders, refetchBoulders} : EditButtonProps
) => {

    const [editingBoulder, setEditingBoulder] = useState<boolean>(false)
    //const {boulders, page, setRefetch, accessToken} = useContext(BoulderContext)
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
            .then(_ => refetchBoulders())
            .then(_ => setEditingBoulder(false))
            .then(_ => console.log("Boulder updated"))
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