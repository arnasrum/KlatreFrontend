import { useState, useContext } from "react"
import {TokenContext} from "../Context.tsx";
import {apiUrl} from "../constants/global.ts";
import ReusableButton from "./ReusableButton.tsx";
import Boulder from "../interfaces/Boulder.ts";


interface DeleteButtonProps {
    page: number,
    setPage: (page: number) => void,
    boulders: Array<Boulder> | undefined,
    refetchBoulders: () => void,
}


function DeleteButton({page, setPage, boulders, refetchBoulders}: DeleteButtonProps) {


    if(!boulders || boulders.length < 1) {
        return(
            <ReusableButton disabled>Delete Boulder </ReusableButton>
        )
    }

    const [confirmation, setConfirmation] = useState<boolean>(false)
    const { user } = useContext(TokenContext)

    function handleDeleteClick() {
        if(!boulders) {
            return
        }
        if(boulders.length < 1) {
            setConfirmation(false)
            return
        }
        const boulderID: number = boulders[page].id

        fetch(`${apiUrl}/boulders?accessToken=${user.access_token}`,
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
            .then(_ => refetchBoulders())
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
                <label> Are you sure? </label>
                <ReusableButton onClick={handleDeleteClick}>Yes</ReusableButton>
                <ReusableButton onClick={() => setConfirmation(false)}>No</ReusableButton>
            </>

        )}
        </>
    );
}

export default DeleteButton;