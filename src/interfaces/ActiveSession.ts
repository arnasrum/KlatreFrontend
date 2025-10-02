export type ActiveSession = {
    id: string,
    placeId: number,
    dateStarted: string,
    routeAttempts: {
        routeId: number,
        attempts: number,
        completed: boolean,
    }[]
}
