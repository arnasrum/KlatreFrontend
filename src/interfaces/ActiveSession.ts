export type ActiveSession = {
    id: number
    groupId: number,
    dateStarted: string,
    routeAttempts: {
        routeId: number,
        attempts: number,
        completed: boolean,
    }[]
}
