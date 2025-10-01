import React, {useContext, useState} from "react";
import {Box, Button, Heading, HStack, VStack, Text, useConst} from "@chakra-ui/react";
import Place from "../interfaces/Place.ts";
import SessionContext from "../hooks/useSession.ts"


interface SessionProps{
    places: Place[]
}



function Sessions({places}: SessionProps): React.ReactElement {

    const date = new Date()
    const session = useContext(SessionContext)
    function click() {
        session.addSession({id: 1, dateStarted: date.toUTCString(), groupId: 1, routeAttempts: []})
    }

    return(
        <Box shadow="2px" w="full" color="bg.subtle" display="flex" justifyContent="center">
            <VStack>

                {/* Header, start new session button */}
                <HStack display="flex" justifyContent="space-between" w="md" justifySelf="center">
                    <Heading color="black" mr="md" size="2xl">Sessions</Heading>
                    <Button
                        ml="md"
                        size="sm"
                        colorPalette="blue"
                        rounded="lg"
                        onClick={click}
                    >Start New Session</Button>
                </HStack>

                {/* Active session */}
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
                    <Text color="black">Active Session</Text>


                </Box>


            </VStack>




        </Box>
    )
}

export default Sessions;