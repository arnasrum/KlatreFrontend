import { useState, useContext } from "react"
import {BoulderContext} from "../Context";
import {apiUrl} from "../constants/global";


function DeleteButton() {

    const [confirmation, setConfirmation] = useState<boolean>(false)
    const {boulders, page, setRefetch, accessToken} = useContext(BoulderContext)



    // @ts-ignore
    async function handleDeleteClick(event) {
        event.preventDefault()
        console.log("Delete clicked")

        /*
        fetch(`${apiUrl}/boulder?accessToken=${accessToken}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: boulders[page].id
                })
            }
        )
         */
        setConfirmation(false)
    }

    return(
        <>
            {!confirmation ? (
                <button onClick={() => setConfirmation((prev: boolean) => !prev)}>Delete Boulder</button>
        ) : (
            <>
                <label>
                    Are you sure?
                </label>
                <button onClick={handleDeleteClick}>Yes</button>
                <button onClick={() => setConfirmation(false)}>No</button>
            </>

        )}
        </>
    );
}

export default DeleteButton;