import { useState, useEffect } from "react";
import type Place from "../interfaces/Place.ts";
import {apiUrl} from "../constants/global";



type PlaceHooksOptions = {
    groupId: number
    autoload?: boolean
}


type PlaceHooksReturn = {
    places: Place[]
    refetchPlaces: () => void
    isLoading: boolean
    error: Error | null
}

const usePlaceHooks = ({
    groupId,
    autoload = true
}: PlaceHooksOptions): PlaceHooksReturn => {

    const [places, setPlaces]  = useState<Place[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<Error | null>(null)


    useEffect(() => {
        if(!autoload) return;
        fetchPlaces()
    }, [])

    function fetchPlaces() {
        setIsLoading(true)
        fetch(`${apiUrl}/api/places?groupID=${groupId}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }
                return response.json()
            })
            .then(data => {
                setPlaces(data);
            })
            .catch(error => {
                console.error('Failed to fetch places:', error);
                setError(error);
                setPlaces([]);
            })
            .finally(() => {setIsLoading(false)})
    }
    return {
        places,
        refetchPlaces: fetchPlaces,
        isLoading,
        error,
    }
}

export { usePlaceHooks }