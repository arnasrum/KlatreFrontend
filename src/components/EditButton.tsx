import { useState, useContext } from 'react';
import { BoulderContext } from '../Context';
import {convertImageToBase64} from "../Helpers";
import {apiUrl} from "../constants/global";
import BoulderForm from "../pages/BoulderForm";
import ReusableButton from "./ReusableButton";

const EditButton = () => {

    const [editingBoulder, setEditingBoulder] = useState<boolean>(false)
    const {boulders, page, setRefetch, accessToken} = useContext(BoulderContext)

    // @ts-ignore
    const handleEditSubmit = async (event) => {
        event.preventDefault()
        if(boulders.length < 1) {return}
        let img: string | null = null;

        if(event.target.elements.image.files[0]) {
          const file = event.target.elements.image.files[0];
          const format = event.target.elements.image.files[0].type;
          img = await convertImageToBase64(file, format)
        }
        fetch(`${apiUrl}/boulder?accessToken=${accessToken}`, {
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
            .then(_ => setRefetch((prev: boolean) => !prev))
            .then(_ => console.log("Boulder updated"))
            .catch(error => console.error(error))
    }


    return (
        <div>
            {editingBoulder ? (
                <BoulderForm page={page} handleSubmit={handleEditSubmit} boulders={boulders} defaultValues={true}/>
            ) : (
                <></>
            )}
            <ReusableButton children={"Edit Boulder"}
                            onClick={() => {
                                if(boulders.length < 1) {return}
                                setEditingBoulder((prev: boolean) => !prev)}
            }
            />
        </div>
    );
};

export default EditButton;