

export type RouteAttempt = {
    id: number,
    routeId: number,
    grade: string,
    attempts: number,
    completed: boolean
    timestamp: number,
};

export type RouteAttemptDTO = {
    routeId: number,
    attempts: number,
    completed: boolean
    timestamp: string,
};