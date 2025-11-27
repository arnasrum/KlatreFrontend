import { useState, useEffect } from "react";
import type Group from "../interfaces/Group.ts";
import client from "../api/client";



type GroupsReturn = {
    groups: Group[]
    refetchGroups: () => void
    isLoading: boolean
    error: Error | null
}

function useGroups(): GroupsReturn {
    const [groups, setGroups] = useState<Group[]>([]);
    const [refetch, setRefetch] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetchGroups()
    }, [refetch])

    function refetchGroups() {
        setRefetch(prev => !prev)
    }

    function fetchGroups() {
        setIsLoading(true);
        client.get("/groups")
            .then(response => {
                if(response.status != 200)  throw new Error(`HTTP error! status: ${response.status}`)
                return response.data
            })
            .then(data => {
                setGroups(data);
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => setIsLoading(false))
    }

    return {
        groups,
        refetchGroups,
        isLoading,
        error,
    }
}

export { useGroups }

