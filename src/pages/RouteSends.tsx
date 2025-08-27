import { useState, useEffect, useContext } from "react"
import {apiUrl} from "../constants/global.ts";
import RouteSend from "../interfaces/RouteSend.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import {TokenContext} from "../Context.tsx";


type RouteSendProps = {
    routeSend: RouteSend | null,
    boulderID: number,
}


function RouteSends(props: RouteSendProps) {

    const { routeSend, boulderID } = props
    const { user } = useContext(TokenContext)

    function handleAddClick() {

            fetch(`${apiUrl}/boulders/place/sends`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + user.access_token
                },
                body: JSON.stringify({
                    "attempts": 0,
                    "boulderID": boulderID
                })
            })
                .catch(error => console.error(error))
    }

    function handleDeleteClick() {

    }

    return (
        <>
            <h2>Your Send</h2>
            { routeSend ? (
                <div>
                    <label>Attempts:
                        <p>{routeSend.attempts}</p>
                    </label>
                </div>
            ) : (
                <h2>No Send</h2>
            )}
            <ReusableButton type="button" onClick={handleAddClick}>Add Send</ReusableButton>
            <ReusableButton type="button" onClick={handleDeleteClick}>Delete Send</ReusableButton>
        </>
    )
}

export default RouteSends;