import { useContext } from "react"
import { VStack, HStack, Box, Heading, Stat, Card, SimpleGrid } from "@chakra-ui/react";
import {apiUrl} from "../constants/global.ts";
import type RouteSend from "../interfaces/RouteSend.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import {TokenContext} from "../Context.tsx";

type RouteSendProps = {
    routeSend: RouteSend | null,
    boulderID: number,
}

function RouteSends(props: RouteSendProps) {
    const { routeSend, boulderID } = props
    const { user } = useContext(TokenContext)

    function handleAddClick() {
        const formData = new FormData();
        formData.set("boulderID", boulderID.toString());
        formData.set("attempts", "0");
        fetch(`${apiUrl}/boulders/place/sends`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + user.access_token
            },
            body: formData
        })
        .catch(error => console.error(error))
    }

    function handleDeleteClick() {
        // Implementation here
    }

    return (
        <Card.Root w="full">
            <Card.Header>
                <Heading size="md" color="gray.700">Your Stats</Heading>
            </Card.Header>
            <Card.Body>
                <SimpleGrid columns={2}>
                    <Card.Root bg="blue.50" border="1px" borderColor="blue.200">
                        <Card.Body>
                            <Stat.Root textAlign="center">
                                <Stat.ValueText 
                                    fontSize="2xl" 
                                    fontWeight="bold" 
                                    color="blue.600"
                                >
                                    0
                                </Stat.ValueText>
                                <Stat.Label color="blue.700" fontSize="sm">
                                    Attempts
                                </Stat.Label>
                            </Stat.Root>
                        </Card.Body>
                    </Card.Root>

                    <Card.Root bg="green.50" border="1px" borderColor="green.200">
                        <Card.Body>
                            <Stat.Root textAlign="center">
                                <Stat.ValueText 
                                    fontSize="2xl" 
                                    fontWeight="bold" 
                                    color="green.600"
                                >
                                    True
                                </Stat.ValueText>
                                <Stat.Label color="green.700" fontSize="sm">
                                    Completed
                                </Stat.Label>
                            </Stat.Root>
                        </Card.Body>
                    </Card.Root>
                </SimpleGrid>
                
                <VStack p={2} mt={4}>
                    <ReusableButton 
                        onClick={handleAddClick}
                        size="sm"
                        width="full"
                    >
                        Log Attempt
                    </ReusableButton>
                </VStack>
            </Card.Body>
        </Card.Root>
    )
}

export default RouteSends;