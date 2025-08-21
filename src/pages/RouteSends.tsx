import { useState, useEffect } from "react"
import {apiUrl} from "../constants/global.ts";
import RouteSend from "../interfaces/RouteSend.ts";


type RouteSendProps = {
    routeSend: RouteSend | null,
}


function RouteSends(props: RouteSendProps) {

    const { routeSend } = props
    const [sends, setSends] = useState<Array<object>>([])


    useEffect(() => {

        fetch(`${apiUrl}/sends`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then(response => response.json())
            .then(data => setSends(data))
            .catch(error => console.error(error))
    }, [sends]);


    function handleAddClick() {

            fetch(`${apiUrl}/sends`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "name": "test",
                    "description": "test",
                    "image": "test"
                })
            })
                .then(response => response.json())
                .catch(error => console.error(error))
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




        </>
    )
}

export default RouteSends;