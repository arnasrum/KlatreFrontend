
import { useEffect, useState } from "react";

type PastSessionProps = {
    groupId: number
    autoLoad?: boolean
}

type PastSessionReturn = {
    pastSessions: object[]
    isLoading: boolean
    error: Error | null
}


function usePastSessions(
    {groupId, autoLoad}: PastSessionProps,
) {
    const [pastSessions, setPastSessions] = useState<object[]>([])

    useEffect(() => {

    }, [])

    function fetchPastSession() {
        fetch(`{apiUrl}/api/climbingSessions/past?groupId=${groupId}}`, {
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
    }

    return {
        pastSessions
    }
}

export default usePastSessions