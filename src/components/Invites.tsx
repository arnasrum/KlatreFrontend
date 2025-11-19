import React, {useContext} from "react";
import {Box, Heading, Card, HStack, VStack, Button, Text} from "@chakra-ui/react";
import {useInvites} from "../hooks/useInvites.ts";
import {InviteContext} from "../contexts/InviteContext.tsx";


function Invites() {

    const {invites, refetchInvites, isLoading, error, acceptInvite, rejectInvite}  = useContext(InviteContext)

    return(
        <Box px={12} py={6}
             data-state="open"
             _open={{
                 animation: "fade-in 1000ms ease-out",
             }}
             display="flex"
             justifyContent="center"
        >
            <Card.Root
                w="60%"
                bg="gray.50"
                display="flex"
                justifyContent="center"
            >
                <VStack justifySelf="center">
                    <Card.Header>
                        <Heading size="xl">Invites</Heading>
                    </Card.Header>
                    <Card.Body w="100%" justifySelf="center">
                        {invites.length == 0 ? (
                           <Box
                               display="flex"
                               justifyContent="center"
                           >
                               <Text>No invites</Text>
                           </Box>
                        ) : (
                            <VStack w="100%" >
                                {invites.map((item) => {
                                    return <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        w="50%"
                                        p={2}
                                        bgColor="white"
                                        shadow="lg"
                                        rounded="xl"
                                    >
                                        <Box alignContent="center">
                                            <HStack gap={4}>
                                                <Text>{item.sender.name}</Text>
                                                <Text color="fg.subtle">{item.sender.email}</Text>
                                            </HStack>
                                            has invited you to join their group "{item.group.name}"
                                        </Box>
                                        <Box p={2} display="flex" gap={2}>
                                            <Button
                                                bgColor="green"
                                                variant="solid"
                                                justifySelf="end"
                                                onClick={() => {acceptInvite(item.id)}}
                                            >Accept</Button>
                                            <Button
                                                bgColor="red"
                                                variant="solid"
                                                onClick={() => {rejectInvite(item.id)}}
                                            >X</Button>
                                        </Box>
                                    </Box>

                                })}
                            </VStack>
                        )}

                    </Card.Body>
                </VStack>
            </Card.Root>
        </Box>
    )
}

export default Invites;