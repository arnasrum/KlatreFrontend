import { useState, useEffect } from "react";
import { apiUrl } from "../constants/global";
import { RouteAttempt, RouteAttemptDisplay, RouteAttemptDTO } from "../interfaces/RouteAttempt";

type Session = {
    id: number
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
    routeAttempts: RouteAttemptDisplay[]
    addRouteAttempt: (attempt: RouteAttemptDTO) => Promise<string>
    updateRouteAttempt: (attempt: RouteAttempt) => void
    deleteRouteAttempt: (attemptId: number) => void
    isLoading: boolean
    error: Error | null
    openSession: (placeId: number) => void
    closeSession: (id: number, save: boolean) => void
    clearError: () => void
}

export default function useSession({groupId, placeId}: UseSessionProps): UseSessionReturn {
    const [session, setSession] = useState<Session | null>(null);
    const [routeAttempts, setRouteAttempts] = useState<RouteAttemptDisplay[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [refetch, setRefetch] = useState<boolean>(false)

    useEffect(() => {
        fetchActiveSession()
    }, [placeId , refetch])

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
                setSession(data.data);
                return data.data
            })
            .then(data => {
                if(!data) return;
                fetchSessionAttempts(data.id)
            })
            .catch(error => {
                console.error('Failed to fetch places:', error);
            })
            .finally(() => {setIsLoading(false)})
    }

    function fetchSessionAttempts(id: string) {
        console.log("fetching attempts", id)
        fetch(`${apiUrl}/api/climbingSessions/attempts?sessionId=${id}`, {
            method: "GET",
            credentials: "include",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {setRouteAttempts(data.data); console.log("route attempts", data)})
            .catch(error => {setError(error)})
    }

    function addRouteAttempt(attempt: RouteAttemptDTO): Promise<string> {
        return new Promise((resolve, reject) => {
            if (!session) {
                reject(new Error("Session is not defined"));
                return;
            }
            fetch(`${apiUrl}/api/climbingSessions/add/attempt?sessionId=${session.id}`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(attempt),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    resolve(data.data);
                })
                .then(() => {setRefetch(prev => !prev)})
                .catch(error => {
                    reject(error);
                });
        });
    }

    function updateRouteAttempt(attempt: RouteAttempt) {
        console.log("updating attempt", attempt)
        fetch(`${apiUrl}/api/climbingSessions/update/attempt`, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: attempt.id,
                attempts: attempt.attempts,
                completed: attempt.completed,
                routeId: attempt.routeId,
                timestamp: attempt.timestamp,
                session: 0
            })
        })
            .then(response => {
                if(!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {console.log("updated attempt", data)})
            .then(() => {setRefetch(prev => !prev)})
            .catch(error => {setError(error)})
    }

    function deleteRouteAttempt(attemptId: number) {
        fetch(`${apiUrl}/api/climbingSessions/remove/attempt`, {
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
            .then(data => {setSession(data.data)})
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
            .then(() => console.log("closed session"))
            .then(() => clearAttempts())
            .catch(error => {
                console.error("Error closing session:", error)
                setError(error.message);
            })
            .finally(() => setIsLoading(false))
    }

    function clearError() {
        setError(null);
    }
    function clearAttempts() {
        setRouteAttempts([])
    }


    return {
        session,
        routeAttempts,
        isLoading,
        error,
        clearError,
        openSession,
        closeSession,
        addRouteAttempt,
        updateRouteAttempt,
        deleteRouteAttempt,
    }
}


