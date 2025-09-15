import React, {useState, useEffect, useContext} from 'react'
import {Heading, Box, Card, Button, Text, VStack} from '@chakra-ui/react'
import { apiUrl } from "../constants/global.ts";
import {TokenContext} from "../Context.tsx";
import {toaster, Toaster} from "../components/ui/toaster.tsx";



interface ManageUsersProps {
    groupID: number
}

function ManageUsers({groupID}: ManageUsersProps) {

    const { user, isLoading: userLoading } = useContext(TokenContext)
    const [refetch, setRefetch] = useState<boolean>(false)
    const [users, setUsers] = useState<Array<any>>([])


    useEffect(() => {

        fetch(`${apiUrl}/api/groups/users?groupID=${groupID}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.access_token}`
            }
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error))
    }, [refetch]);

    function handleChangeUserPermissions(role: number, groupID: number, userID: number) {
        const formData = new FormData();
        formData.set("role", role.toString());
        formData.set("groupID", groupID.toString());
        formData.set("userID", userID.toString());
        fetch(`${apiUrl}/api/groups/users/permissions`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${user.access_token}`
            },
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
        formData.set("groupID", groupID.toString())
        formData.set("userID", userID.toString())
        fetch(`${apiUrl}/api/groups/users/kick`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${user.access_token}`
            },
            body: formData,
            })
                .then(response => {
                    if(!response.ok) {
                        return response.json().then(json => {throw new Error(json.errorMessage)})
                    }
                    return response.json()
                })
                .then(data => toaster.create({title: "User successfully kicked", type: "success"}))
                .then(() => setRefetch((prev: boolean) => !prev))
                .catch(error => toaster.create({title: "Error occurred", description: error.message, type: "error"}))

    }


    function userEntries(users: Array<any>): React.ReactNode {
        return users.map((user: any) => {
            let role = user.isAdmin ? "Admin" : "Member"
            if(user.isOwner) {role = "Owner"}
            return (
                <Card.Root key={user.id} m={4} p={4} borderWidth="1px" borderRadius="lg" boxShadow="lg">
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
                            <Button colorPalette="blue"
                                    disabled={user.isOwner}
                                    onClick={() => handleChangeUserPermissions(2, groupID, user.id)}
                            >Revoke Admin</Button>
                        ) : (
                            <Button
                                colorPalette="blue"
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
        <Box>
            <Heading>Manage Users</Heading>
            <Box display="flex" justifyContent="start" flexWrap="wrap">
                {users && users.length > 0 && (
                    userEntries(users)
                )}
            </Box>
            <Toaster/>
        </Box>
    )
}

export default ManageUsers