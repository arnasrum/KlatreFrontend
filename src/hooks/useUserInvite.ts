import { useState, useEffect } from "react";
import {apiUrl} from "../constants/global.ts";


type UserInviteProps = {
    groupId: number
}

type UserInviteReturn = {
    userInvites: string[]
    isLoading: boolean
    error: string | null
}

function useUserInvites({groupId}: UserInviteProps): UserInviteReturn {

    const [userInvites, setUserInvites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchInvites(groupId)
    }, [groupId])



    function fetchInvites(groupId: number) {
        setIsLoading(true)
        fetch(`${apiUrl}/api/invite/users?groupId=${groupId}`, {
            method: "GET",
            credentials: "include",
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })

    }

    function inviteUsers() {
        setIsLoading(true)
        fetch(`${apiUrl}/api/invite/users?groupId=${groupId}`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({groupId: groupId})
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
            })
            .then(() => {setUserInvites([])})
            .catch(error => {setError(error.message)})
            .finally(() => setIsLoading(false))
    }


    return {
        userInvites,
        isLoading,
        error
    }
}