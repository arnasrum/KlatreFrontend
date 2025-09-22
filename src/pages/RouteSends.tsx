import React, { useState, useContext, useEffect } from "react"
import {
    VStack,
    HStack,
    Box,
    Heading,
    Stat,
    Card,
    SimpleGrid,
    Spinner,
    Editable,
    IconButton,
    Text
} from "@chakra-ui/react";
import {apiUrl} from "../constants/global.ts";
import type RouteSend from "../interfaces/RouteSend.ts";
import ReusableButton from "../components/ReusableButton.tsx";
import {TokenContext} from "../Context.tsx";
import {LuCheck, LuPencilLine, LuX} from "react-icons/lu";

type RouteSendProps = {
    routeSend: RouteSend | null,
    boulderID: number,
}

function RouteSends(props: RouteSendProps) {
    const { boulderID } = props
    const { user } = useContext(TokenContext)
    const [routeSend, setRouteSend] = useState<RouteSend | null>(null)
    const [attempts, setAttempts] = useState<number>(0)
    const [refetch, setRefetch] = useState<boolean>(false)
    const [sendEdited, setSendEdited] = useState<boolean>(false)


    useEffect(() => {
        if(!sendEdited) {return}
            fetch(`${apiUrl}/api/routeSends/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.access_token}`
                },
                body: JSON.stringify(routeSend)
            })
                .then(response => {
                    if(!response.ok) {
                        return response.json().then(json => {throw new Error(json.message)})
                    }
                })
                .then(() => refetchRouteSendHandler())
                .catch(error => console.error(error))
                .finally(() => setSendEdited(false))

    }, [routeSend]);

    useEffect(() => {
        fetch(`${apiUrl}/api/routeSends?routeId=${boulderID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.access_token}`
            }
        })
            .then(response => {
                if((!response.ok)) {
                    return response.json().then(json => {throw new Error(json.errorMessage)})
                }
                return response.json()})
            .then(data => {console.log("data", data); return data;})
            .then(data => {
                setRouteSend(data[0])
                setAttempts(data[0]?.attempts ?? 0)
            })
            .catch(error => console.error(error))
    }, [boulderID, refetch])

    function refetchRouteSendHandler() {
        setRefetch((prev: boolean) => !prev)
    }

    function handleAttemptSubmit() {
        setSendEdited(true)
        setRouteSend({...routeSend, attempts: attempts})
    }
    function handleCompletedChange() {
        setSendEdited(true)
        setRouteSend({...routeSend, completed: !routeSend.completed})
    }

    const handleValueChange = (value: string) => {
        const numericValue = parseInt(value) || 0
        setAttempts(numericValue)
    }

    const handleCancel = () => {
        setAttempts(routeSend?.attempts ?? 0)
    }

    const handleClickOutside = () => {
        setAttempts(routeSend?.attempts ?? 0)
    }

    if(!routeSend) {
        return (
            <Box>
                <Heading>Route Sends</Heading>
                <Spinner/>
            </Box>
        )
    }

    function completedCard(completed: boolean): React.ReactNode {
        const color = completed ? "green" : "red"
        return(
            <Card.Root bg={color.concat(".50")} border="1px" borderColor="green.200">
                <Card.Body onClick={handleCompletedChange}>
                    <Stat.Root textAlign="center" flex="flex" justifyContent="center">
                        <Stat.ValueText
                            fontSize="2xl"
                            fontWeight="bold"
                            color={color.concat(".600")}
                        >
                            {completed ? "Yes" : "No"}
                        </Stat.ValueText>
                        <Stat.Label color={color.concat(".700")} fontSize="sm">
                            {completed ? "Completed" : "Not Completed"}
                        </Stat.Label>
                    </Stat.Root>
                </Card.Body>
            </Card.Root>
        )
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
                            <Editable.Root
                                value={attempts.toString()}
                                onInteractOutside={handleClickOutside}
                            >
                                <Editable.Preview
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    color="blue.600"
                                />
                                <Editable.Input
                                    fontSize="2xl"
                                    fontWeight="bold"
                                    color="blue.600"
                                    onInput={(event) => {
                                        const target = event.target as HTMLInputElement
                                        target.value = target.value.replace(/[^0-9]/g, '')
                                    }}
                                    value={attempts.toString()}
                                    onChange={event => {handleValueChange(event.target.value)}}
                                />
                                <Editable.Control>
                                    <Editable.EditTrigger asChild>
                                        <IconButton variant="ghost" size="xs">
                                            <LuPencilLine/>
                                        </IconButton>
                                    </Editable.EditTrigger>
                                    <Editable.SubmitTrigger asChild>
                                        <IconButton 
                                            colorPalette="green"
                                            onClick={handleAttemptSubmit}
                                        >
                                            <LuCheck/>
                                        </IconButton>
                                    </Editable.SubmitTrigger>
                                    <Editable.CancelTrigger asChild>
                                        <IconButton
                                            colorPalette="red"
                                            onClick={handleCancel}
                                        >
                                            <LuX/>
                                        </IconButton>
                                    </Editable.CancelTrigger>
                                </Editable.Control>
                            </Editable.Root>
                            <Text fontSize="sm" color="blue.700">Attempts</Text>
                        </Card.Body>
                    </Card.Root>
                    {completedCard(routeSend.completed ?? false)}
                </SimpleGrid>
            </Card.Body>
        </Card.Root>
    )
}

export default RouteSends;