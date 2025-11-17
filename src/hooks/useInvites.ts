import {useState, useEffect} from 'react'
import {GroupInvite} from "../interfaces/GroupInvite.ts";
import {apiUrl} from "../constants/global.ts";



type UseInviteProps = {
}

type UseInviteReturn = {
    invites: GroupInvite[]
    refetchInvites: () => void
    isLoading: boolean
    error: Error
}

function useInvites(): UseInviteReturn {

    const [invites, setInvites] = useState<GroupInvite[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [refetch, setRefetch] = useState<boolean>(false)
    const [error , setError] = useState<Error>(null)

    useEffect(() => {
        fetchPendingInvites()
    }, [refetch])


    function fetchPendingInvites() {
        setIsLoading(true)
        fetch(`${apiUrl}/api/invite/pending`, {
            method: "GET",
            credentials: "include",
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {setInvites(data); return data})
            .then(data => console.log("invites", data))
            .catch(error => {setError(error)})
            .finally(() => setIsLoading(false))
    }

    function refetchInvitesHandler() {
        setRefetch(prev => !prev)
    }

    return {
        invites: invites,
        refetchInvites: refetchInvitesHandler,
        isLoading: isLoading,
        error: error,
    }

}

export {useInvites}