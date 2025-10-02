import React, {useContext, useState, useEffect, FormEvent} from "react";
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
import {RouteAttempt} from "../interfaces/RouteAttempt.ts";


interface SessionProps{
    places: Place[]
    groupId: number
}



function Sessions({places, groupId}: SessionProps): React.ReactElement {

    const activeSessions = useContext(SessionContext)
    const { user } = useContext(TokenContext)

    const [newSessionModalOpen, setNewSessionModalOpen] = useState(false)
    const [logClimbModalOpen, setLogClimbModalOpen] = useState(false)
    const [editClimbModalOpen, setEditClimbModalOpen] = useState(false)
    const [closeSessionModalOpen, setCloseSessionModalOpen] = useState(false)
    const [selectFieldPlaceValue, setSelectFieldPlaceValue] = useState<string[]>([])
    const [selectedPlace, setSelectedPlace] = useState<Place | null>(null)
    const [boulders, setBoulders] = useState<Boulder[]>([])
    const [editingAttempt, setEditingAttempt] = useState<RouteAttempt | null>(null)

    const activeSession = activeSessions.activeSessions.find(s => s.groupId === groupId);

    useEffect(() => {
        if(!selectedPlace && !activeSession) {
            return
        }
        const placeId = selectedPlace ? selectedPlace.id : activeSession!.placeId
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
        }, [selectedPlace, activeSession])


    function handleLogClimbClick() {
        setLogClimbModalOpen(true)
    }

    function startNewSessionClick() {

        if(activeSession) {
            toaster.create({
                title: "Error",
                description: "You already have an active session for this group",
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
        activeSessions.addSession({id: crypto.randomUUID(), groupId: groupId,  dateStarted: new Date().toDateString(), placeId: placeId, routeAttempts: []})
        setNewSessionModalOpen(false)
        setSelectFieldPlaceValue([])
    }

    function handleCloseSessionClick() {
        if(!activeSession) {
            toaster.create({
                title: "Error",
                description: "You must start a session before closing it",
                type: "error"
            })
            return
        }
        setCloseSessionModalOpen(true)
    }

    async function handleSaveAndCloseSession() {
        if(!activeSession) {
            return
        }

        try {
            const response = await fetch(`${apiUrl}/sessions`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${user.access_token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(activeSession)
            })

            if(!response.ok) {
                const json = await response.json()
                throw new Error(json.errorMessage || "Failed to save session")
            }

            toaster.create({
                title: "Success",
                description: "Session saved successfully",
                type: "success"
            })

            setSelectedPlace(null)
            activeSessions.closeSession(activeSession.id)
            setCloseSessionModalOpen(false)
        } catch (error) {
            toaster.create({
                title: "Error",
                type: "error",
                description: error instanceof Error ? error.message : "Failed to save session",
            })
        }
    }

    function handleDeleteSession() {
        if(!activeSession) {
            return
        }

        setSelectedPlace(null)
        activeSessions.closeSession(activeSession.id)
        setCloseSessionModalOpen(false)

        toaster.create({
            title: "Session Deleted",
            description: "Session was closed without saving",
            type: "info"
        })
    }

    function saveClimbAttempt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!activeSession) {
            toaster.create({
                title: "Error",
                description: "You must start a session before logging a climb",
                type: "error"
            })
            return
        }
        const formData = new FormData(event.currentTarget)
        const routeId = formData.get("route") as string
        const attempts = formData.get("attempts") as string
        if(!routeId || !attempts) {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields",
                type: "error"
            })
            return
        }
        const completed = formData.get("completed") == "on"
        console.log("Adding route attempt for groupId:", groupId)
        activeSessions.addRouteAttempt({id: crypto.randomUUID(), routeId: parseInt(routeId), attempts: parseInt(attempts), completed: completed, timestamp: Date.now()}, groupId)

        setLogClimbModalOpen(false)
    }

    function handleEditAttemptClick(attempt: RouteAttempt) {
        setEditingAttempt(attempt)
        setEditClimbModalOpen(true)
    }

    function saveEditedClimbAttempt(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if(!editingAttempt || !activeSession) {
            toaster.create({
                title: "Error",
                description: "Invalid attempt data",
                type: "error"
            })
            return
        }
        const formData = new FormData(event.currentTarget)
        const attempts = formData.get("attempts") as string
        if(!attempts) {
            toaster.create({
                title: "Error",
                description: "Please fill in all fields",
                type: "error"
            })
            return
        }
        const completed = formData.get("completed") == "on"

        // Update the route attempt
        const updatedAttempts = activeSession.routeAttempts.map(attempt =>
            attempt.id === editingAttempt.id
                ? {...attempt, attempts: parseInt(attempts), completed: completed}
                : attempt
        )

        // Update the session with the new attempts
        activeSessions.updateSession({
            ...activeSession,
            routeAttempts: updatedAttempts
        })

        setEditClimbModalOpen(false)
        setEditingAttempt(null)

        toaster.create({
            title: "Success",
            description: "Climb attempt updated",
            type: "success"
        })
    }

    function handleRemoveAttemptClick(attemptId: string) {
        if(!activeSession) {
            toaster.create({
                title: "Error",
                description: "No active session",
                type: "error"
            })
            return
        }

        const updatedAttempts = activeSession.routeAttempts.filter(attempt => attempt.id !== attemptId)

        // Update the session with the filtered attempts
        activeSessions.updateSession({
            ...activeSession,
            routeAttempts: updatedAttempts
        })

        toaster.create({
            title: "Success",
            description: "Climb attempt removed",
            type: "success"
        })
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
        {label: "Completed", name: "completed", type: "checkbox"},
    ]

    const editFormFields = editingAttempt ? [
        {label: "Attempts", name: "attempts", type: "number", placeholder: "Enter Attempts", defaultValue: editingAttempt.attempts.toString()},
        {label: "Completed", name: "completed", type: "checkbox", defaultValue: editingAttempt.completed},
    ] : []




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
                    activeSession ? (
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
                                    {(() => {
                                        const place = places.filter(place => place.id === activeSession.placeId)[0]
                                        if(!place) {
                                            return (<></>)
                                        }
                                        return (
                                            <HStack>
                                                <Text color="fg">{`${place.name}, ${activeSession.dateStarted}`}</Text>
                                            </HStack>
                                        )
                                    })()}
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
                            <Text color="black">No Active Session for this Group</Text>
                        </Box>
                    )
                }
                {
                    activeSession && (
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
                            { activeSession.routeAttempts.length > 0 ? (
                            <Card.Body>
                            <VStack gap={3} align="stretch">
                                {activeSession.routeAttempts.map((attempt: RouteAttempt, index) => {
                                    const boulder = boulders.find(b => b.boulder.id === attempt.routeId);
                                    const place = boulder ? places.find(p => p.id === boulder.boulder.place) : null;
                                    const gradeString = boulder && place
                                        ? place.gradingSystem.grades.find(g => g.id === boulder.boulder.grade)?.gradeString
                                        : "N/A";

                                    return(
                                        <Box
                                            key={index}
                                            p={3}
                                            bg="gray.50"
                                            rounded="md"
                                            border="1px solid"
                                            borderColor="fg.subtle"
                                        >
                                            <HStack justify="space-between" mb={2}>
                                                <Text color="black" fontWeight="bold" fontSize="lg">
                                                    {boulder ? boulder.boulder.name : `Route #${attempt.routeId}`}
                                                </Text>
                                                <Text
                                                    color="white"
                                                    bg={attempt.completed ? "green.500" : "orange.500"}
                                                    px={2}
                                                    py={1}
                                                    rounded="full"
                                                    fontSize="sm"
                                                    fontWeight="medium"
                                                >
                                                    {attempt.completed ? "✓ Sent" : "In Progress"}
                                                </Text>
                                            </HStack>
                                            <HStack gap={4} w="full" display="flex">
                                                <Text color="gray.700" fontSize="sm">
                                                    <strong>Grade:</strong> {gradeString}
                                                </Text>
                                                <Text color="gray.700" fontSize="sm">
                                                    <strong>Attempts:</strong> {attempt.attempts}
                                                </Text>
                                                <Button
                                                    colorPalette="blue"
                                                    size="sm"
                                                    onClick={() => handleEditAttemptClick(attempt)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    colorPalette="red"
                                                    size="sm"
                                                    onClick={() => handleRemoveAttemptClick(attempt.id)}
                                                >
                                                    Remove
                                                </Button>
                                            </HStack>
                                            {boulder?.description && (
                                                <Text color="gray.600" fontSize="sm" mt={2} fontStyle="italic">
                                                    {boulder.description}
                                                </Text>
                                            )}
                                        </Box>
                                    )
                                })}
                                </VStack>
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
                        >Start Climbing!</Button>
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
                        <AbstractForm
                            fields={formFields}
                            handleSubmit={saveClimbAttempt}
                            footer={
                                <HStack justifySelf="center" display="flex" justifyContent="center" w="full">
                                    <Button
                                        type="submit"
                                        colorPalette="blue"
                                        mt={2}
                                    >Save</Button>
                                    <Button
                                        onClick={() => setLogClimbModalOpen(false)}
                                        colorPalette="red"
                                        mt={2}
                                    >Close</Button>
                                </HStack>
                            }/>
                    </Box>
                </Modal.Body>
            </Modal>
            <Modal isOpen={editClimbModalOpen} title="Edit Climb Attempt" size="md">
                <Modal.Body>
                    <Box>
                        {editingAttempt && (
                            <>
                                <Text color="black" fontWeight="bold" mb={2}>
                                    {boulders.find(b => b.boulder.id === editingAttempt.routeId)?.boulder.name || `Route #${editingAttempt.routeId}`}
                                </Text>
                                <AbstractForm
                                    fields={editFormFields}
                                    handleSubmit={saveEditedClimbAttempt}
                                    footer={
                                        <HStack justifySelf="center" display="flex" justifyContent="center" w="full">
                                            <Button
                                                type="submit"
                                                colorPalette="blue"
                                                mt={2}
                                            >Save</Button>
                                            <Button
                                                onClick={() => {
                                                    setEditClimbModalOpen(false)
                                                    setEditingAttempt(null)
                                                }}
                                                colorPalette="red"
                                                mt={2}
                                            >Close</Button>
                                        </HStack>
                                    }/>
                            </>
                        )}
                    </Box>
                </Modal.Body>
            </Modal>
            <Modal isOpen={closeSessionModalOpen} title="Close Session" size="md">
                <Modal.Body>
                    <Box>
                        <Text color="black" mb={4}>
                            Would you like to save this session before closing it?
                        </Text>
                        <Text color="gray.600" fontSize="sm">
                            Saving will store your session data to the backend. Deleting will remove it permanently.
                        </Text>
                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <HStack justifySelf="center" display="flex" justifyContent="center" w="full">
                        <Button
                            colorPalette="green"
                            onClick={handleSaveAndCloseSession}
                            mt={2}
                        >Save Session</Button>
                        <Button
                            colorPalette="red"
                            onClick={handleDeleteSession}
                            mt={2}
                        >Delete Session</Button>
                        <Button
                            colorPalette="gray"
                            onClick={() => setCloseSessionModalOpen(false)}
                            mt={2}
                        >Cancel</Button>
                    </HStack>
                </Modal.Footer>
            </Modal>
            <Toaster/>
        </Box>
    )
}

export default Sessions;