import React, {useState, useEffect} from 'react'
import {Heading, Box, Card, Button, Text, VStack, Tabs, HStack, Input, Separator} from '@chakra-ui/react'
import { apiUrl } from "../constants/global.ts";
import {toaster, Toaster} from "./ui/toaster";
import { UserRole } from "../interfaces/User.ts";



interface ManageUsersProps {
    groupID: number
}

function ManageUsers({groupID}: ManageUsersProps) {

    const [refetch, setRefetch] = useState<boolean>(false)
    const [users, setUsers] = useState<UserRole[]>([])

    useEffect(() => {

        fetch(`${apiUrl}/api/groups/users?groupID=${groupID}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error))
    }, [refetch]);

    function handleChangeUserPermissions(role: number, groupID: number, userID: number) {
        const formData = new FormData();
        formData.set("role", role.toString());
        formData.set("groupId", groupID.toString());
        formData.set("userId", userID.toString());
        fetch(`${apiUrl}/api/groups/users/permissions`, {
            method: "PUT",
            credentials: "include",
            body: formData
        })
            .then(response => {
                if(!response.ok) {
                    return response.json().then(json => {throw new Error(json.errorMessage)})
                }
                return response.json()
            })
            .then(data => {toaster.create({title: "Success", description: data.message, type: "success"})})
            .then(() => setRefetch((prev: boolean) => !prev))
            .catch(error => {
                    toaster.create({title: "Error occurred", description: error.message, type: "error"})
            })
    }

    function handleKick(groupID: number, userID: number) {

        const formData = new FormData();
        formData.set("groupId", groupID.toString())
        formData.set("userId", userID.toString())
        fetch(`${apiUrl}/api/groups/users/kick`, {
            method: "DELETE",
            credentials: "include",
            body: formData,
            })
                .then(response => {
                    if(!response.ok) {
                        return response.json().then(json => {throw new Error(json.errorMessage)})
                    }
                    return response.json()
                })
                .then(() => toaster.create({title: "User successfully kicked", type: "success"}))
                .then(() => setRefetch((prev: boolean) => !prev))
                .catch(error => toaster.create({title: "Error occurred", description: error.message, type: "error"}))

    }


    function userEntries(users: UserRole[]): React.ReactNode {
        return users.map((user: UserRole) => {
            let role = user.isAdmin ? "Admin" : "Member"
            if(user.isOwner) {role = "Owner"}
            return (
                <Card.Root key={user.id} m={4} p={4} borderWidth="1px" borderRadius="lg" boxShadow="lg"
                >
                    <Card.Header>
                        <VStack display="flex" flexWrap="wrap" justifyContent="start">
                            <Heading size="md" justifySelf="start">{`${user.name}`}</Heading>
                            <Text color="gray.500" fontSize="sm" ml={2}>
                                {user.email}
                            </Text>
                        </VStack>
                    </Card.Header>
                    <Card.Body>
                        <Box>
                            <Text>{role}</Text>
                        </Box>
                    </Card.Body>
                    <Card.Footer>
                        {user.isAdmin ? (
                            <Button
                                disabled={user.isOwner}
                                onClick={() => handleChangeUserPermissions(2, groupID, user.id)}
                            >Revoke Admin</Button>
                        ) : (
                            <Button
                                disabled={user.isOwner}
                                onClick={() => handleChangeUserPermissions(1, groupID, user.id)}
                            >Make Admin</Button>
                        )}
                        <Button colorPalette="red" disabled={user.isOwner} onClick={() => handleKick(groupID, user.id)}>Kick</Button>
                    </Card.Footer>
                </Card.Root>
            )
        })
    }

    return (
        <Box w="100%" h="70%">
            <Tabs.Root defaultValue={"manage"}>
                <Tabs.List>
                    <VStack display="flex" flexWrap="wrap" justifyContent="start" w="100%" h="100%" p={4}>
                        <HStack display="flex" justifyContent="center">
                            <Tabs.Trigger value="manage">
                                <VStack>
                                    Manage Users
                                </VStack>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="invite">
                                Invite Users
                            </Tabs.Trigger>
                        </HStack>
                        <Separator color="gray.300" mx={4} my={2} />
                        <Tabs.Content value="manage">
                            <Box display="flex" justifyContent="start" flexWrap="wrap">
                                {users && users.length > 0 && (
                                    userEntries(users)
                                )}
                            </Box>
                        </Tabs.Content>
                        <Tabs.Content value="invite">
                            <VStack>
                                <HStack>
                                    <Input type="email" placeholder="Email" />
                                    <Button>Invite</Button>
                                </HStack>
                            </VStack>
                        </Tabs.Content>
                    </VStack>
                </Tabs.List>
            </Tabs.Root>

            <Toaster/>
        </Box>
    )
}

export default ManageUsers