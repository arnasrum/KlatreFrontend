import React, {useContext, useState, useEffect} from "react";
import {Box, Button, Heading, HStack, VStack, Text, Card} from "@chakra-ui/react";
import Place from "../interfaces/Place.ts";
import SessionContext from "../hooks/useSession.ts"
import {ActiveSession} from "../interfaces/ActiveSession.ts";
import Modal from "../components/Modal.tsx";
import SelectField from "../components/SelectField.tsx";
import {toaster, Toaster} from "../components/ui/toaster.tsx";
import {apiUrl} from "../constants/global.ts";
import Boulder from "../interfaces/Boulder.ts";
import {TokenContext} from "../Context.tsx";
import AbstractForm from "../components/AbstractForm.tsx";


interface SessionProps{
    places: Place[]
}



function Sessions({places}: SessionProps): React.ReactElement {

    const activeSessions = useContext(SessionContext)
    const { user } = useContext(TokenContext)

    const date = new Date()

    const [newSessionModalOpen, setNewSessionModalOpen] = useState(false)
    const [logClimbModalOpen, setLogClimbModalOpen] = useState(false)
    const [selectFieldPlaceValue, setSelectFieldPlaceValue] = useState<string[]>([])
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
    const [boulders, setBoulders] = useState<Boulder[]>([])

    useEffect(() => {
        if(!selectedPlace && activeSessions.activeSessions.length <= 0) {
            return
        }
        const placeId = selectedPlace ? selectedPlace.id : activeSessions.activeSessions[0].placeId
        fetch(`${apiUrl}/boulders/place?placeID=${placeId}`, {
            headers: {
                "Authorization": `Bearer ${user.access_token}`
            }
        })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(json => {throw new Error(json.errorMessage)})
                }
                return response.json()
            })
            .then(data => {setBoulders(data); return data})
            .catch(error => {
                toaster.create({
                    title: "Error",
                    type: "error",
                    description: error.message,
                })
            })
        }, [selectedPlace])


    function handleLogClimbClick() {
        setLogClimbModalOpen(true)
    }

    function handleLogClimbSumbit() {
        if(activeSessions.activeSessions.length < 1) {
            toaster.create({
                title: "Error",
                description: "You must start a session before logging a climb",
                type: "error"
            })
            return
        }
        const activeSession = activeSessions.activeSessions[0]
        const place = places.filter(place => place.id === activeSession.placeId)[0]
    }

    function startNewSessionClick() {

        if(activeSessions.activeSessions.length > 0) {
            toaster.create({
                title: "Error",
                description: "You already have an active session",
                type: "error"
            })
            return
        }
        setNewSessionModalOpen(true)
    }

    function handleSessionStartClick() {
        if(selectFieldPlaceValue.length < 1) {
            toaster.create(
                {
                    title: "Error",
                    description: "Please select a place to climb",
                    type: "error"
                }
            )
            return
        }
        const placeId = parseInt(selectFieldPlaceValue[0])
        const place = places.filter(place => place.id === placeId)[0]
        if(!place) {
            toaster.create(
                {
                    title: "Error",
                    description: "Place not found",
                    type: "error"
                }
            )
        }
        setSelectedPlace(place)
        activeSessions.addSession({id: crypto.randomUUID(), dateStarted: date.toDateString(), placeId: placeId, routeAttempts: []})
        setNewSessionModalOpen(false)
        setSelectFieldPlaceValue([])
    }

    function handleCloseSessionClick() {
        if(activeSessions.activeSessions.length < 1) {
            toaster.create({
                title: "Error",
                description: "You must start a session before closing it",
                type: "error"
            })
            return
        }
        setSelectedPlace(null)
        activeSessions.closeSession(activeSessions.activeSessions[0].id)
    }





    const placeFields = places.map((place: Place) => {
        return({label: place.name, value: place.id.toString()})
    })
    const routeFields = boulders.map((boulder) => {
        return({label: `${boulder.boulder.name}`, value: boulder.boulder.id.toString(), description: boulder.boulder.description || "No description"})
    })
    const formFields = [
        {label: "Route", name: "route", type: "select", options: routeFields, placeholder: "Select a route"},
        {label: "Attempts", name: "attempts", type: "number", placeholder: "Enter attempts"},
        {label: "Completed", name: "completed", type: "checkbox" value="completed"},
    ]




    const activeSession = activeSessions.activeSessions[0]

    return(
        <Box shadow="2px" w="full" color="bg.subtle" display="flex" justifyContent="center">
            <VStack>
                {/* Header, start new session button */}
                <HStack display="flex" justifyContent="space-between" w="md" justifySelf="center">
                    <Heading color="black" mr="md" size="2xl">Sessions</Heading>
                    {
                        !activeSession ? (
                            <Button
                                ml="md"
                                size="sm"
                                colorPalette="blue"
                                rounded="lg"
                                onClick={startNewSessionClick}
                            >Start New Session</Button>
                        ) : (
                            <Button
                                ml="md"
                                size="sm"
                                colorPalette="red"
                                rounded="lg"
                                onClick={() => handleCloseSessionClick()}
                            >Close Session</Button>
                        )
                    }
                </HStack>

                {/* Active session */}
                {
                    activeSessions.activeSessions.length > 0 ? (
                        <Box>
                            <Box
                                rounded="md"
                                w="md"
                                p="md"
                                bg="green.200"
                                shadow="md"
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                mb="md"
                            >
                                <HStack>
                                    <Text color="black">Active Session:</Text>
                                    {activeSessions.activeSessions.map((session: ActiveSession) => {
                                        const place = places.filter(place => place.id === session.placeId)[0]
                                        if(!place) {
                                            return (<></>)
                                        }
                                        return (
                                            <HStack>
                                                <Text color="fg">{`${place.name}, ${session.dateStarted}`}</Text>
                                            </HStack>
                                        )
                                    })}
                                </HStack>
                            </Box>
                        </Box>
                    ) : (
                        <Box
                            rounded="md"
                            w="md"
                            p="md"
                            bg="red.200"
                            shadow="md"
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb="md"
                        >
                            <Text color="black">No Active Sessions</Text>
                        </Box>
                        )
                }
                {
                    activeSessions.activeSessions.length > 0 && (
                        <Card.Root w="full">
                            <Card.Header>
                                <Card.Title>
                                    <HStack display="flex" justifyContent="space-between">
                                        <Text color="black">Session Info</Text>
                                        <Button
                                            colorPalette="gray"
                                            mr={2}
                                            onClick={() => {handleLogClimbClick()}}
                                        >+ Log Climb</Button>
                                    </HStack>
                                </Card.Title>

                            </Card.Header>
                            { activeSessions.activeSessions[0].routeAttempts.length > 0 ? (
                                <Card.Body>
                                    {activeSessions.activeSessions[0].routeAttempts.map((attempt) => {
                                        return(
                                            <Box>
                                                <Text color="black">Route Name: {attempt.routeId}</Text>
                                                <Text color="black">Route Attempts: {attempt.attempts}</Text>
                                            </Box>
                                        )
                                    })}
                                </Card.Body>
                            ) : (
                                <Card.Body>
                                    <Text color="black">No route attempts</Text>
                                </Card.Body>
                            )}

                        </Card.Root>
                    )
                }

            </VStack>
            <Modal isOpen={newSessionModalOpen} title="Choose a place to climb" size="md">
                <Modal.Body>
                    <Box>
                        <SelectField
                            value={selectFieldPlaceValue}
                            setValue={setSelectFieldPlaceValue}
                            fields={placeFields}
                            zIndex={9999}
                        />

                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Box>
                        <Button
                            colorPalette="blue"
                            onClick={() => handleSessionStartClick()}
                            mr={2}
                            mt={2}
                        >Save</Button>
                        <Button
                            colorPalette="red"
                            onClick={() => {setNewSessionModalOpen(false); setSelectFieldPlaceValue([])}}
                            ml={2}
                            mt={2}
                        >Close</Button>
                    </Box>
                </Modal.Footer>
            </Modal>
            <Modal isOpen={logClimbModalOpen} title="Log Climb" size="md">
                <Modal.Body>
                    <Box>
                        <AbstractForm fields={formFields} handleSubmit={handleLogClimbSumbit} footer={<></>} />
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setLogClimbModalOpen(false)}
                        colorPalette="red"
                        mt={2}
                    >Close</Button>
                </Modal.Footer>
            </Modal>

            <Toaster/>
        </Box>
    )
}

export default Sessions;