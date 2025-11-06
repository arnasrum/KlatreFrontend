import { useState, useEffect } from "react";
import { apiUrl } from "../constants/global";

type useStatsProps = {
    groupId: number
    autoLoad?: boolean
}

type useStatsReturn = {
    userStats: any
    isLoading: boolean,
    error: Error | null,
    refetchStats: () => void,
}

// Placeholder
type UserStats = {}

function useStats({groupId, autoLoad}: useStatsProps): useStatsReturn {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [userStats, setUserStats] = useState<any>([]);


    useEffect(() => {
        if(!autoLoad) return;
        fetchStats();
    }, [])

    function refetchStats() {
        fetchStats();
    }

    function fetchStats() {
        setIsLoading(true);
        fetch(`${apiUrl}/api/stats/user?groupId=${groupId}`, {
            credentials: "include",
            method: "GET",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {setUserStats(data)})
            .catch(error => {setError(error)})
            .finally(() => setIsLoading(false))
    }



    return(
        {
            "userStats": userStats,
            "isLoading": isLoading,
            "error": error,
            "refetchStats": refetchStats,
        }
    );

}

export { useStats };