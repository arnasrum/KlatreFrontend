

export type RouteAttempt = {
    id: number,
    route: string,
    grade: string,
    attempts: number,
    completed: boolean
    timestamp: string,
};

export type RouteAttemptDTO = {
    routeId: number,
    attempts: number,
    completed: boolean
    timestamp: string,
};