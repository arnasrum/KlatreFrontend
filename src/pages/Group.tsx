import React, {useState, useEffect, useContext, useMemo, useRef } from "react"
import { useParams, useLocation, Outlet } from "react-router-dom"
import Boulders from "./Boulders.tsx";
import { Grid, GridItem, Tabs, Spinner } from "@chakra-ui/react"
import "./Group.css"
import Places from "./Places.tsx";
//import type Group from "../interfaces/Group.ts"
import {apiUrl} from "../constants/global.ts"
import {TokenContext} from "../Context.tsx"
import { GroupContext } from "../contexts/GroupContext.tsx"

function Group() {

    const { currentGroup, setCurrentGroup, isLoading, setIsLoading } = useContext(GroupContext)
    const { groupUUID } = useParams()
    const groupData = currentGroup
    const groupID = groupData?.id
    const location = useLocation()

    //const groupData = location.state?.groupData
    const [refetchGroups, setRefetchGroups] = useState<boolean>(false)
    const [ placeData, setPlaceData ] = useState<Array<any>>([])
    const { user, isLoading: userLoading } = useContext(TokenContext)
    const [ placeIsLoading, setPlaceIsLoading ] = useState<boolean>(true);
    const isOnAddRoute = location.pathname.endsWith("/add")

    console.log(groupData)
    useEffect(() => {
        if( (groupData && (groupData?.uuid !== groupUUID))  || !user?.access_token) {
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
            .then(data => {console.log("fetched", data); return data})
            .then(data => setPlaceData(data))
            .then(_ => setPlaceIsLoading(false))
            .catch(error => console.error(error))
            .finally(() => setPlaceIsLoading(false))

    }, [refetchGroups, groupUUID, user?.access_token])

    function refetchGroupsHandler() {
        setPlaceIsLoading(true)
        setRefetchGroups((prev: boolean) => !prev)
    }

    if(isLoading || placeIsLoading || userLoading) {
        return(
            <Spinner />
        )
    }

    if(isOnAddRoute) {
        return(
            <Outlet />
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