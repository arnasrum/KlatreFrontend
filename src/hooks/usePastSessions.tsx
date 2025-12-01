import { useEffect, useState } from "react";
import { PastSession } from "../interfaces/ClimbingSession.ts"
import client from "../api/client";

type PastSessionProps = {
    groupId: number
    autoLoad?: boolean
}

type PastSessionReturn = {
    pastSessions: PastSession[]
    isLoadingPastSessions: boolean
    error: Error | null
    refetchPastSession: () => void
}


function usePastSessions(
    {groupId, autoLoad}: PastSessionProps,
): PastSessionReturn {
    const [pastSessions, setPastSessions] = useState<PastSession[]>([])
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
        client.get(`/climbingSessions/past/${groupId}`)
            .then(response => {
                if (response.status != 200) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.data
            })
            .then(data => {
                setPastSessions(data.toSorted((session: PastSession) => session.timestamp))
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