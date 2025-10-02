import React, {useContext, useState} from "react";
import {Box, Button, Heading, HStack, VStack, Text, Card} from "@chakra-ui/react";
import Place from "../interfaces/Place.ts";
import SessionContext from "../hooks/useSession.ts"
import {ActiveSession} from "../interfaces/ActiveSession.ts";
import Modal from "../components/Modal.tsx";
import AbstractForm from "../components/AbstractForm.tsx";


interface SessionProps{
    places: Place[]
}



function Sessions({places}: SessionProps): React.ReactElement {

    const date = new Date()
    const activeSessions = useContext(SessionContext)
    const [newSessionModalOpen, setNewSessionModalOpen] = useState(false)



    function click() {
        setNewSessionModalOpen(true)
        //activeSessions.addSession({id: crypto.randomUUID(), dateStarted: date.toUTCString(), groupId: 1, routeAttempts: []})
    }


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
                                onClick={click}
                            >Start New Session</Button>
                        ) : (
                            <Button
                                ml="md"
                                size="sm"
                                colorPalette="red"
                                rounded="lg"
                                onClick={() => activeSessions.closeSession(activeSession.id)}
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
                                    <Text color="black">Active Session</Text>
                                    {activeSessions.activeSessions.map((session: ActiveSession) => {
                                        return (
                                            <HStack>
                                                <Text color="fg">{session.dateStarted}</Text>
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
            <Modal isOpen={newSessionModalOpen} title="Add a new session">
                <Modal.Body>
                    <Box>
                        <AbstractForm fields={undefined} handleSubmit={undefined}/>


                    </Box>
                </Modal.Body>
                <Modal.Footer>
                    <Box>
                        <Button colorPalette="blue" onClick={() => setNewSessionModalOpen(false)}>Save</Button>
                        <Button colorPalette="red" onClick={() => setNewSessionModalOpen(false)}>Close</Button>
                    </Box>
                </Modal.Footer>
            </Modal>

        </Box>
    )
}

export default Sessions;