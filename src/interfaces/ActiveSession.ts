export type ActiveSession = {
    id: string,
    groupId: number,
    dateStarted: string,
    routeAttempts: {
        routeId: number,
        attempts: number,
        completed: boolean,
    }[]
}
