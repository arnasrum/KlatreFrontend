import React, {useContext} from "react";
import {Box, Heading, Card, HStack, VStack, Button, Text} from "@chakra-ui/react";
import {InviteContext} from "../contexts/InviteContext.tsx";
import {AnimatePresence, motion} from "framer-motion";


function Invites() {

    const {invites, acceptInvite, rejectInvite}  = useContext(InviteContext)

    return(
        <Box px={4} py={6}
             data-state="open"
             _open={{
                 animation: "fade-in 1000ms ease-out",
             }}
             display="flex"
             justifyContent="center"
        >
            <Card.Root
                bg="gray.50"
                maxW={{ base: "100%", lg: "3xl" }}
                w="100%"
            >
                <VStack w="100%">
                    <Card.Header>
                        <Heading size="xl">Invites</Heading>
                    </Card.Header>
                    <Card.Body w="100%" justifySelf="center">
                        <AnimatePresence>
                            {invites.length == 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0}}
                                    animate={{ opacity: 1}}
                                    exit={{opacity: 0}}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        width: "100%"
                                    }}
                                >
                                    <Box
                                        display="flex"
                                        justifyContent="center"
                                    >
                                           <Text>No invites</Text>
                                   </Box>
                                </motion.div>
                            ) : (
                                <VStack w="100%" gap={4}>
                                    {invites.map((item) => {
                                        return <motion.div
                                            key={item.id}
                                            initial={{ opacity: 0, x: 100}}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{opacity: 0, x: 100}}
                                            transition={{ duration: 0.3 }}
                                            layout
                                        >
                                        <Box
                                            key={item.id}
                                            display="flex"
                                            justifyContent="space-between"
                                            flexDirection={{ base: "column", md: "row" }}
                                            alignItems={{ base: "stretch", md: "center" }}
                                            w="100%"
                                            p={4}
                                            gap={2}
                                            bgColor="white"
                                            shadow="lg"
                                            rounded="xl"
                                        >
                                            <Box alignContent="center">
                                                <HStack gap={2} flexWrap="wrap">
                                                    <Text
                                                        fontWeight="bold"
                                                        overflow="hidden"
                                                        textOverflow="ellipsis"
                                                    >
                                                        {item.sender.name}</Text>
                                                    <Text
                                                        color="fg.subtle"
                                                        fontSize="sm"
                                                        display="block"
                                                    >{item.sender.email}</Text>
                                                </HStack>
                                                has invited you to join their group "{item.group.name}"
                                            </Box>
                                            <HStack
                                                p={2}
                                                justifyContent={{ base: "space-between", md: "flex-end" }}
                                                w={{ base: "100%", md: "auto" }}
                                            >
                                                <Button
                                                    bgColor="green.500"
                                                    _hover={{ bgColor: "green.600" }}
                                                    variant="solid"
                                                    onClick={() => {acceptInvite(item.id)}}
                                                    flexGrow={{base: 1, md: 0}}
                                                >Accept</Button>
                                                <Button
                                                    bgColor="red.500"
                                                    _hover={{ bgColor: "red.600" }}
                                                    variant="solid"
                                                    onClick={() => {rejectInvite(item.id)}}
                                                >X</Button>
                                            </HStack>
                                        </Box>
                                        </motion.div>
                                    })}
                                </VStack>
                            )}
                        </AnimatePresence>
                    </Card.Body>
                </VStack>
            </Card.Root>
        </Box>
    )
}

export default Invites;