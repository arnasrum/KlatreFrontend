import React, {useState, useEffect, useContext, useMemo, useRef } from "react"
import { useParams, useLocation, Outlet } from "react-router-dom"
import Boulders from "./Boulders.tsx";
import {Box, Grid, GridItem, Tabs, Spinner, Container, Heading, Center, Text} from "@chakra-ui/react"
import "./Group.css"
import Places from "./Places.tsx";
//import type Group from "../interfaces/Group.ts"
import {apiUrl} from "../constants/global.ts"
import {TokenContext} from "../Context.tsx"
import { GroupContext } from "../contexts/GroupContext.tsx"
import Settings from "./Settings.tsx";
import {PlaceContext} from "../Context.tsx";

function Group() {

    const { currentGroup, setCurrentGroup, isLoading, setIsLoading } = useContext(GroupContext)
    const { groupUUID } = useParams()
    const groupData = currentGroup
    const groupID = groupData?.id

    //const groupData = location.state?.groupData
    const [tab, setTab] = useState<string>("boulders")
    const [refetchPlaces, setRefetchPlaces] = useState<boolean>(false)
    const [ placeData, setPlaceData ] = useState<Array<any>>([])
    const { user, isLoading: userLoading } = useContext(TokenContext)
    const [ placeIsLoading, setPlaceIsLoading ] = useState<boolean>(true);

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
            .catch(error => console.error(error))
            .finally(() => setPlaceIsLoading(false))

    }, [refetchPlaces, groupUUID, user?.access_token])

    function refetchPlacesHandler() {
        setPlaceIsLoading(true)
        setRefetchPlaces((prev: boolean) => !prev)
    }

    if(placeIsLoading) {
        return(
            <Spinner />
        )
    }

    const placeContext = {refetchPlaces: refetchPlacesHandler}

    return (
        <PlaceContext.Provider value={placeContext} >
            <Container bg="Background" >
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    <GridItem colSpan={3}>
                        <Container maxW="container.xl" p={4} bg="Background" borderRadius="lg" boxShadow="lg" overflow="hidden">
                            <Heading size="4xl">{groupData.name}</Heading>
                            <Text color="fg.muted" fontSize="md" mt={1}>{groupData.description || "Placeholder Group Description"}</Text>
                        </Container>
                    </GridItem>
                    <GridItem colSpan={3}>
                        <Container maxW="container.xl" p={4} bg="Background" borderRadius="lg" boxShadow="lg" overflow="hidden">
                            <Tabs.Root fitted value={tab} onValueChange={(newValue) => {setTab(newValue.value)}}>
                                <Tabs.List>
                                    <Tabs.Trigger value="boulders">Boulders</Tabs.Trigger>
                                    <Tabs.Trigger value="stats">Statistics</Tabs.Trigger>
                                    <Tabs.Trigger value="sessions">Sessions</Tabs.Trigger>
                                    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                                </Tabs.List>
                                <Tabs.Content value="boulders">
                                    <Places refetchGroups={refetchPlacesHandler} groupID={groupID} places={placeData} />
                                </Tabs.Content>
                                <Tabs.Content value="settings">
                                    <Settings groupID={groupID} places={placeData} />
                                </Tabs.Content>
                            </Tabs.Root>
                        </Container>
                    </GridItem>
                </Grid>
            </Container>
        </PlaceContext.Provider>
    );

}

export default Group;