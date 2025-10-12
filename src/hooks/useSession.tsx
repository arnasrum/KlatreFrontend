import React, { useState, useEffect } from "react";
import { apiUrl } from "../constants/global";
import { RouteAttempt, RouteAttemptDTO } from "../interfaces/RouteAttempt";



type Session = {
    id: string
    groupId: number
    placeId: number
    timestamp: number
}


type UseSessionProps = {
    groupId: number
    placeId?: number
}

type UseSessionReturn = {
    session: Session | null
    routeAttempts: RouteAttempt[]
    addRouteAttempt: (attempt: RouteAttemptDTO) => void
    updateRouteAttempt: (attempt: RouteAttempt) => void
    deleteRouteAttempt: (attemptId: number) => void
    isLoading: boolean
    error: Error | null
    openSession: (placeId: number) => void
    closeSession: (id: string, save: boolean) => void
}

export default function useSession({groupId, placeId}: UseSessionProps): UseSessionReturn {
    const [session, setSession] = useState<Session | null>(null);
    const [routeAttempts, setRouteAttempts] = useState<RouteAttempt[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [refetch, setRefetch] = useState<boolean>(false)

    useEffect(() => {
        fetchActiveSession()
        fetchSessionAttempts()
    }, [placeId, routeAttempts, refetch])

    function fetchActiveSession() {
        setIsLoading(true)
        const formData = new FormData();
        formData.append("groupId", groupId.toString());
        //formData.append("placeId", placeId.toString());
        fetch(`${apiUrl}/api/climbingSessions/active?groupId=${groupId}`, {
            method: "GET",
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                console.log("group fetch triggered", data)
                setSession(data.data);
            })
            .catch(error => {
                console.error('Failed to fetch places:', error);
            })
            .finally(() => {setIsLoading(false)})
    }

    function fetchSessionAttempts() {
        if(!session) return;
        fetch(`${apiUrl}/api/climbingSessions/attempts?sessionId=${session.id}`, {
            method: "GET",
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {setRouteAttempts(data)})
            .catch(error => {setError(error)})
    }

    function addRouteAttempt(attempt: RouteAttemptDTO) {
        if(!session)  {return}
        fetch(`${apiUrl}/api/climbingSessions/add/attempt`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                sessionId: session.id,
                attempt: attempt
            })
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                setRouteAttempts(prev => [...prev, data])
            })
            .catch(error => {
                console.error('Failed to fetch places:', error);
            })
    }

    function updateRouteAttempt(attempt: RouteAttempt) {
        if(!session)  {return}
        fetch(`${apiUrl}/api/climbingSessions/update/attempt`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                attempt: attempt
            })
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(() => {setRefetch(prev => !prev)})
            .catch(error => {setError(error)})
    }

    function deleteRouteAttempt(attemptId: number) {
        if(!session)  {return}
        fetch(`${apiUrl}/api/climbingSessions/delete/attempt`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                attemptId: attemptId
            })
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(() => {setRefetch(prev => !prev)})
            .catch(error => {setError(error)})
    }

    function openSession(placeId: number) {
        setIsLoading(true)
        const formData = new FormData();
        formData.set("groupId", groupId.toString());
        formData.set("placeId", placeId.toString());
        fetch(`${apiUrl}/api/climbingSessions/open`, {
            credentials: "include",
            method: "POST",
            body: formData,
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error("Error opening session");
                }
                return response.json()
            })
            .then(data => setSession(data.data))
            .catch(error => {
                console.error("Error opening session:", error)
                setError(error.message);
            })
            .finally(() => setIsLoading(false))
    }

    function closeSession(id: number, save: boolean) {
        setIsLoading(true)
        const formData = new FormData();
        formData.set("save", save.toString());
        formData.set("sessionId", id.toString());
        fetch(`${apiUrl}/api/climbingSessions/close`, {
            credentials: "include",
            method: "PUT",
            body: formData,
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error("Failed to close session");
                }
                return response.json()
            })
            .then(() => setSession(null))
            .catch(error => {
                console.error("Error closing session:", error)
                setError(error.message);
            })
            .finally(() => setIsLoading(false))
    }

    return {
        session,
        routeAttempts,
        isLoading,
        error,
        openSession,
        closeSession,
        addRouteAttempt,
        updateRouteAttempt,
        deleteRouteAttempt
    }
}


