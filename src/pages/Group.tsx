import React, {useState, useEffect} from "react"
import { useParams, useLocation, useLoaderData } from "react-router-dom"
import Boulders from "./Boulders.tsx";


function Group() {

    const groupData = useLoaderData()
    console.log(groupData)

    const page = 0
    console.log(groupData[0].boulders[page].name)
    const boulders = groupData[0].boulders.map((boulder) => {
        return {"boulder": boulder, "routeSend": null}
    })

    return (
        <div>
            <h1>Group Page</h1>
            <p>This is the group page!</p>
            <Boulders boulderData={boulders} placeID={groupData[0].place.id} refetchBoulders={() => {}}></Boulders>
        </div>
    );

}

export default Group;