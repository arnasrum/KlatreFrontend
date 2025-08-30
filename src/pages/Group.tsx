import React, {useState, useEffect, useContext} from "react"
import { useParams, useLocation, useLoaderData, useSearchParams } from "react-router-dom"
import Boulders from "./Boulders.tsx";
import { Grid, GridItem, Tabs, Spinner } from "@chakra-ui/react"
import "./Group.css"
import Places from "./Places.tsx";
//import type Group from "../interfaces/Group.ts"
import {apiUrl} from "../constants/global.ts"
import {TokenContext} from "../Context.tsx"


function Group() {

    const location = useLocation()
    const groupData = location.state?.groupData
    const groupID = groupData.id
    const [refetchGroups, setRefetchGroups] = useState<boolean>(false)
    const [ placeData, setPlaceData ] = useState<Array<any>>([])
    const { user } = useContext(TokenContext)
    const { isLoading, setIsLoading } = useState<boolean>(true);

    useEffect(() => {
        if(!groupID) {
            return
        }
        fetch(`${apiUrl}/api/places?groupID=${groupID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.access_token}`
            }
        })
            .then(response => response.json())
            .then(data => setPlaceData(data))
            .catch(error => console.error(error))

    }, [refetchGroups, groupID])


    function refetchGroupsHandler() {
        setRefetchGroups((prev: boolean) => !prev)
    }

    if(isLoading) {
        return(
            <Spinner />
        )
    }


    return (
        <div className="group">
            <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <GridItem colSpan={3}>
                    <h1>{groupData.name}</h1>
                </GridItem>
                <GridItem colSpan={3}>
                    <Tabs.Root fitted>
                        <Tabs.List>
                            <Tabs.Trigger value="boulders">Boulders</Tabs.Trigger>
                            <Tabs.Trigger value="stats">Statistics</Tabs.Trigger>
                            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="boulders">
                            <Places refetchGroups={refetchGroupsHandler} groupID={groupID} places={placeData} />
                        </Tabs.Content>
                    </Tabs.Root>
                </GridItem>
            </Grid>

        </div>
    );

}

export default Group;