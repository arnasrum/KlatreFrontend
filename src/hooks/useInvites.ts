import {useState, useEffect, useContext} from 'react'
import {GroupInvite} from "../interfaces/GroupInvite.ts";
import {apiUrl} from "../constants/global.ts";
import { UserContext } from "../contexts/UserContext"
import client from "../api/client"

type UseInviteProps = {
}

type UseInviteReturn = {
    invites: GroupInvite[]
    refetchInvites: () => void
    isLoading: boolean
    error: Error
    acceptInvite: (inviteId: number) => void
    rejectInvite: (inviteId: number) => void
}

function useInvites(): UseInviteReturn {

    const [invites, setInvites] = useState<GroupInvite[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [refetch, setRefetch] = useState<boolean>(false)
    const [error , setError] = useState<Error>(null)
    const { isLoggedIn } = useContext(UserContext)

    useEffect(() => {
        if(!isLoggedIn) return;
        fetchPendingInvites()
    }, [refetch, isLoggedIn])

    function fetchPendingInvites() {
        setIsLoading(true)
        client.get("/invite/pending")
            .then(response => {
                return response.data
            })
            .then(data => {setInvites(data); return data})
            .then(data => console.log("invites", data))
            .catch(error => {setError(error)})
            .finally(() => setIsLoading(false))
    }

    function refetchInvitesHandler() {
        setRefetch(prev => !prev)
    }

    function acceptInvite(inviteId: number) {
        setIsLoading(true)
        fetch(`${apiUrl}/api/invite/accept?inviteId=${inviteId}`, {
            method: "PUT",
            credentials: "include",
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
            })
            .then(() => refetchInvitesHandler())
            .catch(error => {setError(error)})
            .finally(() => setIsLoading(false))
    }

    function rejectInvite(inviteId: number) {
        setIsLoading(true)
        fetch(`${apiUrl}/api/invite/reject?inviteId=${inviteId}`, {
            method: "PUT",
            credentials: "include",
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
            })
            .then(() => refetchInvitesHandler())
            .catch(error => {setError(error)})
            .finally(() => setIsLoading(false))
    }

    function revokeInvite(inviteId: number) {
        fetch(`${apiUrl}/api/invite/revoke?inviteId=${inviteId}`, {
            method: "PUT",
            credentials: "include",
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
            })

    }

    return {
        invites: invites,
        refetchInvites: refetchInvitesHandler,
        isLoading: isLoading,
        error: error,
        acceptInvite: acceptInvite,
        rejectInvite: rejectInvite
    }
}

export {useInvites}