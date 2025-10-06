import React, {useState, useEffect, useContext, useMemo, useRef } from "react"
import { useParams, useLocation, Outlet } from "react-router-dom"
import Boulders from "./Boulders.tsx";
import {Box, Grid, GridItem, Tabs, Spinner, Container, Heading, Center, Text} from "@chakra-ui/react"
import "./Group.css"
import Places from "./Places.tsx";
import {apiUrl} from "../constants/global.ts"
import Settings from "./Settings.tsx";
import Sessions from "./Sessions.tsx";
import { UserContext } from "../contexts/UserContext.ts";
import { PlaceContext } from "../contexts/PlaceContext.ts";

function Group() {

    const location = useLocation()
    const groupUUID = location.pathname.split("/").pop()

    const [groupData, setGroupData] = useState<any>(null)
    const [tab, setTab] = useState<string>("boulders")
    const [refetchPlaces, setRefetchPlaces] = useState<boolean>(false)
    const [ placeData, setPlaceData ] = useState<Array<any>>([])
    const { user } = useContext(UserContext)
    const groupID = groupData?.id

    function setPlaces(places: Array<any>) {
        setPlaceData(places)
    }

    useEffect(() => {
        fetch(`${apiUrl}/api/groups/uuid/${groupUUID}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(responseBody => setGroupData(responseBody.data))
            .catch(error => console.error('Failed to fetch group:', error))
    }, [groupUUID, user]);

    function refetchPlacesHandler() {
        setRefetchPlaces((prev: boolean) => !prev)
    }

    const placeContext = {refetchPlaces: refetchPlacesHandler}

    if (!groupData) {
        return (
            <Box>
                <Heading>Group</Heading>
                <Spinner/>
            </Box>
        )
    }

    return (
        <PlaceContext.Provider value={placeContext} >
            <Container bg="Background" >
                <Grid templateColumns="repeat(3, 1fr)" gap={6}>PlaceContext
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
                                    <Places refetchGroups={refetchPlacesHandler} groupID={groupData.id} setPlaces2={setPlaces} />
                                </Tabs.Content>
                                <Tabs.Content value="settings">
                                    <Settings groupID={groupData.id} places={placeData} />
                                </Tabs.Content>
                                <Tabs.Content value="sessions">
                                    <Sessions places={placeData} groupId={groupData.id} />
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