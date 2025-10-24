
import { useEffect, useState } from "react";
import { apiUrl } from "../constants/global";

type PastSessionProps = {
    groupId: number
    autoLoad?: boolean
}

type PastSessionReturn = {
    pastSessions: object[]
    isLoadingPastSessions: boolean
    error: Error | null
    refetchPastSession: () => void
}


function usePastSessions(
    {groupId, autoLoad}: PastSessionProps,
): PastSessionReturn {
    const [pastSessions, setPastSessions] = useState<object[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [refetch, setRefetch] = useState<boolean>(false)

    useEffect(() => {
        fetchPastSession()
    }, [])


    function refetchPastSession() {
        fetchPastSession()
    }


    function fetchPastSession() {
        setIsLoading(true)
        fetch(`${apiUrl}/api/climbingSessions/past/${groupId}`, {
            credentials: "include",
            method: "GET",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                setPastSessions(data.data)
            })
            .catch(error => {
                console.error('Failed to fetch places:', error);
            })
            .finally(() => {setIsLoading(false)})
    }

    return {
        pastSessions,
        isLoadingPastSessions: isLoading,
        error: null,
        refetchPastSession: refetchPastSession,
    }
}

export { usePastSessions }