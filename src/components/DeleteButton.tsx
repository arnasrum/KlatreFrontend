import { useState, useContext } from "react"
import {BoulderContext} from "../Context";
import {apiUrl} from "../constants/global";
import ReusableButton from "./ReusableButton";


function DeleteButton() {

    const [confirmation, setConfirmation] = useState<boolean>(false)
    const {boulders, page, setPage, setRefetch, accessToken} = useContext(BoulderContext)



    function handleDeleteClick() {
        console.log("Delete clicked")
        if(boulders.length < 1) {
            setConfirmation(false)
            return
        }
        const boulderID: number = boulders[page].id

        fetch(`${apiUrl}/boulder?accessToken=${accessToken}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: boulderID
                })
            }
        )
            .then(_ => setRefetch((prev: boolean) => !prev))
            .then(_ => {
                if(page == 0) {
                    return
                }
                setPage(page - 1)
            })
            .then(_ => setConfirmation(false))

    }
    return(
        <>
            {!confirmation ? (
                <ReusableButton onClick={() => setConfirmation((prev: boolean) => !prev)}>Delete Boulder</ReusableButton>
        ) : (
            <>
                <label>
                    Are you sure?
                </label>
                <ReusableButton onClick={handleDeleteClick} children={"Yes"}/>
                <ReusableButton onClick={() => setConfirmation(false)} children={"No"} />
            </>

        )}
        </>
    );
}

export default DeleteButton;