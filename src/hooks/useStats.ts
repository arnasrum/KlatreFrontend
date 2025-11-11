import { useState, useEffect } from "react";
import { apiUrl } from "../constants/global";
import UserStats from "../interfaces/UserStats.ts";

type useStatsProps = {
    groupId: number
    autoLoad?: boolean
}

type useStatsReturn = {
    userStats: UserStats[]
    isLoading: boolean,
    error: Error | null,
    refetchStats: () => void,
}

function useStats({groupId, autoLoad}: useStatsProps): useStatsReturn {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);
    const [userStats, setUserStats] = useState<UserStats[]>([]);


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
            .then((data: UserStats[]) => {setUserStats(data)})
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